# PLAN B — Engineering Bible
### Part 4: Development Architecture (Pre-Code)

*Builds directly on Part 1 (IA), Part 2 (Design System), and Part 3 (UX Blueprint). Every architectural decision below exists to serve those documents without contradiction — no screen, entity, or flow described here should require any of them to change.*

---

## 1. Tech Stack

Each choice is justified against three fixed constraints from Parts 1–3: (a) the catalog must scale from 10 to 50,000 resources without redesign, (b) PDFs are the core asset and must never be directly accessible, (c) the primary audience is Indian university students, which shapes payment and cost decisions specifically.

| Layer | Choice | Why | Alternatives considered |
|---|---|---|---|
| **Frontend** | **Next.js (React), TypeScript** | Server-side rendering is required for Section 19's SEO strategy (Subject/Resource pages must be crawlable and fast-indexing); file-based routing maps naturally onto the `/course/branch/semester/subject/resource` URL hierarchy from Part 3, Section 19; React's component model matches Part 2's strict Primitive → Base → Composite → Pattern hierarchy directly | Plain React + Vite (rejected: no built-in SSR, would need a bolted-on SEO solution); Nuxt/Vue (rejected: smaller hiring pool, no functional advantage here) |
| **Backend** | **Node.js with NestJS, TypeScript** | NestJS enforces a controller/service/repository structure out of the box (Section 3 needs exactly this discipline); TypeScript end-to-end means the Resource schema (Part 1, Section 3.2) is a single shared contract between frontend and backend, eliminating an entire class of integration bugs as the team grows | Django/Python (rejected: strong ORM but splits the team's type system across two languages); Laravel/PHP (rejected: smaller modern hiring pool, less natural fit for a real-time payment/webhook-heavy backend) |
| **Database** | **PostgreSQL** | Relational integrity is essential for the shared-subject mapping model (Part 1, Section 3.1) — many-to-many Subject↔Branch relationships, referential integrity on Orders/Resources, and mature support for full-text search (Section 9) without an early dependency on a separate search engine | MongoDB (rejected: the domain is inherently relational — courses, branches, subjects, resources, orders — forcing this into a document model would fight the data, not help it); MySQL (rejected: Postgres has better native full-text search and JSONB support for flexible metadata fields, useful as new resource types are added) |
| **Authentication** | **Custom JWT-based auth (access + refresh tokens), with Google OAuth as a provider** | Part 3, Section 10 requires guest browsing with auth deferred to Checkout — a lightweight, self-hosted JWT layer keeps that boundary entirely in application control rather than depending on a third party's session model; Google OAuth is layered on top as the fast-path login | Firebase Auth (rejected: convenient early, but couples identity data to a third party in a way that complicates the eventual Faculty/Admin/Moderator role system in Section 21); Auth0/Clerk (viable, revisit only if team size can't justify maintaining custom auth — noted as an acceptable swap since auth is isolated behind a service boundary, Section 3) |
| **Payment Gateway** | **Razorpay** | The dominant, most trusted gateway for Indian students specifically — native UPI support (Part 3, Section 11 ordered UPI first for exactly this reason), strong webhook reliability for order verification (Section 12) | Stripe (rejected as primary: weaker UPI-first experience for this exact audience, though it remains a candidate if international/university expansion happens later — the Payment Architecture in Section 12 is written to be gateway-agnostic behind a service boundary specifically to keep this option open) |
| **Cloud Storage** | **Cloudflare R2** (S3-compatible object storage) | Zero egress fees matter directly here — PDF downloads are the entire product, and egress-fee-per-download would scale badly and unpredictably as volume grows toward 50,000 resources; fully S3-API-compatible, so nothing in the application layer is locked to a proprietary storage API | AWS S3 (rejected as primary: egress costs on high-volume PDF delivery are a real, avoidable cost center; kept as a documented fallback since the S3-compatible API means switching is a config change, not a rewrite) |
| **Image Processing** | **Sharp (Node.js library)**, run as an async worker job | Thumbnail/preview-image generation (Section 6's Resource Pipeline) needs to run off the main request thread; Sharp is the standard, fast, well-maintained choice for this in a Node stack | Cloud-native image services (Cloudinary etc.) — viable but adds recurring per-image cost that isn't justified until volume genuinely requires managed infrastructure over a self-hosted worker |
| **PDF Processing** | **`pdf-lib` (watermarking, page manipulation) + `pdf-poppler`/`pdftoppm` (rasterizing pages to images for the blurred-preview treatment)** | Both are open-source, self-hostable, and give full control over exactly the locked/blurred page behavior specified in Part 3, Section 9 — critical since this is the single most trust-sensitive screen in the product and cannot depend on an opaque third-party rendering pipeline | Third-party "PDF as a service" APIs (rejected: recurring cost per document at this volume, plus less control over the specific blur/watermark treatment the brand depends on) |
| **Email Service** | **Resend** (or Postmark as an equivalent) | Transactional-only email needs (purchase receipts, password reset, version-update notifications per Part 3, Section 16) — both offer strong deliverability without the marketing-email baggage of a platform like Mailchimp, which the product deliberately doesn't need (Part 2/3 explicitly ruled out newsletters) | SES (viable, cheaper at scale, revisit once volume justifies the added setup complexity) |
| **Analytics** | **PostHog (self-hostable or cloud)** | Covers Part 3, Section 20's event list (Course Selected, Preview Opened, etc.) with product-analytics-specific tooling (funnels, drop-off analysis) rather than a general web-analytics tool; self-hostable option keeps student data in-house, consistent with the "not invasive" principle from Section 20 | Google Analytics (rejected as primary: built for marketing-site analytics, not funnel/event analysis; also a third-party data-sharing relationship the brand's privacy posture wants to avoid where a self-hosted alternative exists) |
| **Deployment** | **Vercel (frontend) + Railway or Render (backend/API) + managed Postgres (Neon or Supabase's Postgres)** | Matches the Next.js/NestJS split cleanly; both platforms support the environment-per-branch workflow needed for Section 20's dev/staging/production pipeline without custom infrastructure work in year one | Self-managed Kubernetes/AWS (rejected for initial scale: real infra-engineering overhead not justified until the team and traffic are large enough to need it — the architecture is written so this migration is possible later without an application rewrite, see Section 27) |
| **Monitoring** | **Sentry** (error tracking, both frontend and backend) | Direct, focused crash/error visibility, tightly integrated with both Next.js and NestJS | — |
| **Logging** | **Structured JSON logging (Pino) shipped to a hosted log platform (e.g., Better Stack/Logtail)** | Structured logs are required for the Audit Log requirement in Section 15 and for debugging the async Resource Pipeline (Section 6) where failures happen outside a normal request/response cycle | — |

**Future scalability note common to all choices above**: every layer was picked specifically because it has a clear, documented upgrade path (managed Postgres → self-managed cluster; Railway → Kubernetes; Razorpay-only → multi-gateway) that requires *configuration and infrastructure* changes, not *application rewrites* — this mirrors Part 1's "10 to 50,000 without redesign" principle at the engineering layer.

---

## 2. Project Structure (Folder Hierarchy Philosophy)

No files generated — organizational logic only, explained top-down.

**Backend (`/backend`)**
- `src/modules/` — one folder per domain module (`courses`, `branches`, `semesters`, `subjects`, `resources`, `orders`, `payments`, `auth`, `users`, `admin`) — each module is self-contained: its own controller, service, repository, and DTOs live together, so a developer never has to hunt across the codebase to understand one feature end-to-end.
- `src/modules/<module>/` — internally split into `*.controller.ts` (HTTP layer only), `*.service.ts` (business logic), `*.repository.ts` (data access), `dto/` (request/response shapes), `entities/` (database models scoped to that module).
- `src/common/` — cross-cutting code shared by every module: guards (auth/role checks), interceptors (response formatting), pipes (validation), decorators, filters (error handling) — anything here must be genuinely used by 3+ modules, or it belongs in the module that owns it.
- `src/config/` — environment/config loading, one file per concern (`database.config.ts`, `storage.config.ts`, `payment.config.ts`) — never scattered `process.env` calls throughout business logic.
- `src/database/` — migrations, seed scripts, the schema definitions referenced in Section 5.
- `src/jobs/` — async worker definitions (Resource Pipeline stages, email sending, search index updates) — deliberately separated from `modules/` because these run outside the request/response cycle and have different error-handling/retry needs.
- `src/utils/` — pure, stateless helper functions only (formatting, slugify, hashing) — no business logic allowed here, a common source of "spaghetti" if left unchecked.
- `test/` — mirrors `src/` structure exactly, one test folder per module.

**Frontend (`/frontend`)**
- `app/` (Next.js App Router) — routes mirror the IA/URL hierarchy directly: `app/[course]/[branch]/[semester]/[subject]/[resource]/page.tsx`, plus top-level routes for `dashboard/`, `search/`, `checkout/`.
- `components/`
  - `primitives/` — Button, Input, Badge, Icon — Part 2's lowest layer, styled purely from design tokens, zero business logic.
  - `base/` — Card (base shell), Modal, Drawer, Skeleton — still generic, no domain knowledge.
  - `composite/` — CourseCard, ResourceCard, TranscriptTrail, SearchPanel — domain-aware, built only from `primitives/` and `base/`, matching Part 2 Section 23's Component Hierarchy exactly.
  - `patterns/` — full page sections (ResourceGrid, CheckoutSummary) built from `composite/` — this four-folder split *is* Part 2's hierarchy enforced structurally, so a developer literally cannot import a lower layer's dependency incorrectly without it being visible in the folder path.
- `lib/` — API client, auth helpers, formatting utilities shared across pages.
- `hooks/` — reusable React hooks (`useAuth`, `useCart`, `useResourceQuery`).
- `styles/` — design tokens as the single source of truth (Part 2, Section 20) — every component consumes tokens from here, never a hardcoded value.
- `public/assets/` — icons, logo files, static images only — no user-uploaded content ever lives here (that's Section 7's storage system, entirely separate).

**Shared**
- `/packages/shared-types` (if using a monorepo, e.g., Turborepo) — the Resource/Subject/Order type definitions shared between frontend and backend, so the "single schema" principle from Section 1 is enforced by the build system, not just convention.

**Other top-level folders**
- `/docs` — this document set (Parts 1–4+) plus onboarding docs, API conventions (Section 22), and architectural decision records for anything that later deviates from this bible.
- `/infra` — deployment configs, environment templates (never actual secrets — see Section 15).

---

## 3. Backend Architecture

**Philosophy**: strict layering, one direction of dependency only — Controller → Service → Repository → Database. No layer ever reaches backward.

| Layer | Responsibility | Must never do |
|---|---|---|
| **Controller** | Parse/validate the incoming request shape, call exactly one service method, format the response | Contain business logic, query the database directly, know about other modules' internals |
| **Service** | All business logic — pricing rules, ownership checks, the Resource Pipeline orchestration, coupon validation | Know about HTTP (no request/response objects), talk to the database directly (always through a repository) |
| **Repository** | Database queries only, scoped to one entity/module | Contain business rules (e.g., a repository fetches a resource; it does not decide whether the user is *allowed* to see it — that's the service's job) |
| **Model/Entity** | Defines the shape of a database table and its relationships | Contain any logic beyond simple computed getters |
| **Middleware/Guard** | Cross-cutting request concerns — auth verification, rate limiting, role checks | Contain feature-specific logic — a guard checks "is this user an admin," never "does this user own this specific resource" (that belongs in the service) |
| **Validation (DTOs/Pipes)** | Enforce request/response shape and type correctness at the boundary | Enforce business rules ("is this coupon still valid" is a service concern, not a validation concern) |
| **Config** | Load and expose environment-derived settings | Contain any logic beyond simple defaults |

**Why this prevents spaghetti code specifically**: every one of Part 3's screens maps to exactly one or two services (e.g., Checkout → `OrdersService` + `PaymentsService`), and every service maps to exactly one module folder (Section 2). A developer adding a new feature can always answer "which file does this logic belong in" from this table alone — there is no ambiguous middle ground where logic could plausibly live in three different places, which is the actual mechanism by which large codebases degrade over time.

---

## 4. Frontend Architecture

**Component hierarchy** (restated from Part 2, Section 23, now mapped to real engineering structure):

```
primitives/  →  base/  →  composite/  →  patterns/  →  app/ (pages)
```

- **Reusable components**: every card type in Part 3 (Course, Branch, Semester, Subject, Resource, Review, Statistic, Pricing) is a `composite/` component built from the *same* `base/Card` shell — enforced by having only one `Card` component in the codebase; per-context styling comes from props/variants, never from a duplicated component file. This is the literal engineering enforcement of Part 2 Section 11's "one Resource Card forever" rule.
- **Layout system**: a single `patterns/PageShell` component (navbar + Transcript Trail + footer slot) wraps every route — guarantees the persistent nav behavior from Part 3, Section 12 without each page reimplementing it.
- **Navigation system**: the Transcript Trail is a single `composite/TranscriptTrail` component that reads the current route and renders itself — it is never manually constructed per-page, which is what makes "the Trail survives ten years unchanged" (Part 2, Section 12) actually enforceable rather than aspirational.
- **Page templates**: each IA layer (Course, Branch, Semester, Subject) shares one `patterns/TileGridPage` template (Part 2's tile-grid layout), configured by data, not rebuilt per layer — again, this is what makes new Course/Branch/University nodes a data change, not a code change (Part 1, Section 7; Part 3, Section 21).
- **Forms**: a single `composite/FormField` wrapping `base/Input`, `base/Dropdown`, etc. — Checkout, Login, and Settings forms all compose from the same primitives, per Part 2 Section 10.
- **Search / Filters**: `composite/SearchPanel` (global) and `composite/FilterChips` (resource-list-scoped) — deliberately separate components, matching Part 3 Section 15's decision that Global Search and in-page filtering serve different jobs and should never be merged into one overloaded component.
- **Modals / Drawers**: single `base/Modal` and `base/Drawer` components, used for Preview (desktop modal), mobile filter/menu drawers, and confirmation dialogs (e.g., Delete Account) — one implementation, multiple content slots.

---

## 5. Database Strategy (Entity Hierarchy, No SQL)

**Core entities**, matching Part 1's data model directly:

- **University** — top-level, holds Courses. (Currently one row: GGSIPU — Part 1, Section 7.)
- **Course** — belongs to University. (~30 rows, only B.Tech active.)
- **Branch** — belongs to Course. (Multiple rows per course, 3 active initially.)
- **Semester** — a fixed lookup-style entity (1–6, plus a special "Internship & Placement" row) — not generated per-branch; instead related to Branch through the mapping table below.
- **Subject** — a **platform-level entity**, per Part 1 Section 3.1 — does *not* belong directly to one Branch.
- **Branch–Semester–Subject Mapping** (a proper mapping/junction table) — this is the entity that makes the shared-subject model real: each row says "this Subject appears in this Branch at this Semester." Multiple Branches can point to the same Subject row without duplicating it.
- **ResourceType** — a lookup table (Cheat Sheet, Revision Notes, PYQ Solutions, Placement Handbook, etc.) — deliberately a table, not a hardcoded enum in application code, so Part 3 Section 21's "new resource types are just data" promise is literally true at the database level, not just the API level.
- **Resource** — belongs to Subject (nullable, for Internship & Placement Hub items) and ResourceType; holds price, status, version, file references (pointing to Section 7's storage system, not storing files itself).
- **User** — student accounts; role field distinguishes Student/Admin/(future) Faculty/Moderator.
- **Order** — belongs to User, holds one or more Order Items.
- **OrderItem** — belongs to Order and Resource (supports bundles: one Order can have multiple Order Items).
- **Payment** — belongs to Order; holds gateway transaction reference, status, verification data (Section 12).
- **Coupon** — standalone; validity rules (date range, usage limit) referenced at checkout time.
- **Wishlist** — mapping table between User and Resource.
- **Review** — belongs to User and Resource (future community reviews, Part 3 Section 21).
- **DownloadLog** — belongs to User and Resource; records each signed-URL issuance (Section 10's re-download rules depend on this).
- **AuditLog** — records admin actions (resource published, price changed, refund issued) — append-only, never edited.

**Relationships, summarized:**

```
University 1─* Course 1─* Branch
Branch *─* Subject   (via Branch–Semester–Subject mapping, carries Semester too)
Subject 1─* Resource
ResourceType 1─* Resource
User 1─* Order 1─* OrderItem *─1 Resource
Order 1─1 Payment
User *─* Resource   (via Wishlist)
User 1─* DownloadLog *─1 Resource
```

**Indexes** (conceptual, not literal SQL): every foreign key gets an index by default; additional indexes on `Resource.status` (constantly filtered to "live" in every listing query), `Resource.subject_id + type` (the exact query Part 3's Resource List page runs), `Order.user_id + status` (Dashboard's Purchases tab), and a full-text index on `Subject.name + code` and `Resource.title` for Section 9's search.

**Lookup tables**: ResourceType, Semester (fixed labels), CourseCategory (the "Engineering/Commerce/Science" grouping from Part 3 Section 3) — kept as real tables rather than hardcoded strings so admin-editable labeling never requires a deploy.

**Audit tables**: AuditLog (admin actions) and DownloadLog (student download events) are structurally identical in spirit — append-only, timestamped, never mutated — both exist specifically to answer "what happened and when" without relying on memory or trust.

**Normalization strategy**: the schema is fully normalized (3NF) at the structural layer (Courses, Branches, Subjects, Resources are never duplicated data), with one deliberate denormalization allowance: computed/cached counts (e.g., `Subject.resource_count`) may be stored redundantly and refreshed async, purely for the Section 6 Subject Page's "Resource Count" field to render without a live aggregate query on every request at 50,000-resource scale. This is the one explicitly sanctioned exception, and it's chosen precisely because it doesn't affect correctness of the core relational model — only display performance.

**Future expansion**: adding a second University, a new Course, or a new ResourceType is a data insert, never a schema migration — the only schema migrations expected long-term are for genuinely new *entities* (e.g., a `Subscription` table for future subscription support, Section 24).

---

## 6. File Storage

**Folder organization** (within the R2/S3 bucket, logical prefixes, not literal filesystem folders):

```
/resources/{resource_id}/original.pdf        (never publicly accessible — see Section 10)
/resources/{resource_id}/preview.pdf         (watermarked, page-limited version used by the PDF Preview screen)
/resources/{resource_id}/pages/{n}.jpg       (rasterized page images, used for the locked/blurred preview treatment)
/resources/{resource_id}/thumbnail.jpg       (card thumbnail, Part 2/3's Resource Card)
/branches/{branch_id}/icon.svg
/courses/{course_id}/icon.svg
/users/{user_id}/avatar.jpg
/invoices/{order_id}/invoice.pdf
```

- **Naming strategy**: IDs, never human-readable filenames, in every path — prevents guessable-URL enumeration (a student should never be able to infer another resource's storage path from its title) and sidesteps filename-collision/encoding issues entirely at 50,000-item scale.
- **Security**: the entire `/resources/{id}/original.pdf` and `/resources/{id}/pages/` prefixes are **never** bucket-public — every access goes through the signed-URL flow in Section 10, with no exceptions, including for admin preview.
- **Versioning**: when a resource is updated (Part 3, Section 13's "future updates" promise), the new file is stored as `original-v2.pdf` alongside `original.pdf` (not overwritten) — the Resource entity's `current_version` pointer is updated, and prior versions remain retrievable for audit/rollback purposes, satisfying both the Version History UI (Part 3, Section 8) and the Backup/Recovery needs in Section 16.

---

## 7. Resource Pipeline

The full sequence from Admin upload to a resource being live, matching the stages you specified, each explained:

1. **Admin uploads PDF** — via the Admin Panel's Resource module (Section 14); file goes to a temporary/quarantine storage prefix first, never directly to the public-facing structure above.
2. **Validation** — file type/MIME check (must genuinely be a PDF, not just have a `.pdf` extension), file size limits, page-count sanity check — rejects obviously malformed uploads before any expensive processing begins.
3. **Virus scan** — run against a scanning service (e.g., ClamAV as a self-hosted worker, or a managed scanning API) before the file moves out of quarantine — non-negotiable given the file will eventually be downloaded by thousands of students.
4. **Thumbnail generation** — Sharp renders the first page to a card-thumbnail-sized JPEG (Section 6's `thumbnail.jpg`).
5. **Preview generation** — the configured percentage of unlocked pages (Part 3, Section 9 — typically 20–30%) are rasterized at full quality; remaining pages are rasterized at lower quality specifically for the blur treatment (no need to waste processing on crisp images that will be blurred anyway) and watermarked per page with the "Preview — Plan B" mark (Part 2, Section 3).
6. **Compression** — the original PDF is compressed (without quality loss on text) to control storage/bandwidth costs, particularly relevant at 50,000-resource scale.
7. **Metadata extraction** — page count, file size, and (where available) embedded PDF metadata are extracted and written to the Resource entity automatically — this is what powers Section 13's "file size shown before download" without a manual admin data-entry step.
8. **Database entry** — a Resource row is created/updated with `status: draft` — visible in the Admin Panel but not yet live to students.
9. **Publish** — an explicit, separate admin action moves `status: draft → live` — deliberately a distinct step from upload, so an admin can review the generated preview/thumbnail before it becomes purchasable, catching pipeline errors (bad rasterization, wrong watermark placement) before a student ever sees them.

Every stage above runs as an **async job** (Section 2's `src/jobs/`), not inline during the HTTP upload request — an admin uploading a 40MB PDF should get an immediate "processing" confirmation, not a hung request; job status is polled/pushed back to the Admin Panel's UI.

---

## 8. Search Architecture

- **Keyword search**: Postgres full-text search (`tsvector`/`tsquery`) over Subject name/code and Resource title — sufficient at current and near-term scale; the architecture isolates search behind a service interface specifically so it can be swapped for a dedicated engine (Meilisearch/Typesense) later without touching any calling code, matching Part 3 Section 21's "AI Search extends the same entry point" plan.
- **Autocomplete**: served from the same indexed fields, limited to top-N matches, debounced client-side (Section 15 of Part 3's UX).
- **Tags**: Resource entities carry a lightweight tag array (JSONB) for cross-cutting search terms (e.g., "PYQ," "2024") beyond the structural hierarchy — supplements, never replaces, the hierarchy-based navigation.
- **Subject codes**: indexed as their own high-priority search field (exact-match boost) — this is the field power users will type directly (Part 3, Section 15).
- **Branch / Semester**: not directly full-text searched — instead used as **result-scoping filters** once a keyword match is found, since a student rarely searches "AI&DS" as a term, they search a subject or resource name and the branch context is shown *on* the result (Part 3, Section 15's mini-breadcrumb).
- **Popularity**: a `search_rank_boost` field on Resource, computed periodically (not live) from purchase/preview counts — used only to break ties among otherwise-equal keyword matches, never to override an exact subject-code match.
- **Future AI Search**: the search service interface accepts a query and returns ranked Resource IDs — semantic/AI-based matching is a drop-in replacement for the ranking function internally, with zero change to any caller (frontend, API contract) — directly fulfilling Part 3 Section 21's placeholder strategy.
- **Caching**: popular/empty-query results (Section 15's "Popular Searches") are cached with a short TTL (minutes, not hours) since they're read far more often than they change.

---

## 9. Payment Architecture

- **Order**: created the moment Checkout is entered (Part 3, Section 11) with `status: pending` — holds one or more Order Items (supports bundles natively, per Section 5's schema).
- **Payment**: a separate entity from Order, created when the gateway (Razorpay) checkout is initiated — separating Order from Payment allows one Order to have multiple Payment attempts (e.g., a first attempt fails, a second succeeds) without ever mutating or losing the original Order record.
- **Verification**: **server-side only**, via Razorpay's webhook + signature verification — the frontend reporting "payment succeeded" is never trusted on its own; an Order only moves to `status: paid` after the backend independently verifies the payment signature against Razorpay's servers. This is the single most important rule in this section.
- **Invoice**: generated automatically the moment an Order reaches `status: paid` (async job, per Section 7's pipeline pattern) — stored per Section 6's `/invoices/` path, linked from Dashboard (Part 3, Section 14).
- **Refund**: admin-initiated from the Admin Panel (Section 14), triggers a Razorpay refund API call, and the Order moves to `status: refunded` — access to the resource's signed-download flow (Section 10) is revoked the moment refund status is set.
- **Failed payment**: Order remains `status: pending` (never silently deleted) — enables the "Payment Failed" error screen (Part 3, Section 17) to explicitly reassure "no amount was charged," which is only truthfully sayable because the system never marks an Order paid without independent verification.
- **Duplicate prevention**: idempotency keys on payment-initiation requests, plus a check for an existing `pending`/`paid` Order for the same User+Resource combination before allowing a new Checkout to start — prevents the classic double-click-double-charge failure mode.
- **Coupon validation**: checked server-side at Checkout submission time (never trust a client-side "coupon applied" state) — validity window, usage limits, and applicability (resource/course-scoped coupons, if introduced) are all re-verified at the moment of payment, not just when the code was entered.
- **Bundle purchase**: a single Order with multiple Order Items, one Payment — no special-casing needed anywhere else in the system, because Section 5's schema already treats a bundle as "one order, many items."
- **Future subscription support**: modeled as a distinct `Subscription` entity (Section 5) with its own recurring-billing webhook handling — kept structurally separate from one-time Orders/Payments so subscription logic can be added without touching the proven one-time-purchase flow at all.

---

## 10. Download Architecture

**Core rule: students never receive a direct, permanent URL to any file.**

- **Secure downloads**: every download request goes through a backend endpoint that (1) verifies the requesting user owns the resource (an Order with `status: paid` containing that Resource), then (2) issues a **signed URL** (time-limited, single-resource-scoped) pointing at the storage bucket.
- **Signed URLs**: expire quickly (a few minutes) — long enough to complete a download, short enough that a leaked/shared link is useless shortly after issuance.
- **Download validation**: the ownership check in step (1) above is re-run on every download request, not cached client-side — re-downloading a month later re-verifies ownership fresh each time.
- **Ownership check**: `Order.status = paid AND OrderItem.resource_id = requested_resource_id AND Order.status != refunded` — the exact same check gates both the initial Download Experience screen (Part 3, Section 13) and any later re-download from the Dashboard.
- **Version updates**: when a Resource's `current_version` pointer changes (Section 6), existing owners' next download request automatically resolves to the new version's file — no separate "claim your update" action needed, fulfilling Part 3's "free updates" promise transparently.
- **Re-download rules**: unlimited, indefinite, for as long as the Order remains `paid` (not refunded) — explicitly stated in Part 3, Section 13, and enforced here by simply never expiring the *ownership* record, only the individual signed URLs.

---

## 11. Authentication

- **Guest**: unauthenticated browsing through the entire IA (Course → Preview), per Part 3 Section 10 — the backend serves all read-only Course/Branch/Semester/Subject/Resource/Preview data without requiring a token.
- **Student**: the default authenticated role, created at Checkout (Section 1's JWT approach) — can purchase, download, wishlist, review.
- **Admin**: elevated role, gates the entire Admin Panel (Section 14) — enforced by a role-check guard (Section 3) at the module level, not a per-endpoint afterthought.
- **Future Faculty / Moderators**: the `role` field on User is an enum designed with room for these from day one (`student | admin | faculty | moderator`) even though only `student`/`admin` are used initially — adding a role later is a permissions-table change, not a schema migration, matching Part 3 Section 21's Faculty Notes plan.
- **Roles & Permissions**: role-based (not fully granular permission-based) for v1 — simpler to reason about at this team size, with the User.role enum designed so a permissions table can be layered on top later without breaking existing role checks.
- **Sessions**: short-lived access tokens (JWT, ~15 min) + longer-lived refresh tokens (stored httpOnly, secure cookie) — access tokens are never long-lived enough to matter much if leaked; refresh tokens are the actual session and can be revoked server-side.
- **Remember Me**: controls refresh-token lifetime (e.g., 7 days unchecked, 30 days checked) — not a separate mechanism, just a different expiry applied to the same token.
- **Device management**: refresh tokens are stored per-device (a `Session` table keyed by user + device fingerprint/user-agent), letting Dashboard → Account (Part 3, Section 14) eventually list and revoke individual device sessions.
- **Password reset**: standard token-based email link flow (Section 1's email service), token single-use and short-lived.
- **Google Login**: OAuth2 flow, creates or matches a User by verified email — the account-creation-at-checkout principle (Part 3, Section 10) applies identically whether the path was email or Google.

---

## 12. Admin Panel

Each module maps directly to Section 5's entities and Part 3's student-facing screens it powers:

| Module | Function |
|---|---|
| **Dashboard** | At-a-glance KPIs — today's revenue, pending orders, recent signups — the admin's own "Landing page," same restraint principle as Part 2/3 applied to an internal tool |
| **Analytics** | Full metric set from Section 13 below |
| **Resources** | The Resource Pipeline UI (Section 7) — upload, review generated preview/thumbnail, publish/unpublish, edit price, manage versions |
| **Subjects** | Create/edit Subject records and their Branch–Semester mappings (Section 5) — this is where the shared-subject model is actually operated day-to-day |
| **Semesters** | Manage the fixed semester lookup labels (rarely changed, but editable without a deploy) |
| **Branches** | Create/edit Branch records, toggle active/Coming Soon status — this is the exact control that flips Part 3's Course/Branch Page states |
| **Courses** | Same pattern as Branches, one level up — toggling B.Tech's siblings live later happens here, with zero code changes, fulfilling Part 1's core scalability promise operationally |
| **Coupons** | Create/manage discount codes, validity windows, usage limits (Section 9) |
| **Orders** | Full order list/detail, manual status overrides for support cases, refund initiation |
| **Invoices** | Searchable invoice archive, resend-to-student action |
| **Support** | A lightweight queue view of contact-form submissions (Part 3's minimal Support model) — not a full ticketing system in v1, matching the deliberately small footprint from Part 3 Section 14 |
| **Announcements** | Optional platform-wide banners (e.g., "New Sem 5 resources live") — used sparingly, consistent with the no-marketing-spam notification rule (Part 3, Section 16) |
| **Version Updates** | Manage/publish new resource versions (feeds Section 10's "existing owners get the new version automatically" behavior) |
| **Settings** | Platform-level config — active University/Course toggles, global coupon rules, email templates |

---

## 13. Analytics (Admin-Facing)

| Metric | Why it matters |
|---|---|
| Visitors | Baseline traffic, top-of-funnel health |
| CTR (Browse → Course, Course → Branch, etc.) | Identifies exactly which IA layer loses students, per-layer |
| Conversion (Preview → Purchase) | The single most important number in the business — directly validates whether the trust model (Part 1, Section 5) is working |
| Most Purchased Subjects | Prioritizes which subjects need more/better resources next |
| Most Downloaded Resources | Surfaces the platform's actual best content, useful for the "Popular Subjects" landing section (Part 3, Section 1) |
| Revenue (by course/branch/semester/resource type) | Standard business health, sliced by the IA so it's immediately actionable, not just a total |
| Refunds (rate + reasons) | Quality signal — a spike in refunds for one resource flags a content or preview-accuracy problem fast |
| Search terms (especially zero-result ones) | Direct content-roadmap input (Part 3, Section 20) |
| Drop-off points | Where in the linear journey (Course→...→Checkout) students most often abandon — the same funnel data structurally required by Part 3's Screen Hierarchy (Section 22) |
| Returning users | Validates whether the "free updates" and re-engagement-through-need model (Part 3, Section 12/16) actually brings students back without marketing pressure |

All of the above are computed from the same event stream defined in Part 3, Section 20 — no separate tracking system, just different aggregations of one source of truth.

---

## 14. Security

| Concern | Approach |
|---|---|
| **Authentication** | JWT access/refresh as in Section 11; passwords hashed with bcrypt/argon2, never reversible |
| **Authorization** | Role guards at the module boundary (Section 3) + resource-level ownership checks in the service layer (Section 10) — two layers, neither optional |
| **Rate limiting** | Applied per-IP and per-user on auth endpoints (login, password reset), search, and download-URL issuance — the last one specifically to prevent signed-URL request abuse |
| **CSRF** | Not applicable to token-based API auth in the same way as cookie-session apps, but the refresh-token cookie is `httpOnly`, `Secure`, `SameSite=Strict` specifically to close this gap |
| **XSS** | React's default escaping + a strict Content-Security-Policy header; any admin-authored rich text (announcements, descriptions) is sanitized server-side before storage, not just at render time |
| **SQL Injection** | Fully mitigated structurally by using an ORM/query builder with parameterized queries everywhere — no raw string-concatenated queries permitted anywhere in the codebase, enforced via lint rule |
| **File upload validation** | MIME + extension + magic-byte verification, size caps, and the full Section 7 pipeline (including virus scan) before any uploaded file is trusted |
| **Payment verification** | Server-side signature verification only, per Section 9 — never trust client-reported payment state |
| **Admin protection** | Admin Panel behind its own auth check (role guard) *and* recommended IP-allowlisting or a separate subdomain for defense-in-depth, given how much trust concentrates in that surface |
| **Environment variables / secrets** | Never committed to the repository; managed via the deployment platform's secret store (Vercel/Railway env vars) — `.env.example` documents required keys with placeholder values only |
| **Audit logs** | Every admin action that changes state (publish/unpublish, price change, refund, coupon creation) writes an AuditLog row (Section 5) — append-only, queryable, forms the backbone of any future dispute or incident investigation |

---

## 15. Backups

- **Database backup**: automated daily full backups + continuous point-in-time recovery (standard managed-Postgres feature, e.g., Neon/Supabase) — retained 30 days rolling.
- **PDF backup**: object storage (R2) itself is redundant by design (multi-zone), but a secondary, periodic cross-provider backup (e.g., to a separate S3 bucket) protects against a provider-level incident, not just a hardware one — given original PDFs are irreplaceable business assets, this redundancy is treated as non-optional.
- **Preview backup**: preview assets are regenerable from the original PDF (Section 7's pipeline), so they are *not* separately backed up with the same rigor — this is a deliberate cost/effort tradeoff, since they can always be rebuilt on demand.
- **Disaster recovery**: documented runbook (in `/docs`) covering "database lost," "storage bucket lost," and "payment gateway outage" scenarios independently, since each has a different recovery path and different blast radius.
- **Recovery Time Objective**: database — under 1 hour to restore from point-in-time backup; storage — near-immediate for redundant multi-zone data, hours for a full cross-provider restore in the worst case.
- **Retention policy**: financial records (Orders, Payments, Invoices, AuditLogs) retained indefinitely for compliance; raw event/analytics data retained 12–24 months, aggregated summaries kept longer.

---

## 16. Performance

- **Caching**: structural IA data (Courses/Branches/Semesters — changes rarely) cached aggressively with long TTLs and explicit invalidation on Admin edits; Resource/pricing data cached with short TTLs (Section 5's schema note on this same split).
- **Image optimization**: Next.js's built-in image component (responsive sizing, modern formats) for all thumbnails; Sharp-generated assets are pre-sized at upload time (Section 7), never resized on the fly per-request.
- **Lazy loading**: card grids and images load on viewport entry (Part 3, Section 18); PDF preview pages load progressively (unlocked-first).
- **Database indexing**: as specified in Section 5 — every hot-path query (resource listing, order lookup, search) has a supporting index verified against real query plans before launch, not assumed.
- **Compression**: gzip/brotli at the CDN/edge layer for all text responses; PDFs compressed at pipeline time (Section 7), not per-request.
- **Pagination**: enforced everywhere Part 3 specifies it (Resource List) — no endpoint returns an unbounded result set, ever, regardless of whether the frontend currently requests all of it.
- **CDN**: static assets and public images served through the deployment platform's edge CDN by default (Vercel); signed PDF URLs are *not* CDN-cached publicly (would defeat the ownership-check model in Section 10), but can use short-lived, per-URL edge caching where the platform supports scoped caching safely.
- **Browser cache**: aggressive cache headers on immutable assets (versioned filenames, e.g., `thumbnail.abc123.jpg`), no-cache on anything ownership-gated.

---

## 17. API Philosophy

- **Naming**: REST, resource-noun-based, plural (`/courses`, `/branches`, `/resources`), nested only where the relationship is truly hierarchical and bounded (`/subjects/:id/resources`) — never nested more than two levels deep, to avoid the URL structure becoming as rigid as the IA itself; deep hierarchy (Course→Branch→Semester→Subject) is expressed through query parameters or dedicated lookup endpoints instead of ever-deeper nested paths.
- **Versioning**: a version prefix (`/v1/...`) from day one, even with only one version live — makes a future breaking change (e.g., for a mobile app with different needs, Section 24) additive, not disruptive to existing clients.
- **Pagination**: cursor-based (not offset-based) on any endpoint expected to scale toward large result sets (Resource listings, Orders) — offset pagination degrades in both performance and consistency once a list is large and changing, which Resource listings will be at 50,000 items.
- **Filtering**: consistent query-parameter conventions (`?type=cheat-sheet&sort=recent`) applied identically across every listable resource, so a frontend developer learns the pattern once.
- **Sorting**: an explicit, small allow-list of sortable fields per endpoint (never arbitrary field sorting) — both a security boundary (no query-injection surface) and a UX one (matches Part 3 Section 7's deliberately minimal sort options).
- **Consistency**: every list endpoint returns the same envelope shape (`data`, `pagination`, `meta`); every single-item endpoint returns the same base shape — a frontend developer should never need to check documentation to know an endpoint's basic response shape.
- **Response format**: JSON throughout, snake_case or camelCase chosen once and applied with zero exceptions (camelCase, to match the TypeScript-everywhere stack from Section 1).
- **Error format**: a single consistent error envelope (`code`, `message`, `details?`) across every endpoint — this is what lets the frontend's error-handling (Part 3, Section 17) be written once, generically, rather than per-endpoint.
- **Authentication strategy**: `Authorization: Bearer <token>` on every authenticated endpoint; public/guest endpoints (Course/Branch/Semester/Subject/Resource/Preview reads) accept no token at all, matching Part 3 Section 10's guest-browsing principle exactly at the API boundary.

---

## 18. SEO

- **URL hierarchy**: identical to Part 3, Section 19 — `/btech/ai-ds/sem-4/dsa-301` — implemented as literal Next.js route segments, so the SEO-friendly URL and the actual page-routing structure are the same thing, not a separate rewrite layer to maintain.
- **Metadata**: generated server-side per page from the Resource/Subject entity data at request time (Next.js metadata API) — title/description are template-driven from structured fields, never manually authored per page, essential at 50,000-page scale.
- **Canonical**: explicit canonical tag on every Subject/Resource page, pointing to the single canonical Branch path even when reachable from multiple branches (Part 1, Section 3.1's shared-subject model made concrete here) — prevents duplicate-content penalties directly.
- **Structured Data**: JSON-LD `Product` schema on Resource pages (price, availability, aggregateRating once real reviews exist), `BreadcrumbList` matching the Transcript Trail, `Organization` schema site-wide.
- **OpenGraph / Twitter Cards**: auto-generated per resource (Next.js OG image generation), pulling the resource title, subject, and price into a branded template using the actual design tokens (Part 2) — never a generic fallback image.
- **Sitemap**: auto-generated, regenerated on a schedule (not manually maintained) as new resources publish — segmented into multiple sitemap files once volume requires it (standard practice past ~50,000 URLs, conveniently exactly the target scale).
- **Robots**: public IA pages fully crawlable; Dashboard, Checkout, and any authenticated-only routes explicitly disallowed.

---

## 19. DevOps

- **Environments**: Development (local) → Testing (CI-run, ephemeral) → Staging (persistent, mirrors production config, used for admin/QA review before release) → Production.
- **Environment variables**: one `.env` schema shared across environments, values differing per environment via the deployment platform's environment-scoped secret store (Section 15) — never diverging schemas between staging and production, which is a common source of "works in staging, breaks in prod" bugs.
- **CI/CD**: every pull request runs lint + type-check + automated tests (unit + integration) before merge is allowed; merges to `main` auto-deploy to Staging; Production deploys are a deliberate, explicit promotion step (not automatic on every merge) — given payment and student-data sensitivity, production release stays a human decision, not a fully automated one.
- **Logging**: structured JSON logs (Section 1) shipped continuously from both frontend (client errors via Sentry) and backend (Pino → log platform) — correlated by a request ID that flows through both layers, so a single user-reported bug can be traced end-to-end.
- **Monitoring**: uptime checks on the API and frontend independently; Sentry alerts routed to the team for new/spiking error types; a dashboard for the Section 16 performance metrics (response time percentiles, not just averages).
- **Crash reporting**: Sentry captures both unhandled exceptions and, on the frontend, React error boundaries around each major Part 3 screen (Course, Checkout, Preview) — so a crash in one section never blanks the entire app, and the specific screen affected is immediately visible in the report.

---

## 20. Future Expansion — How Today's Architecture Already Supports It

| Feature | Why no architecture change is needed |
|---|---|
| **Mobile App** | The API (Section 17) is already a versioned, platform-agnostic REST contract consumed by the web frontend — a mobile app is simply a new client against the same `/v1` API, no backend change |
| **Desktop App** | Same reasoning as Mobile — a wrapped web view or a native client both consume the existing API contract unchanged |
| **Creator Marketplace** | The Resource entity already supports an `owner`/`creator` concept structurally trivially (add a `creator_id` field) — the Resource Pipeline (Section 7) already separates upload from publish, which is exactly the review gate a multi-creator marketplace needs |
| **Faculty Accounts** | The `role` enum on User (Section 11) already anticipates this; Faculty would get scoped permissions to their own Subject/Resource set, reusing the entire Admin Panel Resources module (Section 12) with a filtered view |
| **AI Search** | Section 8 explicitly isolates ranking behind a swappable service interface for exactly this |
| **AI Tutor** | Would consume the same Resource/Subject content as a new module, calling an LLM API — additive, doesn't touch the existing purchase/download flow at all |
| **AI Resource Generator** | Would feed into the same Resource Pipeline (Section 7) at the "admin uploads" stage — generated content still goes through validation → preview generation → publish identically |
| **Community Reviews** | Review entity (Section 5) already exists in the schema; only the UI's data source (curated → user-submitted) and a moderation queue (extending the Admin Panel) change |
| **Referral Program** | A new `Referral` entity tracking User→User relationships and a discount/credit mechanism layered onto the existing Coupon system (Section 9) — additive |
| **Affiliate System** | Structurally similar to Referral — tracked via a code parameter at Checkout, attributed at Order-creation time, no change to the core Order/Payment flow |
| **Team Accounts** | Would introduce an `Organization` entity that Users belong to, with shared Order/Wishlist visibility — additive to, not a replacement of, the existing User model |
| **Multi-University Support** | Part 1, Section 7 already establishes University as the top-level entity — this is purely a data-insert exercise, already covered end-to-end in Section 5 and Section 12 |
| **Offline Downloads** | The Download Architecture (Section 10) already produces a real file on-device — an offline-capable app simply caches that file locally with its own expiry logic, no new download mechanism needed |
| **Subscription Plans** | Section 9 already specifies a separate `Subscription` entity from day one, deliberately isolated from the one-time Order/Payment flow specifically so this doesn't require refactoring existing purchases |
| **API Access** (third-party developers) | The same versioned `/v1` API (Section 17), gated by a new API-key auth strategy layered alongside the existing JWT strategy — the underlying business logic (Services layer, Section 3) is already fully decoupled from *how* a request authenticates, so adding a second auth strategy doesn't touch a single service method |

The consistent mechanism across all fourteen: **every future feature attaches to an existing entity, module, or service boundary rather than requiring a new one** — the direct engineering-level proof of Part 1's founding scalability thesis.

---

## 21. Technical Architecture Summary

Next.js (TypeScript) frontend, NestJS (TypeScript) backend, PostgreSQL database, Cloudflare R2 object storage, Razorpay payments, JWT + Google OAuth authentication, Sharp/pdf-lib/poppler for the media pipeline, PostHog analytics, Sentry monitoring, deployed on Vercel + Railway/Render with managed Postgres — a fully typed, strictly layered, service-boundary-isolated system chosen specifically so that every dimension of future growth (catalog size, new universities, new roles, new revenue models, new client platforms) is absorbable as data or configuration, never as an architectural rewrite.

---

## 22. Folder Hierarchy Philosophy

One module = one folder, on both frontend and backend. Backend folders are organized by *domain* (courses, resources, orders); frontend components are organized by *abstraction layer* (primitives → base → composite → patterns). Nothing cross-cutting lives inside a domain folder; nothing domain-specific lives inside a shared folder. A new developer should always be able to predict a file's location from its responsibility alone, without needing tribal knowledge of the codebase's history.

---

## 23. Backend Responsibility Matrix

| Layer | Owns | Never touches |
|---|---|---|
| Controller | Request/response shape | Business logic, DB queries |
| Service | Business rules, orchestration | HTTP objects |
| Repository | DB queries | Business rules |
| Guard/Middleware | Cross-cutting auth/rate-limit checks | Feature-specific logic |
| Job (async worker) | Long-running/pipeline work (Section 7) | Synchronous request handling |

---

## 24. Frontend Responsibility Matrix

| Layer | Owns | Never touches |
|---|---|---|
| Primitives | Design tokens → basic elements (Button, Input, Badge) | Business/domain data |
| Base | Generic structural shells (Card, Modal, Drawer, Skeleton) | Domain-specific content |
| Composite | Domain-aware components (ResourceCard, TranscriptTrail) | Page-level layout/routing |
| Patterns | Full page sections (ResourceGrid, CheckoutSummary) | Raw styling values (must use tokens via lower layers) |
| App (pages) | Routing, data fetching, composing patterns | Component internals |

---

## 25. Security Checklist

- [ ] Passwords hashed (bcrypt/argon2), never stored/logged in plaintext
- [ ] JWT access tokens short-lived; refresh tokens httpOnly/Secure/SameSite
- [ ] Every mutating endpoint behind a role guard, verified in tests
- [ ] Ownership check (not just auth check) on every download/resource-detail endpoint touching paid content
- [ ] All queries parameterized; no raw string concatenation into SQL anywhere
- [ ] File uploads validated by MIME + magic bytes + virus scan before leaving quarantine storage
- [ ] Payment status changes only via verified server-side gateway signature, never client-reported
- [ ] Rate limits active on auth, search, and signed-URL issuance endpoints
- [ ] Admin panel behind role guard + network-level restriction (IP allowlist or separate subdomain)
- [ ] No secret ever committed to source control; `.env.example` kept current
- [ ] AuditLog entry written for every state-changing admin action

---

## 26. Deployment Checklist

- [ ] `.env` schema identical (keys, not values) across dev/staging/production
- [ ] CI runs lint + type-check + tests on every PR, blocking merge on failure
- [ ] Staging mirrors production configuration (same DB engine version, same storage provider)
- [ ] Production deploy is an explicit, human-triggered promotion, not automatic
- [ ] Database migrations reviewed and reversible before production deploy
- [ ] Monitoring/alerting (Sentry, uptime checks) confirmed active post-deploy
- [ ] Backup jobs verified running (not just configured) on a recurring schedule
- [ ] Rollback procedure documented and tested at least once before go-live

---

## 27. Scalability Checklist

- [ ] Every list endpoint paginated (cursor-based) — none return unbounded results
- [ ] Every hot-path query has a verified supporting index
- [ ] Structural IA data cached with long TTL + explicit invalidation; pricing/resource data cached short-TTL
- [ ] Object storage chosen for zero/low egress cost at high download volume (Section 1)
- [ ] New Course/Branch/University/ResourceType additions require zero code deploys — data only
- [ ] Search ranking isolated behind a swappable service interface (Section 8)
- [ ] Managed infrastructure (Vercel/Railway/managed Postgres) has a documented, non-rewrite migration path to self-managed infrastructure if traffic requires it

---

## 28. Future-Proofing Rules

1. **Every future feature must attach to an existing entity, module, or service boundary** — if it can't, that's a signal the feature needs more design work, not that the architecture needs a workaround.
2. **No hardcoded business data in application code** — Courses, Branches, Semesters, ResourceTypes are all database rows, never enums baked into the codebase.
3. **Payment status is never client-authoritative** — this rule has zero exceptions, present or future.
4. **Every new client platform (mobile, desktop, third-party API) consumes the same versioned API** — no platform-specific backend logic branches.
5. **Auth strategies are additive, never replacing** — new login/access methods (API keys, future SSO) are layered beside JWT, not built by modifying it.
6. **Denormalization is allowed only for read-performance caching of otherwise-correct normalized data** — never as a substitute for getting the relational model right in the first place (Section 5).

---

**End of Part 4.** This is the complete Engineering Bible — no code, SQL, API endpoints, or UML were produced, per instruction. Stopping here — no Part 5.
