# PLAN B — Phase 2: Domain Model & Database Architecture
### The Database Bible (Final Planning Document — No Code, No SQL, No ORM Models)

*This document extends Part 4 §5's entity sketch into the complete, permanent data model. Nothing here contradicts Parts 1–5 or Phase 1 — every entity below already had a place reserved for it in the Engineering Bible; this document is where that reservation becomes a full specification. After this document, implementation begins. Nothing generated during implementation may contradict what follows without a recorded ADR.*

---

## Section 1 — Domain Model

Each domain below exists to answer one question the product cannot function without answering. Domains are grouped by the layer of the business they serve.

### 1.1 Identity & Access

| Domain | Why it exists |
|---|---|
| **Users** | The single identity record behind every browsing, purchasing, and (later) content-creating action. Must outlive any one role, since a Student may later become a Contributor or Faculty account without a new identity being created. |
| **Sessions** | Separates *who someone is* (User) from *where/how they're currently logged in* — required for Part 4 §11's per-device refresh-token model and future "log out this device" control. |
| **Admin / Roles** | Distinguishes elevated capability from identity itself — a role is a capability grant, not a different kind of person, which is what lets one User become Admin, Faculty, or Contributor without migrating tables. |

### 1.2 Academic Structure (the Academic Descent, Part 1)

| Domain | Why it exists |
|---|---|
| **Universities** | The top-level tenant boundary. Exists as its own domain — not folded into Course — specifically so a second university (with its own Course/Branch/Subject naming) can exist without touching GGSIPU's tree. |
| **Courses** | Establishes the student's top-level identity ("what am I studying"). Exists so ~30 tiles can be seeded honestly (active + coming-soon) per Part 3 §3. |
| **Branches** | Narrows to peer-group identity. Exists independently of Subject so that Branch-level metadata (description, subject count) can exist without duplicating Subject content. |
| **Semesters** | A fixed, small lookup domain (1–6 + Internship & Placement) — exists as data, not as a hardcoded range, so a future course with 8 semesters doesn't require a schema change. |
| **Subjects** | Exists as a **platform-level domain**, deliberately independent of Branch — this is the single most load-bearing domain in the entire model (Part 1 §3.1). Its independence is what makes "10 → 50,000" a data fact rather than an aspiration. |
| **Branch–Semester–Subject Mapping** | Exists purely to let many Branches point at one Subject at a given Semester without duplicating the Subject. Without this domain as its own first-class thing, the shared-subject model has nowhere to live. |

### 1.3 Content & Catalog

| Domain | Why it exists |
|---|---|
| **Resource Types** | A lookup domain (Cheat Sheet, Revision Notes, PYQ Solutions, …) — exists as data so Part 3 §21's "new types are a data change" promise is literally true, not aspirational. |
| **Resources** | The universal sellable unit (Part 1 §3.2). Every other domain in this document ultimately exists to get a student to, or account for, a Resource. |
| **Resource Versions** | Exists separately from Resource because a Resource's identity (its price, its place in the IA, its reviews) must survive a content update — versioning is about *the file*, not *the product*. |
| **Bundles** | Exists as a thin wrapper domain over existing Resources (a named, priced *set*) — not a new kind of sellable thing, so it never forks the Resource schema. |
| **Reviews** | Exists to carry trust signals *specific to a Resource*, separable from the Resource itself so review moderation, editing, and future "helpful" voting can evolve independently of catalog content. |
| **Search Index Entries** | Exists as a derived, rebuildable domain (not a source of truth) — its only job is ranking/matching; deleting and rebuilding it must never lose real data. |

### 1.4 Commerce

| Domain | Why it exists |
|---|---|
| **Orders** | The transaction record — exists independently of Payment because one Order may see multiple payment attempts (Part 4 §9), and independently of Resource ownership because refunds must revoke access without deleting purchase history. |
| **Order Items** | Exists so one Order can hold one-or-many Resources (bundles, future multi-item cart) without Order itself needing to know how many items it holds. |
| **Payments** | Exists separately from Order specifically to record *gateway-side* truth (transaction refs, signatures, verification state) distinct from *business-side* truth (what was bought). |
| **Coupons** | Exists as a standalone, reusable discount domain — never tied to one Order, since the same coupon is validated against many. |
| **Wishlist / Bookmarks** | Two related but distinct domains: **Wishlist** = "I intend to buy this," **Bookmarks** = "I want to find this again" (e.g., a free-to-browse Subject or Preview). Kept separate because conflating "save for later" with "intent to purchase" would corrupt both the Dashboard UX (Part 3 §14) and future recommendation signals. |
| **Invoices** | Exists as an immutable, student-facing financial document distinct from the mutable Order record — an Order's internal status can change (refunded, disputed) without altering the historical Invoice that was already issued. |
| **Downloads (Download Log)** | Exists to record *every* signed-URL issuance, independent of Order — this is what makes re-download auditable and rate-limitable without re-deriving it from Order history each time. |

### 1.5 Trust, Communication & Operations

| Domain | Why it exists |
|---|---|
| **Notifications** | Exists as the single domain for anything pushed to a student (receipts, version-update alerts, announcements) — kept as one domain so notification *preferences* and *delivery log* are managed in one place, not scattered per feature. |
| **Announcements** | Exists as a distinct, admin-authored subtype of Notification (platform-wide, not user-triggered) — separated because its lifecycle (schedule, expire, target audience) differs fundamentally from a transactional receipt. |
| **Support (Tickets/Contact Submissions)** | Exists as its own lightweight domain per Part 4 §12/Part 5 §5 — deliberately not folded into Notifications, since a Support item has its own status lifecycle (open → resolved) that a Notification never has. |
| **Audit Logs** | Exists as an append-only meta-domain over every other domain — its job is to answer "what happened and when," never "what is true right now" (that's each domain's own job). |
| **Version History (platform-level)** | Distinct from Resource Versions — this is the *document set itself* (Parts 1–5, ADRs) being tracked, not product content; included here because Section 8's audit thinking applies to planning artifacts too, even though it's operationally a `/docs` concern, not a runtime one. |

### 1.6 Reserved for Future Phases (modeled now, dormant until activated — Section 12 covers this in full)

| Domain | Why it's reserved now |
|---|---|
| **Subscriptions** | Already named in Part 4 §9/§20 — reserved as its own domain so it never entangles with one-time Order/Payment logic. |
| **Creator / Contributor Profiles** | Extends User with a `creator` role and creator-specific metadata (payout details, submission history) — reserved so Tier 3 sourcing (Part 5 §1) has somewhere to attach without a User-table migration later. |
| **Faculty Accounts** | Extends User's role enum (Part 4 §11) — reserved identically to Creator. |
| **Organizations / Teams** | Reserved per Part 4 §20 — a future grouping over Users, additive only. |
| **Referrals / Affiliates** | Reserved per Part 4 §20 — thin, additive domains layered on the existing Coupon mechanism. |

---

## Section 2 — Entity Design

For each core entity: purpose, responsibilities, lifecycle, ownership, relationships, and future expansion. (No SQL, no field-level types — that is an implementation concern, not a modeling one.)

### University
- **Purpose**: top-level tenant boundary for the entire academic tree.
- **Responsibilities**: holds identity/branding metadata (name, short code); is the root every Course hangs from.
- **Lifecycle**: created rarely, by Admin only; never deleted once it has any Course beneath it (archived instead — Section 9).
- **Ownership**: owned entirely by platform Admin; no student-facing mutation ever.
- **Relationships**: one University → many Courses.
- **Future expansion**: a second University (Part 1 §7) is a new row, not a new table — its own Course/Branch/Subject tree hangs beneath it identically.

### Course
- **Purpose**: establishes the student's top-level academic identity.
- **Responsibilities**: holds display name, active/coming-soon status, category grouping (Part 3 §3's Engineering/Commerce/etc. clusters).
- **Lifecycle**: seeded upfront (~30 rows), most `coming_soon`; flips to `active` by an explicit Admin action, never automatically.
- **Ownership**: Admin-only mutation.
- **Relationships**: belongs to one University; has many Branches.
- **Future expansion**: activating a new Course is a status flip, not a schema change (Part 1 §7).

### Branch
- **Purpose**: narrows to peer-group/specialization identity.
- **Responsibilities**: display name, one-line description, active/coming-soon status; derives (never stores redundantly except as a cached count, Section 9) its subject count.
- **Lifecycle**: seeded per Course; ordering among active branches is content-depth-driven (Part 3 §4), meaning Branch carries a manually-set or computed *display order*, not just a creation timestamp.
- **Ownership**: Admin-only mutation.
- **Relationships**: belongs to one Course; connects to Subjects only through the mapping entity (never directly).
- **Future expansion**: new Branches under an existing Course require zero code — pure data insert.

### Semester
- **Purpose**: a fixed, small lookup of temporal/lifecycle-stage labels (1–6, plus the non-numeric "Internship & Placement" entry).
- **Responsibilities**: label, display order, a flag distinguishing the numbered semesters from the parallel Placement track (Part 1 §4) — this flag is what lets the frontend render the Placement Hub as visually separate rather than "Semester 7," per Part 1's explicit instruction.
- **Lifecycle**: essentially static; edited only if the academic calendar structure itself changes (e.g., a trimester-based course added later).
- **Ownership**: Admin-only mutation, rarely exercised.
- **Relationships**: connects to Branch and Subject only through the mapping entity.
- **Future expansion**: a course using a different term structure (trimesters) reuses this same lookup domain with different rows — no new entity needed.

### Subject (Platform-Level)
- **Purpose**: the single most important entity in the model — represents one body of academic content, independent of which Branch teaches it.
- **Responsibilities**: canonical name, subject code, description, cached resource count (Section 9's sanctioned denormalization).
- **Lifecycle**: created once by Admin/Content Ops when a new subject is identified; never duplicated for a second Branch that studies the same material — a new Branch instead gets a new *mapping* row (below).
- **Ownership**: Admin/Content Ops mutation; read by everyone.
- **Relationships**: many-to-many with Branch+Semester via the mapping entity; one-to-many with Resource.
- **Future expansion**: the entire "content creation scales linearly, availability scales combinatorially" thesis (Part 1 §3.1) depends on this entity never being forked per Branch, under any future pressure.

### Branch–Semester–Subject Mapping
- **Purpose**: the join entity that actually implements the shared-subject model.
- **Responsibilities**: one row = "this Subject appears in this Branch, at this Semester." Nothing else.
- **Lifecycle**: created whenever a Branch adopts an existing (or new) Subject at a given Semester; deleted (or archived) only if a curriculum genuinely drops a subject — extremely rare, always an explicit Admin action.
- **Ownership**: Admin/Content Ops.
- **Relationships**: many-to-one with Branch, Semester, and Subject each.
- **Future expansion**: a 4th Branch studying DSA in Sem 3 is one new mapping row — zero new Subject or Resource records (Part 1 §3.1, restated here at the entity level).

### Resource Type
- **Purpose**: lookup domain naming the *kind* of resource (Cheat Sheet, Revision Notes, PYQ Solutions, Placement Handbook, etc.).
- **Responsibilities**: label, slug, an ordering hint for how types are displayed on the Resource-type selection screen (Part 3 §6).
- **Lifecycle**: extended by Admin whenever a genuinely new content type is introduced — an insert, never a code deploy (Part 4 §5).
- **Ownership**: Admin-only.
- **Relationships**: one-to-many with Resource.
- **Future expansion**: this is the literal mechanism behind Part 3 §21's "new resource types extend the enum only."

### Resource
- **Purpose**: the universal sellable unit — every product on the platform, regardless of type, is one Resource.
- **Responsibilities**: full detail in Section 4 below.
- **Lifecycle**: full detail in Section 7 (Status System) and Part 4 §7 (Pipeline).
- **Ownership**: created by Content Ops/Admin (Tier 1/2 sourcing, Part 5 §1); future Tier 3 creates via a Creator role with a mandatory review gate.
- **Relationships**: belongs to Subject (nullable, for Placement Hub items) and Resource Type; has many Resource Versions, Order Items, Reviews, Download Log entries.
- **Future expansion**: adding a `creator_id` (nullable) is the only change required for the Creator Marketplace (Part 4 §20) — no restructuring.

### Resource Version
- **Purpose**: tracks the history of a Resource's underlying file across updates.
- **Responsibilities**: version number, file references (Part 4 §6's storage paths), change notes, publish timestamp.
- **Lifecycle**: a new row on every content update; prior versions are never deleted, only superseded — the Resource's `current_version` pointer moves forward (Part 4 §6).
- **Ownership**: Admin/Content Ops.
- **Relationships**: belongs to one Resource; a Resource has many Versions but exactly one "current" pointer.
- **Future expansion**: this is what already fully supports Section 6 below without any further modeling.

### Bundle
- **Purpose**: a named, priced grouping of existing Resources (Part 5 §2).
- **Responsibilities**: name, description, computed/stored discount price, membership list.
- **Lifecycle**: created/edited by Admin; a Bundle can be retired (hidden) without deleting the underlying Resources.
- **Ownership**: Admin.
- **Relationships**: many-to-many with Resource (a Bundle Item join entity, mirroring Order Item's shape); purchased via the same Order/Order Item mechanism as any single Resource (Part 4 §9 — "one order, many items," no special-casing).
- **Future expansion**: subscription-included bundles (Section 12) reuse this same membership structure.

### Review
- **Purpose**: carries a trust signal specific to one Resource.
- **Responsibilities**: rating, comment, association to the purchasing User, moderation status.
- **Lifecycle**: seeded/curated in v1 (Part 3 §21); user-submitted with a moderation queue once Community Reviews activates — same entity, different creation path.
- **Ownership**: created by User (post-purchase only, to prevent unverified reviews), moderated by Admin.
- **Relationships**: belongs to User and Resource.
- **Future expansion**: a `helpful_count` or reply-thread is additive to this entity, never a new one.

### User
- **Purpose**: the single identity behind every role the platform will ever have.
- **Responsibilities**: auth credentials/OAuth linkage, role, profile basics, notification preferences.
- **Lifecycle**: created at Checkout (guest→account, Part 3 §10) or via Google OAuth; soft-deleted on account closure (Section 9).
- **Ownership**: self-owned (a User manages their own record); Admin can view/moderate but not silently edit auth credentials.
- **Relationships**: one-to-many with Order, Wishlist, Review, DownloadLog, Session; role field gates access to Admin/Creator/Faculty capabilities without needing separate identity tables.
- **Future expansion**: Creator and Faculty (Section 1.6) are role values and attached profile tables, never new identity systems.

### Session
- **Purpose**: represents one authenticated device/login instance.
- **Responsibilities**: refresh-token reference, device fingerprint, last-active timestamp.
- **Lifecycle**: created at login, revoked on logout/explicit device-removal/expiry.
- **Ownership**: self-owned (User can view/revoke own sessions, Part 4 §11).
- **Relationships**: belongs to one User.
- **Future expansion**: a future "log out everywhere" or suspicious-login alert is additive to this entity.

### Order
- **Purpose**: the transaction record for one checkout attempt.
- **Responsibilities**: status, total amount, coupon applied (if any), timestamps.
- **Lifecycle**: full detail in Section 5.
- **Ownership**: belongs to the purchasing User; mutated by the system (status transitions) and Admin (manual overrides/refunds).
- **Relationships**: one-to-many with Order Item; one-to-one (practically) with the *paid* Payment, though structurally one-to-many with Payment attempts (Part 4 §9).
- **Future expansion**: Subscription-driven recurring charges (Section 12) create their own Orders on each billing cycle, reusing this entity unchanged.

### Order Item
- **Purpose**: one purchased line within an Order.
- **Responsibilities**: references exactly one Resource (or, via Bundle expansion, one Resource that was part of a purchased Bundle), captures the price *at time of purchase* (never a live lookup — protects historical invoices from later price changes).
- **Lifecycle**: created with the Order, immutable once the Order is paid.
- **Ownership**: system-created only.
- **Relationships**: belongs to Order and Resource.
- **Future expansion**: none needed — this entity's flat shape is what already supports bundles and future multi-item carts.

### Payment
- **Purpose**: gateway-side truth about a payment attempt.
- **Responsibilities**: gateway transaction reference, verification status, raw webhook reference (for audit, not for re-parsing business logic from).
- **Lifecycle**: created when gateway checkout is initiated; one Order may have several Payment attempts before one succeeds (Part 4 §9).
- **Ownership**: system-created only, mutated only by verified webhook events.
- **Relationships**: belongs to Order.
- **Future expansion**: a second gateway (Stripe, Part 4 §1) is a new Payment sub-type/discriminator, not a schema rewrite — the Order/Payment separation already isolates gateway concerns.

### Coupon
- **Purpose**: standalone, reusable discount rule.
- **Responsibilities**: code, discount type/value, validity window, usage limit (global and/or per-user), applicability scope (all resources / specific course / specific subject — optional future narrowing).
- **Lifecycle**: created for a specific calendar window (Part 5 §2's "never perpetual" rule), expires automatically past its window.
- **Ownership**: Admin.
- **Relationships**: referenced by Order at checkout time (validated fresh every time, Part 4 §9 — never trusted from client state).
- **Future expansion**: Referral/Affiliate codes (Section 1.6) reuse this same validity-window/usage-limit shape.

### Wishlist Entry
- **Purpose**: records purchase intent.
- **Responsibilities**: User–Resource pairing, timestamp added.
- **Lifecycle**: created/removed freely by the User; cleared automatically (or flagged) once the Resource is purchased.
- **Ownership**: self-owned.
- **Relationships**: many-to-many join between User and Resource.
- **Future expansion**: could feed a future "wishlist price-drop" notification without any structural change.

### Bookmark
- **Purpose**: records "find this again" intent, distinct from purchase intent — may point at a Subject, not only a Resource.
- **Responsibilities**: User reference, target entity type + ID (polymorphic-in-concept, not in the SQL sense — kept simple as two nullable foreign keys, Subject and Resource, at most one populated per row).
- **Lifecycle**: created/removed freely by the User.
- **Ownership**: self-owned.
- **Relationships**: belongs to User; references Subject or Resource.
- **Future expansion**: extending bookmarkable types (e.g., Bundles) is an additional nullable reference, not a redesign.

### Invoice
- **Purpose**: the immutable financial document issued to a student.
- **Responsibilities**: line items (mirroring Order Items at time of issuance), totals, tax details if applicable, issued timestamp.
- **Lifecycle**: generated once, automatically, the moment an Order reaches `paid` (Part 4 §9); never edited afterward — a refund creates a *new* record (credit note/refund receipt), it does not rewrite the original Invoice.
- **Ownership**: system-generated; Admin can resend, never edit.
- **Relationships**: belongs to one Order.
- **Future expansion**: GST/tax-line support (Section 13) is additive fields, not a new entity.

### Download Log Entry
- **Purpose**: records every signed-URL issuance.
- **Responsibilities**: User, Resource, Resource Version at time of download, timestamp, (optionally) IP/device for abuse investigation.
- **Lifecycle**: append-only, never edited or deleted (Section 9).
- **Ownership**: system-generated.
- **Relationships**: belongs to User and Resource.
- **Future expansion**: powers any future "download analytics" or rate-limiting without new modeling.

### Notification
- **Purpose**: the single domain for anything delivered to a User.
- **Responsibilities**: type (receipt, version-update, announcement-delivery, support-reply), payload reference, read/unread state, delivery channel (email/in-app).
- **Lifecycle**: created by the triggering event (order paid, resource version published, announcement scheduled); read-state updated by the User.
- **Ownership**: system-generated; User controls read-state and channel preferences.
- **Relationships**: belongs to User; references the triggering entity (Order, Resource, Announcement) loosely, by type + ID.
- **Future expansion**: new notification types are new `type` enum values, not new tables.

### Announcement
- **Purpose**: platform-wide, admin-authored broadcast.
- **Responsibilities**: message, target audience scope (all / specific Branch / specific Course), schedule window (start/expire).
- **Lifecycle**: created by Admin, auto-expires past its window, never resent automatically (Part 4 §12's "used sparingly" principle enforced structurally by requiring a fresh Admin action to re-broadcast).
- **Ownership**: Admin.
- **Relationships**: fans out to Notification entries per targeted User at delivery time (not stored as a giant User list on the Announcement itself).
- **Future expansion**: none needed — targeting scope can grow (e.g., target by role) as a field addition.

### Support Ticket
- **Purpose**: a lightweight queue of student contact-form submissions (Part 4 §12, Part 5 §5).
- **Responsibilities**: subject, message, status (open/in-progress/resolved), linked Order if relevant.
- **Lifecycle**: created by student submission, transitions through status by Admin action, never auto-deleted.
- **Ownership**: created by User (or guest, if contact form allows unauthenticated submission), managed by Admin.
- **Relationships**: optionally references an Order or Resource for context.
- **Future expansion**: a full ticketing system (SLA timers, assignment) is additive fields/entities layered on this same base, per Part 5 §5's explicit "not v1" note.

### Audit Log Entry
- **Purpose**: append-only record of every state-changing Admin action.
- **Responsibilities**: actor (User/Admin), action type, target entity + ID, before/after summary (not a full diff, per Section 8), timestamp.
- **Lifecycle**: created automatically alongside the triggering action; never edited or deleted, ever.
- **Ownership**: system-generated, read-only even to Admin.
- **Relationships**: loosely references any other entity by type + ID (never a hard foreign key, so an audit trail survives even if — in an exceptional hard-delete case, Section 9 — the target row is later gone).
- **Future expansion**: none needed; this entity's shape is deliberately generic enough to cover any future action type.

---

## Section 3 — Relationships

### 3.1 Core relationship map

```
University          1───* Course
Course              1───* Branch
Branch              *───*  Subject      (via Branch–Semester–Subject Mapping, which also carries Semester)
Semester            *───*  Subject      (via the same Mapping entity)
Subject             1───* Resource
Resource Type       1───* Resource
Resource            1───* Resource Version
Resource            *───*  Bundle       (via Bundle Item)
User                1───* Order
Order               1───* Order Item
Order Item          *───1 Resource
Order               1───* Payment           (usually one, structurally many-attempts)
User                *───*  Resource         (via Wishlist Entry)
User                *───(Subject | Resource) (via Bookmark)
User                1───* Review
Resource            1───* Review
User                1───* Download Log Entry
Resource            1───* Download Log Entry
Order               1───1 Invoice
User                1───* Session
User                1───* Notification
User                1───* Support Ticket
(any entity)         1───* Audit Log Entry   (loose reference, not a hard FK)
```

### 3.2 Relationship types explained

- **One-to-many, structural hierarchy** (University→Course→Branch): strict parent-child, a child cannot exist without its parent, deletion of a parent is never allowed while children exist (Section 9).
- **Many-to-many, via explicit mapping entity** (Branch↔Subject, Resource↔Bundle): never modeled as a direct many-to-many without an explicit join entity, because the join entity itself carries meaningful data (Semester, in the Branch–Subject case; price-at-bundle-time, in the Bundle case) — a bare join table would lose that.
- **One-to-many, ownership** (User→Order, User→Review): the "many" side always carries the owning User's reference; ownership is never inferred transitively (e.g., Order Item does not carry User directly — it's reached through Order — because an Order Item's owner is unambiguous and duplicating the reference would risk drift).
- **One-to-many, append-only/audit** (User→Download Log, any entity→Audit Log): structurally a one-to-many, but behaviorally distinct — rows are never updated or deleted, only inserted.
- **Loose/polymorphic-in-concept reference** (Audit Log→target entity, Notification→triggering entity, Bookmark→Subject-or-Resource): used only where the alternative (one table per referenced type) would create needless duplication of near-identical logic; kept to a small, explicit set of possible target types — never an open-ended "reference anything" pattern.
- **Dependency relationships** (Payment depends on Order; Invoice depends on Order; Order Item depends on Resource): expressed as required (non-nullable) foreign keys — the dependent entity cannot be created without its parent already existing.
- **No inheritance is used anywhere in this model.** Every attempt to introduce entity inheritance (e.g., "Bundle is a kind of Resource") was deliberately rejected — Bundle wraps Resources rather than extending Resource, keeping Resource's schema (Section 4) singular and unforked, which is the entire point of Part 1 §3.2's universal Resource object.

---

## Section 4 — Resource Model (The Perfect Resource)

Every field on Resource, and why it exists.

| Field group | Field | Purpose |
|---|---|---|
| **Identity** | `id` | Immutable, opaque identifier — never a human-readable slug used as a primary key (Section 13). |
| | `title` | Display name shown throughout the journey and in SEO metadata. |
| | `slug` | URL-safe, human-readable identifier for SEO (Part 4 §18) — derived from title but independently editable, so a title correction never breaks an existing indexed URL. |
| **Classification** | `subject_id` | Nullable — null exclusively for Internship & Placement Hub items (Part 1 §4), otherwise required. |
| | `resource_type_id` | Required — links to the lookup domain (Section 2). |
| | `tags` | A lightweight array of cross-cutting search terms (Part 4 §8) — supplements, never replaces, hierarchy-based discovery. |
| **Metadata** | `description` | Short, factual summary — feeds both the Resource Detail screen and SEO meta description (templated, per Part 4 §18, never manually authored per resource). |
| | `page_count` | Auto-extracted at pipeline time (Part 4 §7) — shown pre-download so a student knows what they're getting. |
| | `file_size` | Auto-extracted, same reasoning. |
| | `language` | Reserved for future multi-language content (currently always one value) — modeled now so it never requires a later migration. |
| **SEO** | `meta_title` / `meta_description` | Template-derived overrides (Part 4 §18) — allowed to be explicitly set by Admin for a specific high-traffic resource, but default to a generated template otherwise. |
| | `canonical_branch_id` | The one Branch path treated as canonical for a shared Subject's Resource (Part 4 §18) — prevents duplicate-content penalties when the same Resource is reachable via multiple Branch paths. |
| **Preview** | `preview_unlocked_page_ratio` | The configured percentage of pages shown in full (Part 3 §9, typically 20–30%) — stored per-resource (not globally hardcoded) so an unusually short or long resource can be tuned individually. |
| | `preview_asset_ref` | Pointer to the generated, watermarked preview file (Part 4 §6). |
| | `thumbnail_ref` | Pointer to the card thumbnail. |
| **Versioning** | `current_version_id` | Points to the active Resource Version (Section 2/6) — the only field on Resource itself that changes on every content update; everything else about the Resource's identity stays stable across versions. |
| **Visibility & Status** | `status` | Full enum and lifecycle in Section 7. |
| | `visible_from` / `visible_until` | Optional scheduling fields (supports the `scheduled`/`expired` states in Section 7) — nullable, unused for most resources. |
| **Pricing** | `price` | A single, round-number value (Part 5 §2) — set once per Resource, never per Branch, even when the Resource is reachable through multiple Branch paths. |
| | `discount_price` | Nullable — populated only during an active, calendar-bound Coupon/promotion context; the base `price` is never overwritten to represent a discount. |
| **Ownership** | `created_by` | The Admin/Content Ops user who created the record (Section 8). |
| | `owner_id` | Nullable, reserved — populated only once the Creator Marketplace (Section 1.6) activates; until then, every Resource is platform-owned by default. |
| **Ranking** | `search_rank_boost` | Periodically recomputed (not live) from purchase/preview counts (Part 4 §8) — used only to break ties among equal keyword matches. |
| **Cached/Denormalized** | `review_average` / `review_count` | Sanctioned denormalization (Section 9) — refreshed async, never the source of truth (the Review entity is). |

**Explicitly excluded from Resource**: the actual file bytes (always in object storage, referenced by ID-based path per Part 4 §6, never in the database), and any Branch-specific price or availability override (deliberately impossible, per Part 1 §3.1 and Part 5 §2 Rule 3).

---

## Section 5 — Purchase Lifecycle

### 5.1 Stages and the entities that carry them

```
Browsing (no entity yet — guest, Part 3 §10)
   │
   ▼
Cart / Checkout entered  →  Order created, status: pending
   │                          (Order Items attached: single Resource or Bundle expansion)
   ▼
Coupon applied (optional)  →  re-validated server-side at submission (Part 4 §9), never trusted from client state
   │
   ▼
Payment initiated          →  Payment row created, referencing Order, status: initiated
   │
   ▼
Gateway webhook received   →  signature verified server-side (the single non-negotiable rule, Part 4 §9)
   │
   ├── Success  →  Payment.status: verified  →  Order.status: paid  →  Invoice generated (async)
   │                                                                 →  Ownership becomes real (Order Item + paid Order = access)
   │                                                                 →  Download Log entries begin as the student downloads
   │
   └── Failure  →  Payment.status: failed     →  Order.status: remains pending (never silently deleted, Part 4 §9)
                                                → student sees "Payment Failed," reassured no amount was charged
                                                → student may retry: a new Payment row is created against the SAME Order
                                                  (duplicate-Order prevention, Part 4 §9, checks for an existing
                                                  pending/paid Order for the same User+Resource before allowing a new Checkout)
   │
   ▼ (later, if requested)
Refund initiated (Admin)   →  gateway refund API called  →  Order.status: refunded
                            →  access revoked immediately (ownership check, Section 2's Download Log entity,
                               now fails the "Order.status != refunded" condition, Part 4 §10)
                            →  original Invoice is NOT edited; a separate refund/credit record is issued instead

Cancellation (pre-payment) →  Order.status: cancelled — only reachable from `pending`, never from `paid`
                              (a paid Order can only become `refunded`, never `cancelled` — these are
                              deliberately distinct terminal states so financial reporting never conflates
                              "never charged" with "charged then reversed")
```

### 5.2 Ownership, precisely defined

A student "owns" a Resource if and only if: there exists an Order Item referencing that Resource, whose parent Order has `status: paid`, and that Order's status has never subsequently become `refunded`. This single condition (Part 4 §10) is checked fresh on every download request — never cached client-side, never inferred from anything but this live check.

### 5.3 Retry behavior

A failed Payment never invalidates its Order. A new Payment row is created for each retry attempt, all referencing the same Order — this is precisely why Payment is modeled as its own entity distinct from Order (Section 2), rather than a status field on Order itself.

---

## Section 6 — Resource Versioning

- **Version history**: every content update creates a new Resource Version row (Section 2); the previous version's file remains retrievable, never overwritten (Part 4 §6).
- **Updates**: an Admin/Content Ops action moves `Resource.current_version_id` forward — this is the only mutation an update performs on the Resource entity itself; everything else about the Resource (price, reviews, Subject mapping) is untouched.
- **Notifications**: a version update triggers a Notification (Section 2) to every User who owns the Resource (per the Section 5.2 ownership definition) — fulfilling Part 3 §16's "free updates" promise transparently, without a separate "claim your update" action.
- **Backward compatibility**: because ownership is checked against the Resource (not a specific version) and downloads always resolve to `current_version_id`, an owner's *next* download automatically serves the latest version — there is no compatibility problem to solve, by construction, since nothing about a prior version's *content* is ever promised to remain unchanged; only *access* is guaranteed to persist.

---

## Section 7 — Status System

### 7.1 Resource status enum

| Status | Meaning | Reachable from | Visible to students? |
|---|---|---|---|
| `draft` | Uploaded, pipeline-processed, awaiting Admin review | — (initial state) | No |
| `scheduled` | Approved, waiting for `visible_from` to pass | `draft` | No |
| `live` | Published and purchasable | `draft`, `scheduled` | Yes |
| `hidden` | Temporarily withdrawn from listings without deleting purchase history | `live` | No (but existing owners retain download access) |
| `need_update` | Flagged (by Admin, or by a refund-rate spike per Part 5 §10) as requiring a content revision | `live` | Yes, with a visible "update pending" signal — never silently pulled |
| `archived` | Deliberately retired (e.g., a superseded edition), kept for historical/audit purposes | `hidden`, `live` | No |
| `expired` | Past its `visible_until` date (rare — used for time-bound content, e.g., a specific exam year's PYQ once truly obsolete) | `live` | No |
| `deleted` (soft) | Marked for removal, excluded from all normal queries | any non-purchased state | No |

**Lifecycle rule**: `live` is only reachable through an explicit, separate Publish action (Part 4 §7 step 9) — never automatically upon upload, and never automatically upon leaving `draft`. `need_update` never auto-transitions to `hidden` — a flagged resource stays purchasable (with a visible notice) until Content Ops explicitly resolves it, because pulling it entirely would break the ownership/re-download promise for existing buyers if the Resource is later needed for reference.

### 7.2 Order status enum

`pending → paid → refunded` (terminal), or `pending → cancelled` (terminal), or `pending → failed → pending` (retry loop, Section 5).

### 7.3 Other status-bearing entities

- **Support Ticket**: `open → in_progress → resolved` (linear, no skip-back once resolved without an explicit re-open action).
- **Coupon**: `active` (within its validity window) → `expired` (automatic, date-based) — never manually deactivated mid-window without a recorded reason (Section 8).
- **Announcement**: `scheduled → active → expired` — mirrors Resource's scheduling pattern intentionally, for consistency.

---

## Section 8 — Audit System

- **Created By / Updated By / Deleted By / Published By**: every content-bearing entity (Resource, Subject, Branch, Course, Coupon, Announcement) carries these as simple User references, populated automatically by the service layer (Part 4 §3) — never settable by the client, never inferred after the fact.
- **History**: full before/after change history lives in Audit Log Entries (Section 2), not as versioned copies of the entity itself (Resource Versions are the one deliberate exception, because *file* history has a different retention/access shape than *metadata* history).
- **Logs**: Audit Log is append-only, queryable by actor, action type, or target — this is the mechanism that answers "who changed this price and when" without relying on anyone's memory.
- **Recovery**: because Resource Versions are never deleted and Audit Log Entries are never deleted, recovering from a bad Admin action (wrong price, wrongly archived resource) is always possible by reading the log and reverting the specific field — this is a *process* capability, not a separate "undo" entity.

---

## Section 9 — Soft Delete Strategy

**Default: soft delete everywhere a record has ever been customer-facing or financially relevant.**

| Entity | Delete strategy | Why |
|---|---|---|
| Resource | Soft (`status: deleted`) | A purchased-then-deleted Resource must remain resolvable for existing owners' Download Log/ownership checks (Section 5.2) — hard-deleting it would silently break a paid customer's access. |
| Order / Order Item / Payment / Invoice | Never deleted, soft or hard | Financial records are retained indefinitely for compliance (Part 4 §15) — "soft delete" doesn't even apply; there is no delete path at all. |
| User | Soft (`status: closed`, credentials invalidated) | Preserves referential integrity for their historical Orders/Reviews/Audit entries while honoring an account-closure request; anonymization of personally identifying fields (Section 13's DPDP note) happens on top of the soft-delete, not instead of it. |
| Review | Soft | A removed review should stop displaying without breaking the Resource's historical `review_count` denormalization math. |
| Subject / Branch / Course / University | Soft (`archived`), never hard | These are structural nodes other live entities point to; hard-deleting one risks orphaning Resources or Mappings that reference it. |
| Coupon | Hard delete acceptable if never used | If a Coupon was created but never redeemed and its window has passed, it carries no historical dependency — hard delete is fine here specifically because nothing references it. |
| Notification | Hard delete acceptable after a retention window | Purely a delivery/read-state record with no downstream financial or audit dependency — safe to purge on a rolling schedule (Part 4 §15's 12–24 month analytics retention applies analogously). |
| Session | Hard delete on logout/expiry | No historical value once expired; retaining it would only be a security liability. |
| Download Log / Audit Log | Never deleted | Their entire purpose is to be a permanent record — see Section 2. |

**Where hard delete is acceptable, generally**: only for entities with (a) no financial history, (b) no other entity holding a required reference to them, and (c) no audit/trust value in their having existed. In this model that's essentially limited to unused Coupons, expired Sessions, and old Notifications past their retention window.

---

## Section 10 — Indexing Strategy (Conceptual)

| Entity / field | Why it needs an index |
|---|---|
| Every foreign key | Default — any join query (Resource by Subject, Order by User) depends on this |
| `Resource.status` | Constantly filtered to `live` in every public listing query (Part 4 §5) — the single most frequently filtered field in the entire schema |
| `Resource.subject_id + resource_type_id` (composite) | The exact query the Resource List screen runs (Part 3 §6) |
| `Order.user_id + status` | The Dashboard Purchases tab's core query (Part 3 §14) |
| `Subject.name + code` (full-text) | Powers keyword search (Part 4 §8) |
| `Resource.title` (full-text) | Same reasoning |
| `Resource.slug` | Every SEO/canonical page-load resolves a resource by slug (Part 4 §18) |
| `Branch–Semester–Subject Mapping` (composite on Branch+Semester) | The exact query the Subject Selection screen runs (Part 3 §6) |
| `Coupon.code` | Checkout-time lookup must be near-instant, and this field is also a natural uniqueness constraint |
| `Download Log.user_id + resource_id` | Powers both the ownership re-check (Section 5.2) and any future rate-limiting on repeated download requests |
| `Audit Log.target_type + target_id` | Investigating "what happened to entity X" is the primary query shape against this table |
| `Wishlist.user_id` / `Bookmark.user_id` | Dashboard reads (Wishlist tab, Part 3 §14) |

**Philosophy**: index every hot-path read query identified above; avoid speculative indexing on fields with no known query pattern, since every index has a write-cost tradeoff (Part 4 §16) — indexes are added in response to a real query shape from Parts 1–5, not preemptively "just in case."

---

## Section 11 — Search Model

- **Search Tags**: a lightweight array on Resource (Section 4) — cross-cutting terms ("PYQ," "2024") that supplement, never replace, hierarchy navigation (Part 4 §8).
- **Keywords**: derived from Subject name/code and Resource title/description via full-text indexing (Section 10) — no separate "keywords" field is maintained by hand; keeping keywords as a derived index, not a manually curated field, avoids drift between what's searchable and what's actually displayed.
- **Aliases**: a small, optional array on Subject for known alternate names (e.g., "DSA" alongside "Data Structures & Algorithms") — exists because students search colloquially, not by official subject titles; kept on Subject (not duplicated per Resource) since an alias belongs to the academic concept, not to any one resource about it.
- **Subject Codes**: indexed as a high-priority, exact-match-boosted field (Section 10) — this is what a power-user student types directly (Part 3 §15).
- **Popularity**: `search_rank_boost` on Resource (Section 4), recomputed periodically from purchase/preview counts — a tie-breaker only, never able to override an exact subject-code or title match.
- **Recommendations**: modeled as a *query*, not a stored entity — "Related Resources" and "Recommended" (Part 3 §21) are computed from existing relationships (same Subject, co-purchase patterns) at read time; a dedicated `Recommendation` table is deliberately avoided in v1 to prevent a second, driftable source of truth.
- **Future AI Search**: the search domain already exists as an isolated concern (Search Index Entries, Section 1.3) behind a service boundary (Part 4 §8) — semantic ranking replaces the *ranking function* only; Subject/Resource data, tags, and aliases feed it unchanged.

---

## Section 12 — Scalability

How this exact model supports each future feature **without a redesign** — restated at the data-model level (Part 4 §20 makes the same claim at the engineering level; this section is its data-model proof):

| Feature | How the existing model absorbs it |
|---|---|
| **Bundles** | Already modeled (Section 2) as a wrapper over Resource via a Bundle Item join — purchased through the existing Order/Order Item mechanism, no new commerce path. |
| **Subscriptions** | A new `Subscription` entity (Section 1.6), its own recurring-billing cycle, but each billing cycle still just creates a normal Order — the one-time purchase flow (Section 5) is never touched. |
| **Creator Marketplace** | `Resource.owner_id` (already nullable, reserved in Section 4) populates; a Creator Profile entity attaches to User via role (Section 1.6); the Resource Pipeline's existing draft→review→publish gate (Part 4 §7) is the same gate a Creator's submission goes through. |
| **Faculty Accounts** | A `role` enum value on User (already anticipated, Part 4 §11) plus a scoped-permission layer over the existing Resource/Subject entities — no new content model. |
| **Community Uploads** | Same mechanism as Creator Marketplace, gated by the same review status system (Section 7) already in place. |
| **AI Search** | Section 11 — ranking-function swap only. |
| **AI Tutor** | Reads existing Subject/Resource content as context for an LLM call; writes nothing new to the core schema — purely additive, read-only consumption. |
| **Multiple Universities** | University is already the top-level entity (Section 2) — a second row, with its own Course/Branch/Subject tree beneath it, changes zero other tables. |
| **Multiple Countries** | Absorbed the same way as multiple Universities, plus a currency field on Order/Payment/Resource pricing (an additive field, not a new entity) and a locale field on User for future localized notifications. |

**The consistent proof pattern across every row above**: each future feature attaches to an existing entity (via a nullable field, a new role value, or a thin wrapper entity) rather than requiring any existing entity to be restructured — which is the data-layer restatement of Part 1's founding "10 → 50,000 without redesign" thesis.

---

## Section 13 — Data Governance

- **Naming conventions**: entities named as singular nouns conceptually (Resource, Order, User), consistent with Phase 1 §8's `snake_case` table-naming rule at implementation time — this document stays at the conceptual level and defers exact casing to Phase 1's already-approved convention.
- **Primary keys**: every entity uses an opaque, non-guessable identifier (UUID) rather than a sequential integer — chosen specifically because sequential IDs would let a curious student infer catalog size or enumerate resources by incrementing a URL parameter (Part 4 §6's "IDs, never human-readable filenames" principle, applied here to primary keys as well).
- **UUID strategy**: generated at creation time by the application layer (not left to database default) so an entity's ID is known immediately, before the write completes — useful for the Resource Pipeline's async job coordination (Part 4 §7), where a job needs the Resource ID before the row is fully committed.
- **Timestamps**: every entity carries `created_at` and `updated_at`; audit-relevant entities additionally carry action-specific timestamps (`published_at`, `paid_at`, `refunded_at`) rather than inferring these from status-change history alone — explicit timestamps make reporting queries (Part 4 §13) direct rather than requiring a join into Audit Log every time.
- **Timezones**: all timestamps stored in UTC, converted to the student's local time only at display time — never stored pre-converted, which would make cross-region reporting (a future multi-country concern, Section 12) incorrect by construction.
- **Retention policy**: financial records (Orders, Payments, Invoices, Audit Logs) retained indefinitely (Part 4 §15); raw analytics/event data retained 12–24 months; Notifications purged on a rolling window (Section 9); Download Logs retained indefinitely (they are effectively a compliance/audit record of what was delivered to whom).
- **GDPR/DPDP readiness**: personally identifying fields on User are isolated (name, email, phone) so an anonymization routine can null/hash them on account closure while leaving the User row's ID intact for referential integrity with historical Orders/Reviews (Section 9's soft-delete note) — this separation is designed now specifically so a "right to erasure" request is a targeted field-level operation, never a cascading delete that would corrupt financial history.

---

## Section 14 — Data Validation

**Philosophy**: validation is layered, and each layer validates a different kind of thing — this mirrors Part 4 §3's Controller/Service/Repository separation exactly, extended to the data layer:

- **Structural constraints** (uniqueness, required fields, foreign-key integrity): enforced at the database level as the last line of defense — never relied upon as the *only* line, since a constraint violation surfacing as a raw database error is a poor experience, but always present so no invalid state can persist even if application-layer validation is ever bypassed by a bug.
- **Business rules** (a Coupon's validity window, whether a Resource can be purchased twice by the same User, whether an Order can transition from `paid` to `cancelled`): enforced exclusively in the Service layer (Part 4 §3) — never in the database, and never in a DTO/pipe, because these rules can change independent of shape and need to live where they can be tested and reasoned about as logic, not as constraints.
- **Duplicate prevention**: a uniqueness constraint on (User, Resource, Order-status-in-{pending,paid}) prevents the double-checkout race Part 4 §9 describes; a uniqueness constraint on Coupon code prevents two coupons sharing an identity; a uniqueness constraint on the Branch–Semester–Subject Mapping (Branch+Semester+Subject combination) prevents the exact duplication Part 1 §3.1 was designed to eliminate in the first place.
- **Consistency**: denormalized/cached fields (Subject's resource count, Resource's review average — Section 9's sanctioned exceptions) are refreshed by an async job triggered by the underlying change, never updated inline by the same request that caused the change — this keeps the write path for the source-of-truth data fast and simple, while accepting brief, bounded staleness on the cached fields only (never on financial or ownership data, where staleness is unacceptable).
- **What validation must never do**: silently coerce or "fix" invalid input (e.g., clamping a negative price to zero) — invalid input is always rejected with a clear error, never quietly corrected, because silent correction hides bugs that would otherwise surface immediately in testing.

---

## Section 15 — Summary

### 15.1 Domain Hierarchy

```
Identity & Access        (User, Session, Roles)
Academic Structure        (University → Course → Branch → Semester ⇄ Subject, via Mapping)
Content & Catalog          (Resource Type, Resource, Resource Version, Bundle, Review, Search Index)
Commerce                   (Order, Order Item, Payment, Coupon, Wishlist, Bookmark, Invoice, Download Log)
Trust & Operations         (Notification, Announcement, Support Ticket, Audit Log)
Reserved / Future          (Subscription, Creator Profile, Faculty role, Organization, Referral/Affiliate)
```

### 15.2 Entity Hierarchy

```
University
 └── Course
      └── Branch ──┐
                    ├── (Branch–Semester–Subject Mapping) ──┐
      Semester ─────┘                                        ├── Subject ── Resource ── Resource Version
                                                              │                └── Review
                                                              │                └── (Bundle Item) ── Bundle
User
 ├── Session
 ├── Order ── Order Item ── Resource
 │     ├── Payment
 │     └── Invoice
 ├── Wishlist Entry ── Resource
 ├── Bookmark ── (Subject | Resource)
 ├── Notification
 ├── Support Ticket
 └── Download Log Entry ── Resource

(all of the above) ── Audit Log Entry  (loose reference)
```

### 15.3 Relationship Summary

Strict parent-child down the academic tree (University→Course→Branch); a genuine many-to-many with a data-carrying join at the Branch↔Subject boundary (the single most important relationship in the model); simple ownership one-to-many everywhere commerce and personal data are concerned; append-only one-to-many for every audit/log entity; and zero inheritance anywhere — every entity that could have been modeled as "a kind of" another (Bundle as a kind of Resource, Faculty as a kind of User) is instead modeled as a wrapper or a role, preserving one single, unforked definition of Resource and User respectively.

### 15.4 Data Lifecycle Summary

Every entity in this document falls into exactly one of four lifecycle patterns: **(1) structural/rarely-mutated** (University, Course, Branch, Semester, Resource Type — edited by Admin, essentially never deleted); **(2) content with a formal status machine** (Resource, Coupon, Announcement, Support Ticket — explicit enumerated states, Section 7); **(3) transactional/immutable-once-final** (Order, Payment, Invoice — status progresses forward only, financial history never deleted); **(4) append-only** (Audit Log, Download Log — write-once, never mutated). No entity in the model mixes these patterns.

### 15.5 Scalability Summary

Every dimension of future growth named in Section 12 attaches to an existing entity via a nullable field, a new enum/role value, or a thin wrapper entity — never via restructuring an existing table's core identity. This is the direct data-layer consequence of, and proof for, Part 1's founding "10 → 50,000 without redesign" thesis, now demonstrated at the schema level rather than only at the product-strategy level.

### 15.6 Database Design Principles

1. Subjects are platform-level; nothing about the academic content model is ever duplicated per Branch.
2. Resource is a singular, universal schema — Bundles wrap it, Creators will reference it, but it is never forked.
3. Ownership is always re-derived from live Order/Order Item status, never cached as a standalone "owns" flag.
4. Payment status is never client-authoritative, and Payment is always a separate entity from Order.
5. Soft delete is the default wherever financial, ownership, or trust history could be affected; hard delete is reserved for genuinely history-free records.
6. Every audit-relevant entity is append-only, with no exceptions carved out for convenience.
7. Denormalization is allowed only for read-performance caching of otherwise-correct normalized data, refreshed async, never as a shortcut around getting the relational model right.
8. Every future feature must attach to an existing entity, role, or thin wrapper — if it can't, that's a signal the domain model needs more design work, not a database migration shortcut.

---

**End of Phase 2.** This is the complete Database Bible. No SQL, ORM models, or migrations were produced, per instruction — only the permanent domain model, entity design, relationships, and governance rules that all future schema implementation must conform to without contradiction.
