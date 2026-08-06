# PLAN B — Phase 3: Technical Specification & Implementation Contract
### The Engineering Playbook (Final Planning Document — No Code)

*This document is the permanent implementation contract for the Plan B codebase. It assumes Parts 1–5, Phase 1 (Project Foundation), and Phase 2 (Database Bible) as locked, approved, and unchanged. Nothing below contradicts them — this document only specifies *how* implementation proceeds against what they already established. No code, API implementations, database schema, or UI code appear anywhere in this document.*

---

## Section 1 — System Overview

The complete request lifecycle, stage by stage:

```
User
  │  (interacts with a screen — Part 3's UX Blueprint)
  ▼
Frontend (Next.js)
  │  composes Patterns/Composites (Phase 1 §4), calls the API client (lib/)
  │  attaches an Authorization header if a session exists (Section 4 below)
  ▼
API (NestJS, versioned /v1 — Part 4 §17)
  │  request hits a Guard/Middleware first (Section 5) — rate limiting, then auth check
  ▼
Authentication
  │  token verified (or request passes through unauthenticated for guest-eligible routes,
  │  Part 3 §10) — the authenticated User (or null) is attached to the request context
  ▼
Validation (DTO/Pipe — Phase 1 §2)
  │  request shape and types checked before any business logic runs
  ▼
Business Logic (Service layer — Phase 1 §3)
  │  orchestration, ownership checks, pricing/coupon rules, calls to other modules'
  │  service interfaces, enqueues any Job that can't finish inline (Section 12)
  ▼
Database (via Repository layer only — Phase 1 §3)
  │  reads/writes scoped to one entity, per Phase 2's Database Bible
  ▼
Response
  │  Service returns a plain result → Controller shapes it into the standard envelope
  │  (Section 3) → Interceptor applies any final formatting (pagination wrapper, etc.)
  ▼
UI Update
     Frontend receives the response, updates local/server state (React Query-style
     cache or equivalent), re-renders only the affected Composite/Pattern — never a
     full-page reload for an in-journey action (Part 2 §6's motion-communicates-state
     principle extends to data updates: the UI shows *what changed*, not a hard refresh)
```

**Governing rule for every stage**: each stage only does the one job listed above. A stage that starts doing another stage's job (e.g., a Controller applying a business rule, or a Frontend component computing a price) is a contract violation, not a style choice — Section 19's checklist enforces this at merge time.

---

## Section 2 — Implementation Order

```
1. Repository setup
2. Project initialization
3. Shared packages
4. Database
5. Authentication
6. Academic hierarchy
7. Resource management
8. Search
9. Payments
10. Downloads
11. Dashboard
12. Admin Panel
13. Notifications
14. Testing (continuous, but hardened as a phase before launch)
15. Deployment
```

**Why this order is optimal, stage by stage:**

1. **Repository setup** — branch strategy, CI skeleton, and lint/type-check gates exist before a single feature file does, so every subsequent commit is already held to Phase 1's rules (§9, §11) rather than retrofitted later.
2. **Project initialization** — the folder skeleton from Phase 1 is scaffolded exactly once, empty but correctly shaped, so no developer ever has to guess where a new module belongs.
3. **Shared packages** — the cross-boundary type contracts (`packages/shared-types`, Phase 1 §1) must exist before backend and frontend development proceed in parallel, or the two sides will drift and require reconciliation later.
4. **Database** — Phase 2's entity model is instantiated before any feature code, because every subsequent module (Auth, Resources, Payments) depends on tables existing, not the reverse.
5. **Authentication** — built before any feature that needs to know "who is making this request," including guest-eligible browsing (which still needs the *concept* of an optional authenticated user wired through the request pipeline from day one, per Section 1).
6. **Academic hierarchy** — University→Course→Branch→Semester→Subject (Phase 2) is built next because every subsequent domain (Resource, Search, Payments) references it; building Resources before this exists would mean stubbing out foreign keys that get real later, which risks exactly the kind of half-finished dependency Phase 1 §9 Rule 1 (never duplicate logic) and Rule 45 (no undocumented deviation) are designed to prevent.
7. **Resource management** — the universal Resource entity and its pipeline (upload → publish, Part 4 §7) come next, since Search, Payments, and Downloads all operate *on* a Resource — none of them can be meaningfully built or tested against empty/fake data.
8. **Search** — built once real Resources exist to index; building it earlier would mean testing against fixtures that don't reflect the real shape of production data.
9. **Payments** — deliberately after Search, not before, because Payments' complexity (webhook verification, retries, refunds — Section 7) is the highest-risk surface in the system, and the team should have full command of the domain model and a working catalog before touching money.
10. **Downloads** — depends entirely on Payments/ownership (Phase 2 §5.2) existing first; building it earlier would mean simulating ownership state that isn't real yet.
11. **Dashboard** — a read-heavy composition of everything built so far (Orders, Wishlist, Downloads) — naturally sequenced after all of its dependencies are real, not before.
12. **Admin Panel** — deliberately built *after* the student-facing flows it manages, not before, so admin screens are built against real entity behavior (a Resource that's actually gone through the real pipeline) rather than assumptions about what the pipeline would produce.
13. **Notifications** — layered on top of Orders/Resources/Announcements once those domains are stable, since most notification triggers (Phase 2 §2) are events *emitted by* those already-built domains.
14. **Testing** — unit and integration tests are written continuously alongside every step above (Section 16), but a dedicated hardening pass (E2E, security, performance — Sections 16, 15, 14) happens once the full flow exists end-to-end, since some test classes (a full checkout E2E test) are meaningless until every upstream stage is real.
15. **Deployment** — last, deliberately — a production deploy is a promotion of already-tested, already-hardened code (Phase 1 §11, Part 4 §19), never the mechanism by which a feature first becomes "real."

**The single rule that explains the whole ordering**: nothing is built against a stub or an assumption about a downstream/upstream dependency when the real thing could instead be built first — this minimizes the amount of code written twice (once against a guess, once against reality), which is the single largest source of wasted engineering effort in a project this size.

---

## Section 3 — API Contract Philosophy

*Extending Part 4 §17 into full contract detail, without endpoints.*

- **Request structure**: every mutating request carries a validated body matching exactly one DTO shape (Phase 1 §2); every list request accepts a consistent set of query parameters (pagination cursor, filters, sort) applied identically across every listable resource — a frontend developer learns this shape once, globally.
- **Response structure — success**: a single envelope shape for single-item responses (`data`, `meta`) and a distinct but related envelope for list responses (`data`, `pagination`, `meta`) — the two are never conflated, so a caller can always tell which shape to expect from the HTTP verb and route alone.
- **Response structure — error**: one consistent error envelope (`code`, `message`, `details?`) across every endpoint, every error type (Section 10) — this is what lets frontend error handling be written once, generically, rather than per-endpoint.
- **Validation responses**: a distinct `details` structure on validation failures, listing the specific field(s) and reason(s) — never a single opaque message string when multiple fields fail at once, since the frontend needs to highlight each field individually.
- **Pagination**: cursor-based on every endpoint expected to reach a large result set (Resources, Orders — Part 4 §17) — the response always includes a `next_cursor` (nullable when exhausted), never a total-count-driven offset scheme that degrades at scale.
- **Filtering**: a small, explicit, per-endpoint allow-list of filterable fields — never arbitrary field filtering, both for security (no query-injection surface) and for UX consistency (Part 3 §7's deliberately minimal filter set).
- **Sorting**: same allow-list philosophy — a small named set of sort options (`recent`, `price_asc`, `popular`), never arbitrary column sorting.
- **Metadata**: every response's `meta` block carries only what's genuinely useful to the caller (e.g., `request_id` for support/debugging correlation, Section 11) — never speculative fields added "in case they're useful later."
- **Consistency rules**: (1) the same field name means the same thing in every response it appears in — no endpoint reusing `status` to mean something different from another endpoint's `status`; (2) every timestamp is UTC ISO-8601, no exceptions (Phase 2 §13); (3) every ID is the opaque UUID form (Phase 2 §13), never a sequential number, anywhere a client can see it.

---

## Section 4 — Authentication Flow

```
Guest
  → browses Course → Branch → Semester → Subject → Resource → Preview freely,
    no token required, no forced signup wall (Part 3 §10)

Registration (triggered only at Checkout, or optionally earlier if the student chooses)
  → email + password, OR
  → Google OAuth (creates/matches a User by verified email, Phase 1 §11)
  → on email+password path: an account is created immediately; email verification
    (see below) is a soft gate, not a hard blocker to first purchase, since forcing
    verification before checkout would reintroduce exactly the friction Part 3 §10
    was written to eliminate

Email verification (soft, not blocking)
  → a verification email is sent on registration
  → an unverified account can still complete a purchase (payment identity is
    Razorpay's concern, not email-verification's) but sees a persistent, low-friction
    "verify your email" prompt in Dashboard until resolved — never a modal that blocks
    navigation, consistent with Part 2's "never punish exploration" principle

Google Login
  → OAuth2 redirect/popup flow → verified email returned by Google → matched against
    an existing User or a new one created → session established identically to the
    email/password path from this point forward (no second-class "OAuth-only" account type)

Login (returning user)
  → credentials verified → access token (short-lived, ~15 min) + refresh token
    (long-lived, httpOnly/Secure/SameSite=Strict cookie, Phase 1 reference to Part 4 §11)
    issued → a Session row created (Phase 2 §2), scoped to this device

Refresh Tokens
  → when an access token expires, the frontend silently exchanges the refresh token
    for a new access token — invisible to the student, no re-login prompt, unless the
    refresh token itself has expired or been revoked

Logout
  → refresh token revoked server-side (Session row invalidated) → both tokens cleared
    client-side — a logout on one device never affects other active Sessions (Phase 2 §2)

Forgot Password
  → single-use, short-lived reset token emailed → password updated → all existing
    Sessions for that User are revoked as a security measure (a password reset is
    a strong signal the account may have been compromised, so every other device
    is force-logged-out, requiring re-authentication everywhere)

Session Validation
  → every request to a protected route re-validates the access token's signature
    and expiry — never trusts a previously-validated state from earlier in the
    same session without re-checking, consistent with Phase 2 §5.2's "ownership is
    re-derived, never cached" principle applied here to identity itself

Protected Routes
  → any route requiring "a logged-in student" (Checkout submission, Dashboard,
    Wishlist mutation) — gated by an auth Guard (Section 5) that runs before the
    Controller is ever reached

Admin Authentication
  → identical token mechanism to Student auth (no separate admin-only auth system,
    Phase 1 §11) — the *only* difference is the `role` field checked by a second,
    additional Guard layered on top of the base auth Guard

Role Validation
  → checked at the module boundary (every route under `admin/`) via a RolesGuard,
    never re-implemented per-controller — a single source of truth for "is this
    role allowed here"
```

---

## Section 5 — Authorization Model

| Route category | Who can access | Enforcement point |
|---|---|---|
| **Public routes** | Anyone, no token (Course/Branch/Semester/Subject/Resource reads, Preview) | No Guard at all — deliberately open, per Part 3 §10 |
| **Protected routes** | Any authenticated User (Checkout, Dashboard, Wishlist, Reviews) | AuthGuard only — checks "is there a valid token," not role |
| **Admin routes** | Users with `role: admin` | AuthGuard + RolesGuard, layered — auth is checked first, role second, never combined into one check |
| **Future Faculty routes** | Users with `role: faculty`, scoped to their own Subject/Resource set | Same two-Guard pattern, plus a service-layer ownership check (this Faculty member owns *this* Subject) — mirroring the Resource-ownership pattern already used for student downloads (Phase 2 §5.2) |

**Permission hierarchy**: role-based, not fully granular permission-based, for v1 (Part 4 §11) — `student < faculty < admin` in terms of route access breadth, but explicitly *not* a strict linear hierarchy where Admin "contains" every Faculty permission automatically; Admin has its own broader route set, Faculty has a narrower, differently-scoped one. This distinction matters because Faculty's future scope (their own content only) is not a subset of "everything Admin can see" — it's a different, ownership-filtered view over the same Resource module.

**Access control philosophy**: authorization is checked in exactly two possible places, never a third — (1) a Guard, for "does this identity have the right role/authentication," and (2) a Service method, for "does this specific identity own/have rights to this specific record" (Phase 1 §2's rule that Guards never do entity-specific ownership checks). A route is never protected by a check embedded in a Controller or a Repository.

---

## Section 6 — File Upload Flow

*Fully specified conceptually in Part 4 §7 — restated here as the implementation contract, sequenced with explicit failure handling at each stage.*

```
1. Upload           Admin submits a PDF via the Admin Panel's Resource module.
                     File lands in a quarantine storage prefix — never the public
                     structure — and the HTTP request returns immediately with a
                     "processing" acknowledgment (never a hung request, Part 4 §7).

2. Validation        MIME + extension + magic-byte check, size limit, page-count
                     sanity check.
                     ON FAILURE: upload marked `failed: invalid_file`, Admin notified
                     synchronously (this check alone is fast enough to run inline
                     before acknowledging the upload).

3. Virus Scan         Scanned in quarantine before any further processing.
                     ON FAILURE: file permanently discarded, Admin notified,
                     incident logged (Section 11) — this failure path never
                     silently retries.

4. Compression        Original PDF compressed (lossless on text).
                     ON FAILURE: retried once automatically (transient tool failure
                     is the expected cause); a second failure surfaces to Admin as
                     a manual-review item, upload does not silently disappear.

5. Thumbnail Gen.     Sharp renders page 1 to a thumbnail.
                     ON FAILURE: retried with backoff; if still failing, the
                     Resource can still move to `draft` without a thumbnail, and
                     the Admin Panel visibly flags the missing asset rather than
                     blocking the entire pipeline on one non-critical step.

6. Preview Gen.       Unlocked pages rasterized full-quality + watermarked;
                     remaining pages rasterized lower-quality for blur treatment
                     (Part 4 §7).
                     ON FAILURE: this step IS critical (Preview is the trust
                     mechanism, Part 1 §5) — failure here blocks the Resource from
                     ever reaching `draft`, and retries with backoff before
                     escalating to a hard failure requiring manual Admin
                     re-trigger.

7. Metadata Extract.  Page count, file size auto-extracted.
                     ON FAILURE: non-blocking — Admin can supply these manually if
                     extraction fails, since these are display conveniences, not
                     trust-critical.

8. Storage            Final assets (original, preview, pages, thumbnail) moved
                     from quarantine to their permanent, ID-based paths
                     (Part 4 §6).
                     ON FAILURE: the move is treated as a single atomic step —
                     partial moves are not left in place; a failure here retries
                     the whole move, never leaves assets split between quarantine
                     and permanent storage.

9. Database Update    A Resource row is created/updated with `status: draft`
                     (Phase 2 §7.1) — visible to Admin, not to students.

10. Publishing        A separate, explicit Admin action moves `draft → live`
                     (never automatic) — this is the human review gate that
                     catches any pipeline artifact (bad watermark placement,
                     wrong preview page count) before a student ever sees it.
```

**Failure handling philosophy across all stages**: every failure is recorded (not silently swallowed), retried automatically only where the failure class is plausibly transient (compression, thumbnailing), and escalated to a visible Admin-facing state everywhere else — the pipeline never leaves a Resource in an ambiguous, undiscoverable state.

---

## Section 7 — Purchase Flow

*Extending Phase 2 §5 into the implementation-level sequence, tying each stage to its enforcement point.*

```
Browse        No auth required. Public routes only (Section 5).

Preview       No auth required (Part 3 §10). Preview asset served, never the
              original file — this is a hard architectural boundary, not a
              convention (Section 8 covers this fully).

Checkout      Auth required at this exact point, not before (Section 4). If not
              logged in, registration/Google-login is presented inline, then
              checkout continues in the same flow (no redirect-and-lose-context).
              An Order is created, `status: pending`, with its Order Item(s)
              (Phase 2 §5). Coupon, if entered, is validated server-side here —
              never trusted from any client-side "applied" state.

Payment       Payment initiated against the gateway (Razorpay). A Payment row
              is created referencing the Order, `status: initiated`.

Verification  Server-side only. The gateway's webhook is received, its signature
              independently verified against the gateway's servers — the
              frontend's own "payment succeeded" report is never sufficient on
              its own (Phase 2 §5, Part 4 §9's single most important rule,
              restated here as non-negotiable at the implementation level too).
              On verified success: Payment → `verified`, Order → `paid`.
              On failure: Payment → `failed`, Order stays `pending` (Section 10
              covers the resulting error UX).

Invoice       Generated automatically, as an async Job (Section 12), the moment
              Order reaches `paid` — never generated inline within the webhook
              handler itself, since invoice generation (PDF rendering) shouldn't
              risk delaying or failing the payment-confirmation response.

Ownership     Becomes real the instant Order is `paid` — defined precisely as in
              Phase 2 §5.2, re-derived fresh on every subsequent check, never
              cached as a standalone flag anywhere.

Download      Gated by the ownership check (Section 8) — this is the first point
              in the entire journey where the *original* file becomes reachable
              at all, and only via a short-lived signed URL.

Future        A version update (Phase 2 §6) triggers a Notification to every
Updates       owner; the owner's next download automatically resolves to the new
              version — no separate re-purchase or re-claim step.

Refund        Admin-initiated only (Section 5's Admin route). Triggers the
              gateway's refund API, then Order → `refunded`. The ownership check
              (Section 8) fails immediately afterward, since it explicitly
              requires `Order.status != refunded` — access revocation is not a
              separate step, it's a direct consequence of the status change.
```

---

## Section 8 — Download Flow

*Implementing Phase 2 §5.2 and Part 4 §10 as an explicit operational sequence.*

```
1. Ownership verification   On every download request (first time or the
                             hundredth re-download), the backend independently
                             re-checks: does a paid, non-refunded Order Item
                             exist linking this User to this Resource? This
                             check runs fresh every single time — never cached,
                             never inferred from a prior successful download.

2. Temporary access          Only after ownership is confirmed does the backend
                             issue a signed URL — short-lived (minutes), scoped
                             to exactly one file, pointing directly at the
                             object storage bucket. The original file's storage
                             path itself is never disclosed or guessable
                             (Phase 2 §13's opaque-ID principle).

3. Version updates           The signed URL always resolves against the
                             Resource's *current* `current_version_id` at the
                             moment of request — an owner who bought version 1
                             transparently receives version 2's file on their
                             next download once an update has been published,
                             with zero extra action required from them.

4. Future re-downloads       Unlimited and indefinite for as long as ownership
                             holds (Order remains `paid`, never `refunded`) —
                             enforced by simply never expiring the ownership
                             *record*, only the individual signed URLs
                             themselves, each of which is single-use-window,
                             not single-use-count (a legitimate slow connection
                             retry within the window still works).

5. Abuse prevention           Rate limiting on download-URL issuance specifically
                             (Section 15) — a burst of rapid requests for the
                             same resource from the same account is throttled,
                             since legitimate re-download behavior is
                             infrequent and low-volume by nature; every issuance
                             is also recorded in the Download Log (Phase 2 §2)
                             for audit/investigation if abuse is suspected later.
```

**The one rule underlying this entire section**: a signed URL is a *capability*, issued fresh each time and expiring quickly — it is never treated as a durable credential a student is expected to save or reuse.

---

## Section 9 — Search Flow

```
Search request     A keyword query hits the search endpoint, scoped optionally
                    by context (Global Search vs. the Course-page's scoped
                    search, Part 3 §3/§15 — two distinct entry points, never
                    merged into one overloaded endpoint, Phase 2 §11).

Search ranking      Full-text match against Subject name/code/aliases and
                    Resource title (Phase 2 §11), with subject-code exact
                    matches boosted above title matches, and
                    `search_rank_boost` used only to break ties among otherwise-
                    equal matches — never to override a stronger textual match.

Autocomplete        Served from the same indexed fields, debounced client-side,
                    limited to a small top-N result set — this is a UX
                    convenience over the same search index, not a separate
                    system.

Suggestions         "Popular Searches" for the empty-query state (Part 3 §15) —
                    computed periodically from real query logs, never
                    hand-curated or fabricated (Part 3 §21's "every number shown
                    must be real" principle applied to search UX specifically).

Caching             Popular/empty-query results cached with a short TTL
                    (minutes) since they're read far more often than the
                    underlying data changes (Part 4 §8) — a live query result
                    for a specific, less-common search term is not cached at
                    the same aggressiveness, since staleness there is more
                    noticeable and less valuable to absorb.

Empty state         "No results for '[query]'" is copy-led (Part 2 §18), never
                    a bare blank screen — and logs the zero-result query
                    itself, since these are direct input into the content
                    roadmap (Part 4 §13).

Future AI Search     The ranking function is the only thing that changes —
                    request shape, response shape, and every caller (frontend,
                    autocomplete, empty-state logging) stay identical, per
                    Phase 2 §11's isolated-service-boundary design.
```

---

## Section 10 — Error Handling

| Error class | Handling strategy |
|---|---|
| **Validation errors** | Returned with the field-level `details` structure (Section 3) — the frontend highlights the specific field(s), never a generic "something went wrong" for a fixable input problem |
| **Authentication errors** | A distinct, consistent error code (e.g., `unauthenticated`) — frontend response is to prompt re-login inline, never a silent redirect that loses the student's place in the journey (Part 2 §9's "never punish exploration") |
| **Authorization errors** | A distinct code (`forbidden`) — deliberately different from authentication errors, since "you're not logged in" and "you're logged in but not allowed" require different user messaging and different frontend handling |
| **Payment errors** | Over-explained, per Part 3 §25 Rule 5 — the specific, reassuring message that no amount was charged (only truthfully sayable because of Section 7's server-side-only verification rule) is shown, plus a clear retry action |
| **File errors** | User-facing message is generic ("this file couldn't be processed") while the actual failure detail (Section 6) is logged internally (Section 11) — never exposing internal pipeline/storage error detail to the end user |
| **Server errors** | A generic, calm message, a Sentry event captured with full context (Section 14), and — critically — no stack trace or internal detail ever reaches the response body |
| **Maintenance** | A dedicated maintenance state/page (Part 3 §22's Error States), served at the infrastructure/edge layer where possible so it works even if the application itself is fully down |
| **Offline** | Detected client-side (network state), a dedicated offline state distinct from a server error — since the correct recovery action ("check your connection") is different from "try again later" |

**Cross-cutting rule**: every error response uses the single consistent envelope from Section 3 — a frontend developer never needs special-case parsing logic per error class, only different *display* logic keyed off the `code` field.

---

## Section 11 — Logging Strategy

| Log category | What it captures | Retention posture |
|---|---|---|
| **Application logs** | Structured (JSON, Pino — Part 4 §1) request/response summaries, non-sensitive | Standard rolling window |
| **Error logs** | Captured by Sentry (Part 4 §1/§14) with full stack context, correlated by a request ID that flows frontend→backend (Part 4 §19) | Retained per Sentry's standard policy, cross-referenced against Application logs by request ID |
| **Payment logs** | Every gateway interaction (initiation, webhook received, verification result) — deliberately more verbose than average, since payment disputes require a full reconstructable trail | Retained indefinitely, alongside the financial records they document (Phase 2 §13) |
| **Authentication logs** | Login attempts (success/failure), password resets, session creation/revocation — used both for security monitoring and for a student's own "Account → Devices" view (Part 4 §11) | Standard rolling window, except entries tied to a security incident, which are retained with the incident record |
| **Admin logs** | Overlaps with, but is distinct in purpose from, the Audit Log (Phase 2 §2/§8) — Admin logs are operational (what an admin *did in the system*, technically), Audit Log is the permanent business record (what changed, for compliance/dispute purposes) | Admin logs: standard rolling window. Audit Log: indefinite, append-only (Phase 2 §9) |
| **Audit logs** | As fully specified in Phase 2 §8 — never edited, never deleted, the canonical "what happened and when" record | Indefinite |

**The distinction that matters most**: Audit Log is a *business* record (Phase 2's domain model), while Application/Error/Auth/Admin logs are *operational* records (this document's concern) — the two systems serve different consumers (compliance/support vs. engineering) and are never merged into one log stream, even though they often describe the same underlying event from two different angles.

---

## Section 12 — Background Jobs

| Job | Trigger | Why it's async, not inline |
|---|---|---|
| **Email sending** | Any transactional event (receipt, password reset, version-update notice) | SMTP/provider latency should never delay the request that triggered it (e.g., checkout completion shouldn't wait on an email round-trip) |
| **Preview generation** | Resource upload (Section 6, stage 6) | Rasterizing/watermarking a multi-page PDF is CPU/time-intensive — inline processing would hang the upload request |
| **Thumbnail generation** | Resource upload (Section 6, stage 5) | Same reasoning, lighter-weight but still non-trivial at scale |
| **Cleanup** | Scheduled (e.g., nightly) | Purges expired Sessions, old Notifications past retention (Phase 2 §9) — a housekeeping task that has no business running inline with any user-facing request |
| **Scheduled publishing** | A Resource's `visible_from` timestamp passing (Phase 2 §7.1's `scheduled` status) | Needs a time-based trigger, not a request-based one — nothing about a student's or admin's action causes this transition, so it can only live in a scheduled Job |
| **Scheduled archiving** | A Resource's `visible_until` passing, or an Admin-defined retirement schedule | Same reasoning as scheduled publishing, the mirror-image transition |
| **Notifications** | Version updates, Announcement scheduling, Support ticket status changes | Fan-out to potentially many Users (Phase 2 §2's Announcement→Notification pattern) — must never block the triggering Admin action on however many recipients exist |
| **Future analytics** | Periodic aggregation (e.g., recomputing `search_rank_boost`, `review_average` — Phase 2 §14) | Denormalized/cached fields are explicitly refreshed async, never inline with the write that invalidated them (Phase 2 §14's consistency rule) |

**Philosophy**: a Job is used whenever a task's completion time is either unpredictable, non-trivial, or governed by a schedule rather than a request — never as a workaround for a service method that's merely inconvenient to write synchronously.

---

## Section 13 — Caching Strategy

| Layer | What's cached | TTL / invalidation |
|---|---|---|
| **Browser cache** | Static, versioned assets (Phase 1 §6's fingerprinted filenames) | Aggressive, effectively indefinite — cache-busted only by filename change, never by a manual purge |
| **Server cache** | Structural IA data (Courses, Branches, Semesters — Phase 2 §13 confirms these change rarely) | Long TTL, explicitly invalidated the moment an Admin edits the underlying record — never left to expire naturally when a real edit has occurred |
| **Database cache** | Denormalized/cached fields (Subject.resource_count, Resource.review_average — Phase 2 §14) | Refreshed async on the triggering event, not time-based — these aren't "cached" in the TTL sense so much as "computed periodically," a distinct pattern from the others in this table |
| **Search cache** | Popular/empty-query search results (Section 9) | Short TTL (minutes) — read-to-write ratio justifies this without meaningfully risking staleness |
| **CDN** | Public static assets, marketing pages | Edge-cached aggressively; signed download URLs are explicitly *never* CDN-cached publicly (Part 4 §16), since that would defeat the entire ownership-check model (Section 8) |
| **Cache invalidation** | Rule, not a per-cache exception: any cache backing *data an Admin can edit* is invalidated explicitly by that edit action, in the same Service method that performs the edit — never left to a TTL alone when an explicit invalidation signal is available |

---

## Section 14 — Observability

- **Monitoring**: uptime checks against the API and frontend independently (Part 4 §19) — a frontend outage and a backend outage are distinguishable from the very first alert, not discovered as "the site is down" generically.
- **Performance metrics**: response-time percentiles (p50/p95/p99, not just averages — Part 4 §16) tracked per-endpoint, so a slow-but-rare endpoint doesn't hide behind a healthy average.
- **Error tracking**: Sentry, both frontend (React error boundaries per major screen, Part 4 §19) and backend, correlated by request ID (Section 11) so one student-reported bug is traceable end-to-end without guesswork.
- **Health checks**: a dedicated, lightweight endpoint reporting database connectivity, storage reachability, and job-queue health — consumed by the uptime monitor and by the deployment pipeline (a deploy is only considered successful once the new instance's health check passes).
- **Storage monitoring**: bucket availability and, separately, usage/cost trend (Phase 1 §6's zero-egress-fee rationale is only a real advantage if usage is actually tracked against it).
- **Database monitoring**: connection pool saturation, slow-query logging cross-referenced against Phase 2 §10's indexing plan — a slow query on an *indexed* hot path is treated as an incident; a slow query on a genuinely rare, unindexed path is treated as expected.
- **Payment monitoring**: webhook delivery success rate and Payment `initiated`-but-never-resolved counts tracked as their own dashboard — a stuck Payment (neither verified nor failed after a reasonable window) is a distinct, high-priority alert category, since Section 7's entire trust model depends on this state never silently lingering.

---

## Section 15 — Security Implementation

- **Authentication**: JWT access + refresh tokens (Section 4); passwords hashed with bcrypt/argon2, never stored or logged in any reversible form.
- **Authorization**: two-layer model exactly as Section 5 specifies — Guard for role/identity, Service for entity-specific ownership — with zero exceptions carved out for "just this one endpoint."
- **CSRF**: mitigated structurally by the token-based API auth model (not cookie-session auth in the traditional sense) — the one cookie that does exist (the refresh token) is `httpOnly`, `Secure`, `SameSite=Strict` specifically to close this gap (Part 4 §14).
- **XSS**: React's default output escaping plus a strict Content-Security-Policy header; any admin-authored rich text (Announcements, Resource descriptions) is sanitized server-side at write time, never trusted as "safe because it's from an admin."
- **SQL Injection**: structurally impossible by construction — every query goes through the Repository layer using parameterized queries/an ORM, enforced by a lint rule that flags any raw string-concatenated query anywhere in the codebase (Part 4 §14).
- **Rate limiting**: applied per-IP and per-user specifically on auth endpoints, search, and signed-URL issuance (Section 8) — these three surfaces are the ones where automated abuse has the clearest attack shape and the clearest cost to the platform.
- **Input validation**: enforced at the DTO/Pipe boundary (Phase 1 §2) before any service logic runs — never re-validated ad hoc deeper in the call stack, and never silently coerced (Phase 2 §14).
- **Secrets management**: never committed to source control, at any point in history; managed via the hosting platform's secret store, scoped to the narrowest environment that needs them (Phase 1 §7).
- **Environment variables**: one shared schema across environments (keys identical, values differing) — divergence between staging and production schemas is treated as a deployment-blocking issue, not a minor inconsistency (Part 4 §19).
- **Secure headers**: standard hardening set (CSP, `X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`) applied globally at the edge/framework level, not per-route.

---

## Section 16 — Testing Implementation

| Test type | Scope | When it runs |
|---|---|---|
| **Unit tests** | Individual Service methods, pure utility functions (Phase 1 §9 Rule 41) | On every commit, part of CI |
| **Integration tests** | A module's Controller→Service→Repository chain against a real (test) database | On every PR, part of CI |
| **End-to-End tests** | Full user journeys (Browse → Checkout → Payment webhook simulation → Download) across frontend and backend together | Before merge to `main` for any change touching a critical path (Phase 1 §9 Rule 44), and on a scheduled basis against staging |
| **Accessibility tests** | Automated checks (keyboard nav, ARIA, contrast) against every Composite/Pattern component (Part 2's accessibility principles) | Part of the frontend CI pipeline, blocking on any Primitive/Base/Composite regression |
| **Performance tests** | Response-time budgets on hot-path endpoints (Resource listing, Search) under realistic load | Before major releases and after any change to a hot-path query |
| **Security tests** | Automated dependency/vulnerability scanning, plus a manual review pass against the Section 19 checklist for any auth/payment/download-touching change | Continuous (dependency scanning) + gated (manual pass) before any release touching those surfaces |
| **Regression tests** | The full existing test suite, re-run against every PR | Every PR, no exceptions — a passing test suite is a merge requirement (Phase 1 §9 Rule 43), never a "nice to have" |

**Governing principle**: a critical path (checkout, payment webhook, resource ownership/download) is never considered "tested" by unit tests alone — it requires an integration or E2E test that exercises the real chain of dependencies, per Phase 1 §9 Rule 44.

---

## Section 17 — Implementation Phases

For each milestone: Goal, Dependencies, Expected Output, Definition of Done (Section 18 defines the DoD criteria referenced here in full).

| Milestone | Goal | Dependencies | Expected output | DoD |
|---|---|---|---|---|
| **M1 — Foundation** | Repo, CI, project skeleton exist and enforce Phase 1's rules automatically | None | A buildable, empty, correctly-structured monorepo | Lint/type-check/test gates active in CI |
| **M2 — Database** | Every Phase 2 entity exists and is migratable/seedable | M1 | A fully migrated schema, seed data for Courses/Branches/Semesters | Migrations reversible, seed script idempotent (Phase 1 §9 Rule 25) |
| **M3 — Auth** | Full Section 4 flow works end-to-end | M2 | Registration, login, Google OAuth, refresh, logout, password reset all functional | Meets Section 18's full checklist, including security review |
| **M4 — Academic Hierarchy** | Course→Branch→Semester→Subject browsing, fully data-driven | M2, M3 (guest-eligible, so auth is present but not required) | Public routes serving the full IA per Part 1/3 | Zero hardcoded IDs (Phase 1 §9 Rule 35) verified in review |
| **M5 — Resources** | Full pipeline (Section 6) and Resource detail/preview screens | M4 | Admin can upload→publish; students can browse→preview | Preview never exposes the original file (verified by a dedicated security test) |
| **M6 — Search** | Section 9's flow fully functional | M5 | Global + scoped search, autocomplete, empty state | Zero-result queries logged and visible in Admin analytics |
| **M7 — Payments** | Section 7's full purchase flow | M5, M3 | Checkout, Razorpay integration, verified webhook handling, invoices | Server-side-only verification confirmed via a dedicated integration test simulating both success and forged-signature cases |
| **M8 — Downloads** | Section 8's secure download flow | M7 | Signed-URL issuance, ownership re-check, version resolution | Rate limiting confirmed active on the download-URL endpoint |
| **M9 — Dashboard** | Purchases, Wishlist, Invoices, Account, Support screens | M7, M8 | Full student self-service surface | Every listed screen meets Section 18's full checklist |
| **M10 — Admin Panel** | Every module from Phase 1's Admin Panel spec | M5–M9 | Full internal operating surface | Role/permission boundaries verified by a dedicated authorization test suite |
| **M11 — Notifications** | Section 12's Notification/Announcement flows | M10 | Version-update, Announcement, receipt, Support-reply notifications live | Fan-out confirmed non-blocking under load (async job, not inline) |
| **M12 — Hardening & Launch Prep** | Full Section 16 testing pass, Section 19 checklist applied platform-wide | M1–M11 | A release candidate meeting every checklist item | Security, performance, and accessibility sign-off recorded |

---

## Section 18 — Definition of Done

Every feature, regardless of size, must satisfy all of the following before it is considered complete:

1. **Code Complete** — implements the full scope described in the relevant planning document (Parts 1–5, Phase 1, Phase 2, this document), with no partial/stubbed behavior left unflagged.
2. **Reviewed** — at least one peer review approving both correctness and adherence to Phase 1's architectural rules (layering, naming, no duplicated logic).
3. **Tested** — unit tests for new Service logic, integration tests for the full request chain if the feature touches a critical path (Section 16).
4. **Responsive** — verified at the breakpoints Part 2's design system specifies, not just desktop.
5. **Accessible** — passes the automated accessibility check (Section 16) with no new violations introduced.
6. **Secure** — no new endpoint or data path introduced without an explicit authorization decision (Section 5) documented in the PR description.
7. **Documented** — the owning module's `README.md` (Phase 1 §10) updated if the feature changes that module's public service interface.
8. **Production Ready** — works correctly against the staging environment's real configuration (Phase 1 §7), not just against local development defaults.

**No feature merges to `main` missing any item above** — partial completion is tracked as an explicitly open item in the PR, never silently shipped as if complete.

---

## Section 19 — Engineering Checklist

Master checklist every feature must satisfy before merging to production:

- [ ] Follows the Controller→Service→Repository layering with no violations (Phase 1 §3)
- [ ] No business logic in a Controller, Guard, or template/page component (Phase 1 §9 Rules 1–4)
- [ ] No hardcoded IDs, colors, spacing, or business data anywhere in the diff (Phase 1 §9 Rules 15, 35; Part 4 §28 Rule 2)
- [ ] New UI built only from existing Primitives/Base/Composite/Patterns, or a justified new Composite/Pattern added in the correct folder (Phase 1 §4)
- [ ] Every new list endpoint is paginated, cursor-based (Section 3)
- [ ] Every new mutating endpoint has an explicit Guard (auth) and, if entity-specific, a Service-layer ownership check (Section 5)
- [ ] Every new environment-dependent value is read only through `config/` (Phase 1 §7)
- [ ] No secret introduced anywhere in the diff, including test fixtures (Section 15)
- [ ] CI passes: lint, type-check, unit tests, integration tests (Phase 1 §9 Rule 43)
- [ ] Section 18's full Definition of Done satisfied
- [ ] Any deviation from Parts 1–5, Phase 1, or Phase 2 recorded as an ADR before merge, never merged silently (Phase 1 §9 Rule 45)

---

## Section 20 — Implementation Summary

### 20.1 Complete Development Sequence

Repository → Project Init → Shared Packages → Database → Auth → Academic Hierarchy → Resources → Search → Payments → Downloads → Dashboard → Admin Panel → Notifications → Hardening/Testing → Deployment (Section 2, in full).

### 20.2 Module Dependency Map

```
Database
  └── Auth ─────────────────┐
  └── Academic Hierarchy ────┤
        └── Resources ───────┤
              └── Search ────┤
              └── Payments ──┼── Downloads
                              │       └── Dashboard
                              │             └── Admin Panel
                              │                   └── Notifications
                              └───────────────────────┘
```

Every module below the Database is either a direct dependency of, or depended on by, the module immediately above it in the build order — there is no module in this system that can be meaningfully built or tested in isolation from the ones preceding it in Section 2's sequence.

### 20.3 Engineering Rules

The 50 rules from Phase 1 §9 remain fully in force, unchanged. This document adds no new rules that contradict them — Sections 1–19 above are this document's own implementation-level elaboration of those same 50 rules, applied to the request lifecycle, auth, payments, downloads, and observability specifically.

### 20.4 Testing Rules

- No critical path (Section 16) ships with unit-test coverage alone.
- Every PR passes the full regression suite — no exceptions, ever.
- Security and accessibility checks are automated gates, not manual afterthoughts, wherever automation is possible.

### 20.5 Security Rules

- Payment status is never client-authoritative (Section 7, Phase 2 §5.2's ownership derivation, Part 4 §28 Rule 3) — repeated here because it is the single rule in this entire document set with zero tolerance for exception.
- Every download is ownership-checked fresh, every time (Section 8).
- Every secret lives only in the platform's secret store, scoped to its narrowest required environment (Section 15).

### 20.6 Production Readiness Checklist

- [ ] Every milestone in Section 17 has met its stated Definition of Done
- [ ] Section 19's Engineering Checklist has been satisfied for every merged feature, with no outstanding exceptions
- [ ] Monitoring, error tracking, and health checks (Section 14) are confirmed live and alerting correctly
- [ ] Security checklist (Section 15, and Part 4 §25) fully signed off
- [ ] Backup and disaster-recovery procedures (Part 4 §15) tested at least once, not just documented

### 20.7 Launch Readiness Checklist

- [ ] Part 5 §12's business-side Launch Checklist (content, legal, support, warm-cohort) is independently satisfied — engineering readiness and business readiness are deliberately tracked as two separate checklists, since one being complete never implies the other is
- [ ] Staging has been used for a full, real end-to-end rehearsal of Browse → Checkout → Payment → Download with real (test-mode) gateway credentials
- [ ] Rollback procedure (Part 4 §26) has been tested at least once
- [ ] All stakeholders have explicitly signed off — a launch date is never treated as a deadline that overrides an incomplete checklist item

---

**End of Phase 3.** This concludes the entire planning phase for Plan B. No code, API implementations, database schema, or UI code were produced, per instruction — only the permanent engineering contract that all implementation work must follow. Every subsequent conversation about this project should focus on implementation against Parts 1–5, Phase 1, Phase 2, and this document, with any genuine deviation recorded as an ADR rather than made silently.
