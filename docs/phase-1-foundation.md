# PLAN B — Phase 1: Project Foundation
### Development Skeleton & Engineering Reference (Stack: NestJS + Next.js, per Part 4)

*This document is the permanent structural reference for the Plan B codebase. It contains no HTML, CSS, JavaScript, TypeScript, Python, SQL, or API endpoint code — only the folder skeleton, file responsibilities, architectural rules, and conventions that all future code must conform to. It builds directly on Parts 1–4 (Information Architecture, Design System, UX Blueprint, Engineering Bible) and contradicts none of them.*

---

## 1. Complete Folder Structure

Plan B is a **two-repo (or single-monorepo) system**: a NestJS API (`/backend`) and a Next.js application (`/frontend`), optionally unified under Turborepo with a `/packages/shared-types` package. The tree below shows the full skeleton at maturity — designed for the 50,000-resource scale from day one, per Part 1 and Part 4.

```
plan-b/
│
├── backend/                          # NestJS API — owns all business logic & data
│   ├── src/
│   │   ├── modules/                  # One folder per domain — self-contained features
│   │   │   ├── courses/
│   │   │   ├── branches/
│   │   │   ├── semesters/
│   │   │   ├── subjects/
│   │   │   ├── resources/            # The universal Resource object (Part 1, §3.2)
│   │   │   ├── resource-pipeline/     # Upload → watermark → preview → publish workflow
│   │   │   ├── orders/
│   │   │   ├── payments/              # Gateway-agnostic wrapper around Razorpay
│   │   │   ├── auth/                  # JWT + Google OAuth
│   │   │   ├── users/
│   │   │   ├── admin/                 # Admin-only endpoints, role-gated
│   │   │   ├── search/                # Keyword search now, semantic/AI search later (same module)
│   │   │   ├── reviews/               # Seeded now, user-submitted + moderation later
│   │   │   ├── notifications/         # Email triggers (receipts, resets)
│   │   │   └── analytics-events/      # PostHog event forwarding
│   │   │
│   │   ├── common/                    # Cross-cutting, used by 3+ modules only
│   │   │   ├── guards/                 # AuthGuard, RolesGuard
│   │   │   ├── interceptors/           # Response shaping, logging
│   │   │   ├── pipes/                  # Validation pipes
│   │   │   ├── filters/                # Global exception filters
│   │   │   └── decorators/             # @CurrentUser(), @Roles(), etc.
│   │   │
│   │   ├── config/                    # One file per concern, env-driven
│   │   │   ├── database.config.ts
│   │   │   ├── storage.config.ts
│   │   │   ├── payment.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── mail.config.ts
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeds/                  # Course/Branch/Semester seed data
│   │   │   └── schema/                 # Entity/table definitions referenced across modules
│   │   │
│   │   ├── jobs/                       # Async workers — outside request/response cycle
│   │   │   ├── resource-pipeline/       # Watermarking, thumbnailing, page rasterizing
│   │   │   ├── email/
│   │   │   └── search-index/
│   │   │
│   │   ├── utils/                      # Pure, stateless helpers only — no business logic
│   │   └── main.ts                     # Bootstrap only
│   │
│   ├── test/                           # Mirrors src/ exactly, one folder per module
│   ├── uploads-tmp/                    # Ephemeral local staging before upload to R2 — never committed, never served directly
│   └── scripts/                        # One-off/maintenance scripts (backfills, re-indexing)
│
├── frontend/                          # Next.js application — owns all presentation
│   ├── app/                            # App Router — mirrors the IA/URL hierarchy exactly
│   │   ├── (marketing)/
│   │   │   └── page.tsx                # Landing
│   │   ├── [course]/
│   │   │   ├── page.tsx                # Branch page
│   │   │   └── [branch]/
│   │   │       └── [semester]/
│   │   │           └── [subject]/
│   │   │               └── [resource]/
│   │   │                   └── page.tsx
│   │   ├── search/
│   │   ├── checkout/
│   │   ├── dashboard/
│   │   │   ├── purchases/
│   │   │   ├── wishlist/
│   │   │   ├── invoices/
│   │   │   ├── account/
│   │   │   └── support/
│   │   ├── admin/                      # Admin console, role-gated at the layout level
│   │   └── (error)/                    # 404 / 500 / maintenance / offline
│   │
│   ├── components/                     # Enforces Part 2 §23's strict hierarchy
│   │   ├── primitives/                  # Button, Input, Badge, Icon — token-only, zero domain logic
│   │   ├── base/                        # Card shell, Modal, Drawer, Skeleton — generic
│   │   ├── composite/                   # CourseCard, ResourceCard, TranscriptTrail, SearchPanel
│   │   └── patterns/                    # Full page sections — ResourceGrid, CheckoutSummary
│   │
│   ├── layouts/                         # Shared layout shells (Navbar+Footer shell, Dashboard shell, Admin shell)
│   ├── lib/                             # API client, auth helpers, formatting
│   ├── hooks/                           # useAuth, useCart, useResourceQuery
│   ├── styles/                          # Design tokens — single source of truth (Part 2 §20)
│   └── public/
│       └── assets/                      # Logo, icons, static images only — never user uploads
│
├── packages/
│   └── shared-types/                    # Resource/Subject/Order contracts shared front↔back
│
├── docs/                                # This document set + ADRs + API conventions
├── infra/                               # Deployment configs, env templates — never real secrets
└── .github/                             # CI workflows, PR templates
```

**Responsibility of each top-level folder**

| Folder | Responsibility |
|---|---|
| `backend/src/modules` | One self-contained feature per domain concept — never split a feature across two folders |
| `backend/src/common` | Only code genuinely reused by 3+ modules; anything narrower belongs inside its module |
| `backend/src/config` | The *only* place environment variables are read directly |
| `backend/src/database` | Schema, migrations, and seed data — never ad-hoc scripts that mutate data outside a migration |
| `backend/src/jobs` | Anything that must survive outside a single HTTP request lifecycle |
| `backend/src/utils` | Pure functions only — no side effects, no DB access, no business rules |
| `frontend/app` | Routing and page composition only — pages assemble components, they do not define new UI patterns |
| `frontend/components/*` | The four-layer hierarchy is structural law (Part 2 §23) — a folder violation is a code-review blocker |
| `frontend/layouts` | Shared page scaffolding (nav/footer/sidebar) — never route-specific business logic |
| `packages/shared-types` | The single legal definition of every cross-boundary data shape |
| `docs` | Living source of truth — any deviation from Parts 1–4 must be recorded here as an ADR, not silently made in code |
| `infra` | Config *shapes*, never actual secret values |

---

## 2. File Responsibilities

No code is generated here — only the contract each file type must honor.

| File | Why it exists | Responsible for | Must NEVER contain |
|---|---|---|---|
| `*.controller.ts` | HTTP boundary for one module | Parsing/validating request shape, calling exactly one service method, shaping the response | Business logic, direct DB queries, knowledge of other modules' internals |
| `*.service.ts` | Business logic for one module | Pricing rules, ownership checks, orchestration (e.g. Resource Pipeline steps), coupon validation | HTTP objects (`req`/`res`), direct DB access (must go through a repository) |
| `*.repository.ts` | Data access for one entity | Queries scoped to its own entity/module | Business rules — a repository fetches, it never decides *whether* the caller is allowed to see the result |
| `*.entity.ts` | Defines a DB table's shape and relationships | Column definitions, relations, simple computed getters | Any logic beyond a trivial getter |
| `*.dto.ts` | Defines request/response shape at the boundary | Type + validation-decorator definitions only | Business rule checks (e.g. "is this coupon expired" belongs in the service) |
| `*.guard.ts` | Cross-cutting request gate | "Is this user authenticated," "does this user have role X" | Feature-specific ownership logic ("does this user own *this* resource" — that's a service concern) |
| `*.config.ts` | Loads one concern's environment values | Reading env vars, exposing typed config objects, safe defaults | Any conditional business logic |
| `page.tsx` (Next.js) | Route entry for one URL segment | Composing `patterns/` and `composite/` components, fetching page-level data | New one-off UI markup that duplicates an existing composite/pattern |
| `layout.tsx` | Shared scaffold for a route subtree | Nav, footer, sidebar, role-gating for nested routes | Page-specific content |
| Files in `components/primitives/` | Lowest-level, token-driven UI atoms | Rendering from design tokens only | Any reference to a specific domain entity (no "Resource" knowledge here) |
| Files in `components/composite/` | Domain-aware building blocks | Combining primitives/base into one recognizable unit (e.g. ResourceCard) | Direct API calls — data arrives via props |
| Files in `components/patterns/` | Full page sections | Assembling composites into a page-level section | New primitive-level styling — must reuse tokens |
| Seed files (`database/seeds/`) | Known-good starting data (Courses, Branches) | Idempotent, re-runnable inserts | Fake/placeholder resource content passed off as real |
| `docs/adr/*.md` | Records any approved deviation from Parts 1–4 | One decision, one file, dated | Silent architecture changes made only in code |

---

## 3. Backend Architecture (NestJS)

**Layering is one-directional, per Part 4 §3 — never revisit or relax this:**

```
Request
  → Guard/Middleware   (auth, rate limiting, role check)
  → Pipe                (DTO validation)
  → Controller          (parse, delegate to exactly one service method)
  → Service             (business logic, orchestration)
  → Repository          (database access)
  → Database
  ← Repository returns data
  ← Service applies any remaining business shaping
  ← Controller formats the HTTP response
  ← Interceptor          (final response shaping, e.g. envelope/pagination wrapper)
Response
```

**Module boundary rule**: a module may only call another module through its exported **service interface** — never reach into another module's repository or entity directly. This is what keeps `resources`, `orders`, and `payments` independently testable and independently deployable if ever split into services later (Part 4 §1's stated upgrade path).

**Where cross-module orchestration lives**: when an action spans modules (e.g., completing an order must update `orders`, trigger `payments` verification, and fire a `notifications` email), the orchestration lives in the *initiating* module's service (here, `orders.service.ts`), which calls the other modules' public service methods. No shared "god service" is ever created.

**Jobs vs. Services**: a Service method must return within a normal HTTP request/response window. Anything that can't (watermarking a 40-page PDF, rebuilding a search index) is dispatched as a Job (`src/jobs/`) and the Service only enqueues it — this boundary is permanent and does not get blurred as pipelines grow more complex.

---

## 4. Frontend Architecture (Next.js)

**Hierarchy (strict, per Part 2 §23 — enforced by folder structure, not convention):**

```
Design Tokens (styles/)
  │
  ├── Primitives   → Button, Input, Badge, Icon, Chip
  │
  ├── Base         → Card (shell), Modal, Drawer, Skeleton
  │
  ├── Composite    → CourseCard, BranchCard, SemesterCard, SubjectCard,
  │                  ResourceCard, TranscriptTrail, SearchPanel, ReviewCard
  │
  └── Patterns     → ResourceGrid, CheckoutSummary, DashboardShell,
                     EmptyState, LoadingState
```

**Rule**: a Composite may only import from Primitives and Base. A Pattern may only import from Composite and Base. A `page.tsx` may only import from Patterns and Composite. No layer imports "sideways" or "up" — a lint rule enforces folder-based import boundaries so this cannot silently drift.

**Reusable component categories required from Phase 1 onward** (structure only, no styling/markup yet):
- **Layouts**: root layout (nav+footer shell), dashboard layout, admin layout, checkout layout (minimal chrome, per Part 3's "payment should feel anticlimactic" principle)
- **Cards**: one base Card shell, contextualized per screen — never a new card component per entity
- **Forms**: one base Form primitive set (input, select, validation message) reused across auth, checkout, and admin
- **Search**: one SearchPanel composite reused for both scoped (Course-page) and Global Search
- **Filters**: exist only where Part 3 specifies them (none at Course/Branch/Semester layers — those are pure tile grids, not filterable lists, per Part 3 §3–5)
- **Navbar/Footer**: one instance each, injected via the root layout, never redefined per route
- **Modals**: one Modal primitive, used for PDF Preview, confirmation dialogs, and auth
- **Loading components**: one Skeleton system with per-card-type variants — never a generic spinner (Part 2 principle: shape is known immediately)

---

## 5. Template Architecture (Next.js Layout/Page Equivalent)

*Next.js has no `base.html`/Jinja-style template inheritance — the equivalent concept is nested `layout.tsx` files under the App Router, which compose the same way template inheritance does.*

```
app/layout.tsx                     ← root shell: <html>, global providers, Navbar, Footer
 │
 ├── app/(marketing)/layout.tsx    ← landing-specific chrome (if any)
 │     └── page.tsx                 (Landing)
 │
 ├── app/[course]/layout.tsx       ← injects Transcript Trail once course context exists
 │     └── [branch]/[semester]/[subject]/[resource]/page.tsx
 │
 ├── app/dashboard/layout.tsx      ← dashboard sidebar shell
 │     ├── purchases/page.tsx
 │     ├── wishlist/page.tsx
 │     ├── invoices/page.tsx
 │     ├── account/page.tsx
 │     └── support/page.tsx
 │
 ├── app/admin/layout.tsx          ← role-gated admin shell (distinct nav, no Transcript Trail)
 │     └── .../page.tsx
 │
 ├── app/checkout/layout.tsx       ← minimal chrome layout (no nav distractions, per Part 3 §11)
 │     └── page.tsx
 │
 └── app/(error)/layout.tsx        ← shared shell for 404/500/maintenance/offline
       └── page.tsx (per error type)
```

**Inheritance rule**: each nested `layout.tsx` only adds what's genuinely different at that level (e.g., the Transcript Trail appears only once course context exists; the admin shell never shows the Trail at all). A page never redefines chrome its parent layout already provides.

**Shared component slots** (rendered inside layouts, not inside pages): Navbar, Footer, Transcript Trail, Dashboard Sidebar, Admin Sidebar — each is a Pattern-layer component, injected once, never duplicated per page.

---

## 6. Static Asset Structure

```
frontend/public/assets/
  ├── logo/              # Wordmark, icon, monogram — light + dark variants (Part 2 §3)
  ├── icons/              # Single outlined icon set, 1.5px stroke (Part 2 §22)
  ├── fonts/              # Fraunces, Inter, JetBrains Mono — self-hosted, not CDN-linked
  └── images/             # Marketing/landing imagery only — never user content

frontend/styles/
  ├── tokens/             # Global tokens — the only place raw hex/px/ms values exist (Part 2 §24)
  ├── themes/             # Light/dark semantic mappings
  └── components/         # Component-level token mappings (button.primary.bg, card.padding, etc.)
```

**User-generated assets never live in `public/`.** Uploaded PDFs, generated thumbnails, watermarked previews, and rasterized preview pages live exclusively in Cloudflare R2 (per Part 4 §1), referenced by URL/key from the database — never checked into the repo, never served from the Next.js static folder. This boundary is absolute: mixing user content into `public/` breaks the CDN/cache strategy and creates a data-loss risk on redeploys.

---

## 7. Configuration Strategy

**Environments**: `development`, `test`, `staging`, `production` — four distinct environment files/targets, not three, so CI can run against `test` without ever touching real payment or storage credentials.

**Philosophy**:
- Every environment-dependent value is read in exactly one place per concern (`config/*.config.ts` on the backend; a single typed `env.ts` on the frontend) — never `process.env` scattered through business logic.
- Config files expose **typed, validated** objects at boot time — the application should fail fast on startup if a required variable is missing, never fail deep inside a request at 2am.
- **Secrets vs. config are different files.** Config templates (`infra/*.env.example`) are committed; actual secrets are never committed, ever — they live in the hosting platform's secret manager (Vercel/Railway/Render env dashboards).
- **API keys are scoped to the narrowest environment they need.** Razorpay test keys in `development`/`test`/`staging`, live keys only in `production`, injected only at deploy time.
- **One secret, one owner module.** Payment secrets are only ever read inside `payments/`'s config file, never re-exported for convenience elsewhere.

---

## 8. Naming Conventions

| Category | Convention | Example |
|---|---|---|
| Backend files | `kebab-case.type.ts` | `resource-pipeline.service.ts` |
| Backend classes | `PascalCase` + role suffix | `ResourcesService`, `OrdersController` |
| Backend folders (modules) | `kebab-case`, plural | `resources/`, `orders/` |
| Frontend component files | `PascalCase.tsx` | `ResourceCard.tsx` |
| Frontend component folders | `kebab-case` | `components/composite/` |
| Frontend hooks | `useCamelCase.ts` | `useResourceQuery.ts` |
| Functions/variables | `camelCase`, verb-first for functions | `getResourceById`, `isUnlocked` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PREVIEW_PAGES` |
| Database tables | `snake_case`, plural | `resources`, `order_items` |
| Database columns | `snake_case` | `subject_id`, `created_at` |
| Design tokens | `dot.case`, role-first | `color.ink`, `space.4`, `radius.lg` |
| CSS/token-consuming classNames | derived from tokens, never ad-hoc | no bespoke `.card-blue-big` classes |
| Routes/URLs | mirror IA exactly, kebab-case slugs | `/btech/ai-ds/sem-4/dsa-301` |
| Git branches | `type/short-description` | `feature/resource-preview`, `fix/checkout-race` |

**Consistency rule**: a naming convention, once set for a category, applies retroactively — a new file in an existing category is never allowed to invent its own pattern "just this once."

---

## 9. Development Rules (50)

**Architecture & layering**
1. Controllers never contain business logic.
2. Services never touch the database directly — always through a repository.
3. Repositories never contain business rules or authorization checks.
4. No module reaches into another module's repository or entity directly.
5. Cross-module orchestration lives in the initiating module's service only.
6. Jobs handle anything that can't complete within a normal request window.
7. Guards check identity/role only — never entity-specific ownership.
8. DTOs enforce shape/type only — never business validity.
9. Config files are the only place environment variables are read.
10. No "god service" or "god utils" file is ever created.

**Frontend structure**
11. Primitives never know about domain entities.
12. Composite components are built only from Primitives and Base components.
13. Patterns are built only from Composite and Base components — never raw primitives directly.
14. Pages compose Patterns/Composites — they never define new one-off markup.
15. No component hardcodes a raw color, font size, or spacing value — tokens only.
16. Layouts hold shared chrome only; pages never redefine nav/footer.
17. One Card shell exists — no per-entity card component is ever created.
18. One Modal primitive exists — no route builds its own modal implementation.
19. Skeleton loading states are shape-matched per component, never a generic spinner.
20. Global Search and scoped Course-page search share the same SearchPanel composite.

**Data & content**
21. Subjects are platform-level entities, never duplicated per branch (Part 1 §3.1).
22. The Resource object schema is never forked per resource type — new types extend the `type` enum only.
23. No database query is ever written inside a template/page component.
24. No fabricated metric (student count, rating, download count) is ever displayed without real backing data.
25. Seed data is idempotent and re-runnable — never a one-time manual script.
26. Every migration is reversible or explicitly documented as irreversible with a reason.

**Security & payments**
27. Live payment credentials never exist outside the `production` environment.
28. PDF full assets are never directly URL-accessible — always served through an authorization check.
29. Preview assets are never downloadable, only viewable in a preview surface.
30. Authentication is required only at Checkout, never earlier in the browsing journey.
31. All user input is validated at the DTO/pipe boundary before it reaches a service.
32. Secrets are never committed to the repository, in any branch, at any point in history.

**Code hygiene**
33. Never duplicate logic — extract to a shared service/util once used twice.
34. Never duplicate CSS/token values — extend the token set instead.
35. Never hardcode an ID (course ID, branch ID) anywhere in application code.
36. Everything reusable is built once, contextualized by props/data, not copy-pasted.
37. No dead code or commented-out blocks are merged to main.
38. No TODO is merged without a linked tracking issue.
39. Every new resource type is added as an enum value, never a new component tree.
40. Every new Course/Branch is a data change, never a code change.

**Testing & quality**
41. Every service method has a corresponding unit test before merge.
42. Every module's test folder mirrors its source folder exactly.
43. No PR merges with failing CI, regardless of urgency.
44. Critical paths (checkout, payment webhook, resource unlock) require integration tests, not just unit tests.

**Process**
45. No architecture decision documented in Parts 1–4 is changed without an ADR in `/docs/adr`.
46. Every environment-breaking change requires a config template update in the same PR.
47. Every new module is registered in this document's folder tree before its first PR.
48. No feature ships that requires a new UI pattern when an existing Pattern/Composite could hold it (Part 3 §25 Rule 4).
49. Every empty/disabled/error state follows the copy-led pattern (Part 2 §18) before any illustration is considered.
50. Any deviation from these 50 rules requires explicit sign-off recorded in an ADR, not a silent exception.

---

## 10. Coding Standards

- **Documentation**: every module has a short `README.md` stating its single responsibility and its public service methods — not implementation detail, which changes too often to document reliably.
- **Comments**: explain *why*, never *what* — the code already says what; a comment restating it is noise.
- **Error handling**: services throw typed, domain-specific exceptions; a global exception filter (backend) and error boundary (frontend) translate these into user-facing messages — no raw stack traces ever reach a response.
- **Logging**: structured (JSON) only, one log line per meaningful event, never `console.log` left in committed code.
- **Validation**: enforced at the boundary (DTO/pipe on the backend, form-level validation on the frontend) — never re-validated ad-hoc deeper in the call stack.
- **Reusable components**: a second occurrence of near-identical UI is the trigger to extract a shared component — not the third.
- **Performance**: pagination is mandatory on every list endpoint from Phase 1 onward — infinite unbounded queries are never written "temporarily."
- **Accessibility**: every interactive primitive supports keyboard focus and an accessible name from the moment it's built — this is not a later pass.

---

## 11. Git Strategy

- **Branch naming**: `type/short-description` — types: `feature/`, `fix/`, `chore/`, `refactor/`, `docs/`, `hotfix/`.
- **Commit format**: Conventional Commits — `type(scope): description` (e.g. `feat(resources): add preview watermark job`).
- **Pull requests**: one logical change per PR; PR description states which module(s) it touches and links the tracking issue; no PR merges without passing CI and one review.
- **Release tags**: semantic versioning (`vMAJOR.MINOR.PATCH`) tagged on `main` at each production deploy.
- **Versioning philosophy**: MAJOR only for breaking data-shape/API contract changes, MINOR for new features, PATCH for fixes — the shared-types package version is bumped in lockstep with any breaking contract change.

---

## 12. Future Compatibility

This skeleton already accommodates every item below as a **data or module addition**, never a folder-structure or architecture change:

| Future feature | How it's absorbed |
|---|---|
| **AI Search** | Extends `modules/search/` — same public service interface, semantic matching swapped in behind it |
| **Bundles** | New `modules/bundles/` module referencing existing `resources/` — no change to Resource schema |
| **Subscriptions** | New `modules/subscriptions/` + `payments/` extension — Order/Resource models untouched |
| **Creator Marketplace** | New `role` on `users/` (creator) + a `modules/creator-uploads/` module reusing the existing Resource Pipeline |
| **Faculty Accounts** | New `role` value + role-gated routes under existing `admin/` layout pattern |
| **Native Mobile App** | Consumes the same NestJS API — no backend change; a new `apps/mobile` client added to the monorepo |
| **Public API** | A new `modules/public-api/` (versioned, rate-limited) exposing existing services — no duplication of business logic |

**The enforced guarantee**: because every layer (backend modules, frontend component hierarchy, database schema) was built module-first and enum-extensible, every future feature above is addable by *adding*, never by *restructuring* — which is the direct engineering consequence of Part 1's "10 to 50,000 without redesign" thesis, carried all the way down to the file system.

---

**End of Phase 1.** No HTML, CSS, JavaScript, TypeScript, Python, SQL, or API endpoints were generated — only the permanent skeleton and rules that all future code (Phase 2 onward) must conform to.
