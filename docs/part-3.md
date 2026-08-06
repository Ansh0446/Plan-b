# PLAN B — UX Blueprint
### Part 3: Every Screen, In Order (Pre-Code)

*Builds directly on Part 1 (Information Architecture) and Part 2 (Design System / Brand Bible). Every screen below is described in terms of purpose and behavior only — no wireframes, no code. Component names referenced (Transcript Trail, Resource Card, Sticky Purchase Button, etc.) are the exact components defined in Part 2, used exactly as specified there.*

---

## 1. Landing Page

**Purpose**: convert a stressed, time-pressured visitor into a Browse click within seconds — not to explain the company, not to sell a philosophy.

**Order of sections, and why:**

1. **Hero** — Headline, subheadline, primary CTA, no imagery competing for attention.
   - *Headline*: names the outcome, not the company ("Find your subject. Get exactly what you need. Pass tomorrow's exam.") — never "Welcome to Plan B."
   - *Subheadline*: one line naming the mechanism ("Cheat sheets, revision notes, and PYQs — organized by your exact course, branch, and semester.") — this is where "no shortcuts, no clutter" gets stated as a *benefit*, not a constraint.
   - *Primary CTA*: **Browse** — leads straight into Course selection (Part 1, Section 6). One button, `button.primary`.
   - *Secondary CTA*: **How it works** — ghost-style text link, scrolls to section 5 below, for the minority who want reassurance before committing.
2. **Trust Indicators** — a single quiet row directly under the hero (student count, resource count, GGSIPU branch coverage) in `type.mono.price`-style numerals — mono numerals borrowed intentionally from Part 2's data-typography role, so even the landing page whispers "this is precise," not "this is hype."
3. **How It Works** — a 3–4 step visual restatement of the Academic Descent journey (Course → Branch → Semester → Subject → Resource), using the same iconography and Trail-style connectors as the real navigation — this is the one place on the landing page allowed to *preview* the product experience directly, so there's zero gap between the promise and the actual first click.
4. **Popular Subjects** — a short row of real Subject Cards (Part 2, Section 11) linking directly into the journey at the Subject layer — this exists purely as a low-friction bypass for a returning student who already knows their subject name and doesn't want to click through five layers again. It is the *only* sanctioned shortcut in the entire product, and it still lands the student inside the full journey (Preview → Purchase), never skipping Preview.
5. **Latest Resources** — small, recency-ordered strip (new uploads) — signals the platform is alive and actively maintained, which matters enormously for a trust-dependent purchase.
6. **Testimonials / Student Statistics** — kept minimal and specific (branch-tagged quotes, per Part 2 Section 11's Review Card spec) — generic 5-star badges are explicitly avoided; specificity ("Helped me clear DSA in one night — AI&DS, Sem 3") is the only testimonial format that survives scrutiny from a skeptical student audience.
7. **FAQ** — answers the 4–5 real objections (refunds, preview accuracy, device compatibility, "is this legit") — placed near the bottom because it's for hesitant visitors who've scrolled this far, not for the ready-to-click majority.
8. **Footer** — per Part 2, Section 13, unchanged.

**Sections deliberately removed**: no video hero, no animated counters, no chat widget, no "meet the founders" section, no pricing table (pricing is per-resource, shown deep in the journey, not summarized on landing), no newsletter block (Part 2, Section 13 already ruled this out and the reasoning carries through here).

**Exit points**: Browse (primary, expected), a Popular Subject tap (secondary, expected), or bounce (no exit-intent popups — inconsistent with brand restraint).

---

## 2. Browse (Entry Transition)

Technically a single interstitial action, not a standalone screen with its own layout — "Browse" is the click that begins the Course screen render. It's called out separately here only because it's a named step in your flow; in practice it *is* the Course Page (Section 3) loading.

**Purpose**: zero-content transition. **Psychology**: this is the moment the promise ("guided journey") starts being *proven*, not just stated — so the very first thing rendered must be the Course grid, with no interstitial splash, loading mascot, or "let's find your course!" copy. Instant, quiet, competent.

---

## 3. Course Page

**Purpose**: establish identity (Part 1 Principle: "where am I in my degree") and immediately communicate that B.Tech is live while everything else is visibly, honestly in progress.

- **Information hierarchy**: ~30 Course Cards (Part 2, Section 11) in a 4-up tile grid (Section 7), B.Tech visually identical in size/weight to every other card — active state communicated only via the status badge + full opacity vs. the 60%-opacity "Coming Soon" treatment (Part 2, Section 11's disabled spec). No pinning B.Tech to a special hero position — the grid stays alphabetical or logically grouped (Engineering / Commerce / Science / Design / Law / Medicine clusters), because artificially promoting B.Tech would look like manipulation rather than honesty about what's live.
- **Search**: a lightweight filter field scoped only to this screen (searches course names — "MBA," "B.Arch") — separate from Global Search (Section 20), since at this layer the student is orienting, not looking for a specific resource yet.
- **Categories**: optional light grouping headers (Engineering, Commerce, Science, Design, Medicine, Law) above the grid — purely organizational, not clickable filters, to avoid adding a second navigation system this early in the journey.
- **Hover behavior**: active card lifts per Part 2 Section 11; Coming Soon cards do not respond to hover at all (Part 2 Principle: disabled must *feel* inert).
- **Keyboard navigation**: arrow keys move focus grid-wise (left/right/up/down map to visual position, not DOM order) so keyboard users get the same spatial mental model as mouse users; Enter activates the focused card.
- **Loading**: skeleton grid matching the exact 4-up card shape (Part 2, Section 19) — never a spinner, since the grid shape itself is known immediately.
- **Empty state**: not applicable here (courses are seeded content, never zero) — reserved only for the search-filtered view ("No course matches '[query]'").

**Primary CTA**: tap B.Tech. **Secondary CTA**: none — Coming Soon cards are inert, not a secondary path (tapping one shows a small toast/tooltip: "B.Arch isn't live yet — B.Tech is ready now," reinforcing Part 2's empty-state copy rule).

**Psychology**: seeing 29 grayed-out peers next to one bright option does two things simultaneously — makes the active option feel special/curated, and makes the platform feel ambitious/growing rather than thin. This is a deliberate reversal of the instinct to hide what isn't ready yet.

**Possible mistake to avoid**: making "Coming Soon" cards fully invisible/hidden. That would make the platform look smaller than it is and remove the "this is going somewhere" signal that Part 1's scalability thesis depends on making *felt*, not just structurally supported.

---

## 4. Branch Page

**Purpose**: narrow to peer-group identity — the first screen where the content genuinely starts to feel personal.

- **Card ordering**: the three active branches first (AI&DS, AI&ML, IIoT — order matches whichever has the most live content, updated as inventory grows, not alphabetical — content depth should drive prominence here since these are peer options, not a fixed taxonomy), followed by inactive branches grouped and visually separated (a subtle divider label: "More branches, coming soon").
- **Card information**: branch name, one-line description, and **subject count** — yes, this should appear ("32 subjects mapped" per Part 2 Section 11) because it's a concrete trust/scope signal before committing deeper. **Semester count should not appear** — it's identical (1–6 + Placement) across every branch in this course and would be redundant, uninformative repetition on every card. **Student count should not appear** — without real, defensible numbers this invites the fabricated-social-proof failure mode Section 1's landing page testimonial rule already rejects; if reliable numbers exist later, this is a candidate token addition, not a v1 default.
- **Exit points**: back to Course (via Transcript Trail, now showing its first live segment: `BTECH /`), or forward into Semester.

**Psychology**: this is the "peer-group anchor" from Part 1 Section 5 — seeing the exact branch name, not a generic "Engineering" bucket, is what converts a browsing visitor into someone who feels *found*, not *filtered*.

---

## 5. Semester Page

**Purpose**: temporal anchor — the emotional peak of "where am I right now" in the whole journey (Part 1, Section 5).

- **Layout**: grid, not a literal timeline — a timeline visualization (connected line, progress markers) was considered and rejected: it implies a completion state ("3 of 6 done") that the platform has no reliable way to know (Plan B doesn't track the student's actual academic progress, only their navigation history), and a false-progress UI is a trust risk larger than the aesthetic benefit.
- **Cards**: Semester Card (Part 2, Section 11) — large mono numeral as hero, subject count beneath.
- **Icons**: none needed on the numbered semester cards (the numeral *is* the icon, per Part 2's card spec) — the Internship & Placement card alone gets a small distinguishing icon (briefcase/target glyph) since it's the one card that isn't a number and needs a different at-a-glance read.
- **Progress**: not shown, for the reason above — instead, a soft, non-committal touch is used: if the student has *previously purchased* something from a given semester, that Semester Card gets a small "Previously viewed" chip (based on real purchase/view data, not assumed academic progress) — factual, not motivational.
- **Current semester highlighting**: not auto-detected or highlighted by default (the platform doesn't reliably know what semester the student is currently in — asking would add friction Part 1 explicitly rejects). Instead, *if* the student is logged in and has set their semester once in Settings (Section 18), that card gets a subtle `accent.highlighter-subtle` background tint — opt-in personalization, never assumed.
- **Internship & Placement card**: visually separated from the 1–6 grid by spacing and a section label ("Career track"), per Part 1 Section 4 — never numbered "7."

**Possible mistake to avoid**: implying academic progress tracking the platform doesn't actually have. Confidence in the UI must never outrun the accuracy of the underlying data.

---

## 6. Subject Page

**Purpose**: the pain/relevance anchor — where the student's actual stress (a specific hard subject) is met directly.

Evaluating each proposed metadata field against the brand (precision without clutter — Part 2, Principle 4 "content over decoration"):

| Field | Show? | Reasoning |
|---|---|---|
| **Subject Code** | **Yes** | Core to the transcript metaphor (Part 2, Section 0) — shown as a small mono chip, doubles as the searchable identifier power users will start typing directly |
| **Credits** | **No** | Purely academic-administrative info that has zero bearing on which resource to buy — adds clutter without adding decision-relevant signal |
| **Faculty** | **No, not in v1** | GGSIPU faculty varies by college/section within the same university, so a single "Faculty" field would frequently be *wrong* rather than just unnecessary — a worse failure mode than omission. Reserved as a possible filter only once cross-college data justifies it |
| **Resource Count** | **Yes** | Directly answers "is there enough here to help me" before opening — the single highest-value metadata field on this screen |
| **Estimated Study Time** | **No, not in v1** | Attractive in theory, but fabricated/guessed time estimates read as false precision, which actively damages the trust the mono/transcript aesthetic is built to earn. Only add once real usage data can back a number |
| **Difficulty** | **No** | Subjective, unverifiable, and risks feeling patronizing ("this subject is Hard") rather than helpful — the resource *types themselves* (Cheat Sheet vs. full Revision Notes) already communicate depth without a subjective label |
| **Recently Updated** | **Yes, but resource-level not subject-level** | A "Subject updated" timestamp is ambiguous (updated how?); shown instead as a small "Updated recently" badge on the individual Resource Card at the next layer, where it's unambiguous |

**Layout**: Subject Cards in the wider list-leaning grid style (Part 2, Section 7) — this is the first screen where cards get noticeably more horizontal room, because subject names plus a code chip plus a resource count need more breathing room than the pure-numeral Semester cards above them.

**Primary CTA**: tap a Subject card → Resource List. **No secondary CTA** — this layer has no meaningful alternate action.

---

## 7. Resource List Page

**Purpose**: the first screen where actual products appear — must feel evaluative and calm, never like a sales floor.

- **Grid vs. List**: **list-leaning grid** (not a dense catalog grid, not a pure vertical list) — resources need enough width to show type badge, title, and price clearly (Part 2 Resource Card spec), but a subject typically has only 3–8 resources, so a dense multi-column grid would look sparse and unintentional at this scale.
- **Sorting**: minimal — Recommended (default, curated/manual ordering by the team) → Price (low–high) → Recently updated. No "Most popular" sort in v1 without real, defensible download data behind it (same fabricated-signal risk as Section 4's student count).
- **Filters**: only by Resource Type (Cheat Sheet, Revision Notes, PYQ, etc.) as a simple chip row above the grid — no price-range slider, no multi-select faceted filtering. At 3–8 items per subject, heavy filtering UI is solving a problem that doesn't exist yet at this catalog depth, and adding it prematurely contradicts Part 1's "design for scale, but the *layer* structure should absorb growth, not the filter complexity within a layer."
- **Search**: not present at this layer — search is Global (Section 20) and Course-level (Section 3) only; inside a single subject's resource list, the count is small enough that scanning replaces searching.
- **Pagination vs. Infinite scroll**: **pagination**, not infinite scroll. Infinite scroll fits discovery-mode browsing; this page is decision-mode ("which of these 6 do I need"), and a fixed, countable list respects that the student wants to finish evaluating and move on, not keep scrolling. In the rare case a subject has 50+ resources (future bundles, multi-university content), pagination pages are small (12 per page) and clearly numbered.
- **Badges**: Type (always), Premium (Part 2 `state.premium`, for bundles/handbooks), Coming Soon (rare, pre-launch resources), Updated (recency flag from Section 6's decision).
- **Price**: always mono, always bottom-right on the card (Part 2 Section 11) — this consistency is what lets a student price-scan the whole list in one glance without reading every card.
- **Discount**: shown as strikethrough original + `status.success`-colored discounted price — used sparingly and only for real promotional periods (e.g., exam-season bundles), never as a permanent fake-urgency device.
- **Bundle**: a Bundle is simply a Resource object (Part 1, Section 3.2) with `type: Bundle` and multiple linked child resources — visually distinguished only by the Premium badge and a "Includes X items" line, no separate bundle-specific card design needed, preserving the "one Resource Card forever" scalability rule from Part 2.
- **Version / Last Updated**: shown as a small caption line, not a badge — informative but not urgency-inducing.
- **Ratings**: shown only once a resource has a minimum threshold of real reviews (e.g., 5+) — below that threshold, no rating is shown at all rather than displaying an unreliable single-review score.
- **Downloads (count)**: not shown in v1 for the same fabricated/unreliable-signal caution as ratings and student counts — reconsidered only once numbers are large and real enough to be a genuine trust signal rather than a vanity number.
- **Bookmarks**: a simple ghost-style bookmark icon on each card, available only to logged-in students (Section 11 Wishlist) — deliberately lightweight, no confirmation modal, instant toggle with a subtle icon-fill animation (Part 2, Section 15).

---

## 8. Resource Details Page

**Purpose**: the "perfect product page" — the last screen before the transactional part of the journey, so it must complete the trust-building arc, not start it.

**Section order, and why:**

1. **Hero** — Type badge, full title, subject/branch/semester mini-breadcrumb (compact Trail), price (mono, large) — everything needed to confirm "yes, this is exactly the thing I clicked into," stated immediately, no scrolling required to confirm the basics.
2. **Preview** — an embedded, scrollable preview strip (first 1–2 unlocked pages, thumbnail-sized) linking into the full PDF Preview Experience (Section 9) — placed second, immediately after the hero, because "let me actually see it" is the very next thing a skeptical student wants, before reading a word of description.
3. **What's Included** — a short, literal bullet list (page count, sections covered, formats) — description-as-specification, not marketing copy, consistent with Part 2's writing philosophy (be specific, not clever).
4. **Coverage** — which exact topics/chapters the resource maps to, ideally matching the syllabus language the student already knows — this is where subject-code precision (Section 6) pays off directly.
5. **Description** — a short prose paragraph (2–4 sentences max) for context/voice — kept deliberately after the more scannable specification sections, since specification content converts faster than prose for this audience under time pressure.
6. **Version History** — a simple list ("v2.1 — added 2024 PYQs"), reinforcing that content is actively maintained.
7. **Compatibility / Language / University** — small metadata row (PDF, works on any device; English; GGSIPU) — brief, factual, easy to scan, positioned late because it's rarely a blocker, only a confirmation.
8. **FAQ** — resource-specific only (e.g., "Is this the latest syllabus?") — distinct from the landing page's company-level FAQ.
9. **Related Resources** — other resource types for the *same subject* first, then other subjects in the same semester — placed last because by this point either the student has already decided to buy, or they're looking for an alternative, and this section serves that second case gracefully instead of forcing a dead end.

**Sticky Purchase Card**: pinned right rail on desktop, sticky bottom bar on mobile (Part 2, Section 9's Sticky Button spec) — contains price, the Purchase Button (with price fused in, per Part 2), and a one-line reassurance ("Instant download after payment"). It is visible from the moment the page loads and stays visible through scroll, because the decision to buy can be made as early as the Preview section — the sticky card ensures the student never has to scroll back up to act on that decision.

**Exit points**: Purchase (primary), back to Resource List (secondary, via Trail or back nav), or open full Preview (Section 9).

---

## 9. PDF Preview Experience

**Purpose**: the single most trust-critical screen in the product — this is where "can I verify before I pay" gets answered directly (Part 1, Section 5).

- **Page viewer**: clean, centered, single-page-at-a-time view with subtle page-shadow (not a full 3D book effect — restraint per Part 2 Principle 4), swipe/arrow navigation.
- **Locked pages**: unlocked pages (typically the first 20–30%) render fully crisp; locked pages beyond that point are shown as **blurred thumbnails, not hidden entirely** — seeing that more content exists (even blurred) is what proves the resource has real depth, which a simple "upgrade to see more" wall wouldn't communicate.
- **Blur**: a strong, deliberate gaussian blur (not a light frost) — must be unmistakably "locked," never look like a loading state (Part 2, Principle 8: locked/unlocked can never be ambiguous).
- **Watermark**: a small, corner-positioned "Preview — Plan B" mono stamp on unlocked pages only (Part 2 Section 3's dedicated preview stamp, distinct from the main logo) — protects the free-preview content from redistribution without disrupting the reading experience.
- **Zoom**: pinch/scroll zoom supported, resets on page change — needed since revision-note text density is often small.
- **Fullscreen**: available as an explicit toggle (not the default) — default view keeps the Sticky Purchase Card and page-count context visible; fullscreen is opt-in for focused reading of the free pages.
- **Page navigation**: a mono page-counter ("Page 4 of 22 — 6 unlocked") — stated explicitly and numerically, because vague indicators ("Preview") undersell exactly how much value is actually visible for free.
- **Download button**: **disabled entirely during preview**, replaced by the Purchase CTA. There is no "download the preview" action — the preview exists to be *read in place*, not saved, both to protect the unlocked content from being treated as the final product and to keep the single clear next action (purchase) unambiguous.

**Possible mistake to avoid**: making the locked-page blur *too* strong to look broken/error-like, or too light to look intentional — this is the one visual detail worth extra QA time, since a preview that looks "broken" directly undermines the trust the whole screen exists to build.

---

## 10. Authentication

**Purpose**: gate only the moment that truly requires identity — payment and download ownership — never gate curiosity.

- **Should login be forced before browsing? No.** The entire journey through Course → Branch → Semester → Subject → Resource → Preview is available fully logged-out. Forcing an account before letting a stressed, time-pressured student even *see* whether the right resource exists is the single highest-risk drop-off point imaginable for this product's use case — login is asked for at the last responsible moment: entering Checkout.
- **Guest flow**: browsing, previewing, and reaching Checkout are all guest-accessible; the account is created *as part of* the checkout flow (email capture doubles as account creation), not as a separate prior gate.
- **Login**: email + password, or **Google Login** as the primary fast path (most students already have a Google account tied to their college email, making this genuinely faster, not just a checkbox feature) — Google Login is visually primary, email/password secondary.
- **Signup**: identical fields to login's email path — no separate elaborate signup form; a new email is silently treated as account creation, an existing email routes to password entry. This single unified email-first flow (rather than a Login/Signup toggle) removes a decision the student shouldn't have to make while trying to check out fast.
- **OTP**: used only as a password-reset/verification mechanism, not as the primary login method — SMS OTP as primary login is slower and flakier than Google/email for this audience.
- **Forgot Password**: standard email-reset link flow, using the Form System's OTP component (Part 2, Section 10) if a code-based reset is preferred over a link.

**Psychology**: because this appears at Checkout rather than at Landing, it's encountered exactly when the student is already emotionally committed ("I found it, I've previewed it, I'm buying it") — at that moment, one extra field feels like a formality, not a barrier.

---

## 11. Checkout Experience

**Purpose**: the fastest, calmest possible bridge from "I've decided" to "I have it."

- **Single-page checkout**: order summary, email (or login state), payment method, and Pay button all on one screen — no multi-step wizard, since a single resource purchase never needs shipping/scheduling complexity that would justify multiple steps.
- **Minimal fields**: email + payment details only. No phone number requirement, no address (nothing physical ships), no unnecessary account fields.
- **Order Summary**: resource title, type badge, price, and (if applicable) bundle contents listed individually — always visible, never collapsed behind a "view summary" toggle, since trust at this exact moment depends on total clarity about what's being paid for.
- **Coupon**: a single collapsed "Have a coupon?" text-link (not an open field by default) — present for legitimate promotions without visually implying every purchase should have a discount applied (an open, empty coupon field makes every non-discounted purchase feel like it's missing something).
- **GST Invoice**: an optional toggle ("Need a GST invoice?") revealing GSTIN/business-name fields only when checked — most individual students don't need this, so it's hidden by default rather than cluttering the default form.
- **Payment methods**: UPI first (primary, fastest and most familiar for this audience), then cards, then net banking — ordered by actual usage likelihood, not alphabetically or by processor preference.
- **Refund Policy**: a single visible line above the Pay button ("Instant delivery — refunds available if the file doesn't open correctly, see Refund Policy") linking out, not hidden only in the footer — stating it plainly here, at the exact moment of hesitation, does more trust-building work than burying it in legal pages.
- **Purchase confirmation**: happens via the Payment Success screen (Section 12), never a same-page silent redirect — the transition itself needs to be felt, not just technically completed.

---

## 12. Payment Success

**Purpose**: the emotional payoff screen — Part 2's "quietly celebratory, relief" target feeling made literal.

**Order and reasoning:**

1. **Confirmation moment** — the single checkmark draw-on animation (Part 2, Section 14), title copy that names the outcome directly ("You're ready — [Resource name] is downloaded"), never generic ("Payment Successful!" alone undersells what just changed for the student).
2. **Download** — the actual Download button, primary and immediate — the student's dominant intent right now is "give me the file," not "look at a receipt."
3. **Receipt / Invoice** — secondary, smaller — a "View Receipt" link/expand, present but not competing with Download for attention.
4. **View Purchase** — link into Dashboard → Purchases (Section 18), for later reference.
5. **Recommended Resources** — a short, restrained row ("Others in this subject also got...") — placed here deliberately, because post-purchase relief is the moment a student is most receptive to realizing they might need one more thing (e.g., PYQs alongside notes), without it ever feeling like an upsell interruption *before* they got what they paid for.
6. **Continue Browsing** — a plain secondary link back into the journey (defaults to the Subject page they came from).
7. **Share**: a low-emphasis, optional action ("Share with a classmate") — genuinely useful (word-of-mouth is this product's most credible growth channel) but never pushed as a required or gamified step (no "share to unlock" mechanics, which would contradict the calm-senior brand).

---

## 13. Download Experience

**Purpose**: make receiving the file itself feel as considered as buying it — Part 2's "satisfying" instruction taken literally through information, not animation.

- **Download button**: primary, with the file size shown directly inside/beside it ("Download — 4.2 MB") — sets accurate expectation before the tap, avoiding the mild but real anxiety of an unknown-duration download on a possibly slow late-night connection.
- **File size**: always shown (mono).
- **Version**: shown ("v2.1"), links to Version History if the resource has one (consistent with Section 8).
- **Checksum**: **not shown** — a checksum is meaningful only to a technical minority and adds pure clutter for the actual audience; the file-integrity trust job is instead done by the Refund Policy (Section 11) and clean UX, not a hash string no student will manually verify.
- **Purchase Date**: shown as a small caption, useful for the student's own record-keeping.
- **Future updates**: a plain statement of policy ("Free updates if this resource is revised before your exams") shown once, here, not repeated as a nagging banner elsewhere — this is a real differentiator (vs. a static PDF from a Telegram channel) and deserves one clear, confident mention.
- **Re-download**: always available from Dashboard → Purchases (Section 18) indefinitely — stated here so the student never feels pressure to "save it now or lose it."

---

## 14. User Dashboard

**Purpose**: the student's ongoing home base — small, functional, never trying to become a second landing page.

- **Purchased Resources**: primary tab, default view on entry — list of Resource Cards with a persistent Download action (not requiring re-navigation through Preview/Purchase).
- **Downloads**: folded into the Purchased Resources view rather than a separate tab in v1 — a standalone "Downloads" list would just be a filtered duplicate of Purchases, adding a navigation choice without adding real capability.
- **Wishlist**: resources bookmarked from Section 7 — separate tab, since intent-not-yet-purchased is meaningfully different from owned content.
- **Invoices**: separate, simple tab — a plain list of receipts/GST invoices for download, kept apart from Purchases since it serves an administrative need (accounting/reimbursement), not a "get my content" need.
- **Account**: name, email, password/Google-linked status, and the optional "current semester" personalization field referenced in Section 5.
- **Theme**: light/dark toggle, persisted (Part 2, Section 4/12).
- **Support**: a single contact link, consistent with the minimal Footer support model (Part 2, Section 13) — no in-dashboard ticketing system needed at this stage.
- **Delete Account**: present, clearly labeled, requires a confirmation step (typed confirmation or a second explicit "Yes, delete" tap) — never a single-click destructive action, and never hidden or made deliberately hard to find (a product built on trust must make account deletion exactly as easy to find as account creation).

**Structure**: a simple left-tab or top-tab layout, no nested sub-navigation — the Dashboard is intentionally flat, since none of its sections need their own multi-step journeys.

---

## 15. Search Experience

**Purpose**: a fast bypass for students who already know what they're looking for by name or code — never a replacement for the guided journey, always a doorway back into it.

- **Global Search**: accessible from the navbar on every screen (Part 2, Section 12) — searches Subjects and Resources by title, and Subject Codes directly (e.g., typing "DSA-301" jumps straight to that subject).
- **Recent Searches**: shown on focus, before typing — small, capped list (5), clearable.
- **Popular Searches**: shown alongside recent searches when there's no query yet — curated/aggregate, not per-user, giving new users a useful starting point.
- **Subject Codes**: treated as first-class search input, not a hidden power-user trick — this reinforces the transcript metaphor by rewarding students who've internalized the mono-code system (Part 2, Section 5).
- **Keyboard shortcut**: `/` or `Cmd/Ctrl+K` opens search from anywhere — a small but real signal of software craft (matches Linear/Notion/Stripe-caliber products this project is benchmarked against).
- **Search results**: each result shown with its mini-breadcrumb (branch/semester context, per Section 3's navbar spec) so a search result never arrives context-free — clicking a result opens the full Subject or Resource page, never a stripped-down "search result view."
- **Empty state**: per Part 2, Section 18's pattern — "No matches for '[query]'. Try a subject name or code," never a dead end with no next step.

---

## 16. Notifications

**Should they exist? Yes — narrowly.**

Allowed types, each tied to something the student actually did or owns:

| Type | Trigger | Why it's allowed |
|---|---|---|
| Purchase confirmation | Payment completed | Direct transactional receipt |
| Download ready | File available (should be instant, but covers rare delay) | Direct utility |
| Payment failed | Failed transaction | Actionable, time-sensitive |
| Version updated | A resource the student *owns* gets revised | Delivers on the "free updates" promise from Section 13 — this is the one proactive notification type allowed, because it's a direct continuation of something already purchased, not new marketing |
| New semester resources | Content added to a subject/semester the student has *previously purchased from or bookmarked* | Scoped strictly to prior engagement — never sent platform-wide as a blast |

**Explicitly never**: promotional discounts, "come back and browse" nudges, streak/engagement gamification, generic newsletters repackaged as notifications. Part 2's brand personality (calm senior, not a hype machine) is the direct governing constraint here — a notification system that starts behaving like marketing would undo the trust built everywhere else in the product.

---

## 17. Error Handling

| Error | Copy direction | Behavior |
|---|---|---|
| **404** | "This page doesn't exist. Here's where you can go instead." + link back into Course selection | Never a dead page — always offers the one legitimate re-entry point into the journey |
| **500** | "Something went wrong on our end. Try again in a moment." | No technical detail exposed, no blame language |
| **Maintenance** | Per Part 2 Section 18 exactly — reused, not redefined | — |
| **Offline** | Per Part 2 Section 18 exactly | — |
| **Payment Failed** | "Payment didn't go through. No amount was charged. Try again or use a different method." | Explicitly reassures no double-charge risk — the single most anxiety-inducing failure mode in the whole product, so the copy over-clarifies deliberately |
| **PDF Missing** (a purchased file fails to load) | "We couldn't load your file. Your purchase is safe — contact support and we'll resolve it immediately." | Explicitly separates "content platform bug" from "did I lose my purchase" — the copy must resolve that fear in the first sentence |

All error states use the same visual system as Part 2 Section 18 (icon + copy-led, no separate illustration style) — errors are treated as a normal, well-designed part of the product, not an afterthought bolted on separately.

---

## 18. Performance (UX Consequences)

- **Perceived loading**: skeletons everywhere content is predictable in shape (all card grids, per Part 2 Section 19) — spinners reserved only for genuinely unpredictable-duration actions (payment processing).
- **Lazy loading**: card grids load in viewport-sized batches (paired with Section 7's pagination decision, not infinite scroll) — images/thumbnails lazy-load on scroll-into-view.
- **Image strategy**: low-res blurred placeholder → full image crossfade (Part 2, Section 19) for any resource thumbnails; course/branch icons are lightweight vector/monogram-based assets, never large raster images, keeping every non-Preview screen fast regardless of catalog size.
- **PDF strategy**: preview pages render progressively (unlocked pages prioritized to load first, locked/blurred pages loaded lazily since they don't need to be crisp) — the student should never wait on the *locked* content to see the *unlocked* content.
- **Caching**: Course/Branch/Semester structural data (which changes rarely) is cached aggressively client-side; Resource/price data (which can change — new uploads, discounts) is cache-light and revalidated more frequently — this split matters increasingly as the catalog grows toward 50,000 items, since the *shape* of the journey should feel instant even when the *content* underneath is dynamic.

---

## 19. SEO

- **URL hierarchy**: mirrors the IA exactly — `/btech/ai-ds/sem-4/dsa-301` — human-readable, matches the Transcript Trail visually, and directly reinforces the brand's own navigation logic in the address bar itself (a student who's used the product once will recognize the URL pattern even before the page loads).
- **Metadata**: each Subject/Resource page gets a unique title/description built from its own hierarchy data ("DSA Cheat Sheet — GGSIPU AI&DS Sem 4 | Plan B") — auto-generated from the same structured data model (Part 1, Section 3.2), never hand-written per page, which is the only way this scales to 50,000 pages without a content-ops bottleneck.
- **Structured Data**: Product schema (price, availability) on Resource pages, BreadcrumbList schema matching the Transcript Trail exactly, Course schema at the top levels — this is a case where the *visual* Trail and the *technical* breadcrumb markup are literally the same data, reinforcing Part 2's "one Trail system, not duplicated per context" rule even at the SEO layer.
- **OpenGraph**: auto-generated share cards per resource (title, subject, price) using the brand's own type/color tokens (not a generic template) — matters directly for Section 12's Share action.
- **Canonical URLs**: essential given the shared-subject model (Part 1, Section 3.1) — a subject mapped to 3 branches must resolve to one canonical URL (avoiding duplicate-content penalties) while still being reachable from all 3 branch paths.

---

## 20. Analytics

Events tracked, all tied to product decisions, none invasive (no session recording, no keystroke tracking):

| Event | Why it matters |
|---|---|
| Course Selected | Validates course-expansion priority beyond B.Tech |
| Branch Selected | Validates which branch to deepen content in first |
| Semester Selected | Reveals seasonal demand patterns (exam-period spikes per semester) |
| Subject Viewed | Identifies content gaps (high views, low resource count) |
| Preview Opened | Core trust-funnel metric — Preview-to-Purchase ratio is the single most important conversion number in the product |
| Purchase Started (Checkout entered) | Isolates checkout-specific drop-off from upstream browsing drop-off |
| Purchase Completed | Revenue + conversion baseline |
| Download Started | Confirms delivery, not just payment |
| Search Used (+ query) | Directly informs the content roadmap — unmatched searches are a prioritized-content signal |
| Bundle Viewed | Validates whether bundling (Future Features) is worth building further |
| Wishlist Added | Soft-intent signal, useful for future "notify when discounted" features |

Explicitly not tracked: anything identifying beyond what's needed for the account itself, granular scroll/mouse tracking, third-party ad-network pixels — consistent with a product whose entire brand rests on being trustworthy, not extractive.

---

## 21. Future Features (Placeholder Strategy)

None of these require new screens or components — only new data states within the existing structure (Part 2, Section 25's scalability rules applied directly):

- **Bundles**: already covered structurally in Section 7 — a `type: Bundle` Resource with linked children. No new screen needed.
- **Subscriptions**: would surface as a new Pricing Card variant (Part 2, Section 11) at the Resource/Checkout layer — "Unlock all Sem 4 resources" — reuses Checkout and Payment Success unchanged.
- **Faculty Notes**: a new `Resource.type` enum value — inherits Resource Card, Preview, Purchase entirely.
- **University Selector**: Part 1, Section 7 already establishes University as a node above/parallel to Course — the Course Page (Section 3) gains a University switcher in the nav once a second university goes live; the tile-grid pattern itself doesn't change.
- **Community Reviews**: extends the existing Review Card (Part 2, Section 11) from curated/seeded to user-submitted — requires a moderation flow behind the scenes, but the *display* component is already fully specified.
- **AI Search**: extends Global Search (Section 15) — same entry point, same results-with-breadcrumb display, only the matching logic changes from keyword to semantic.
- **Personalized Recommendations**: extends the existing "Related Resources" (Section 8) and "Recommended" (Section 12) modules — same card, same placement, only the selection logic changes from rule-based to personalized.
- **Offline App**: a packaging/delivery change (downloaded resources available without connection), not a UX change — the Download Experience (Section 13) and Dashboard (Section 14) already describe the exact same interface an offline-capable app would present.

The consistent pattern: every future feature is designed to be absorbed by an existing screen and an existing component, never by inventing a new pattern — this is the practical, screen-level proof of Part 1's "10 to 50,000 without redesign" thesis.

---

## 22. Screen Hierarchy

```
Landing
 │
 ├── Browse → Course
 │              └── Branch
 │                    └── Semester
 │                          └── Subject
 │                                └── Resource List
 │                                      └── Resource Details
 │                                            ├── PDF Preview
 │                                            └── Checkout
 │                                                  ├── Authentication (inline, if needed)
 │                                                  └── Payment Success
 │                                                        └── Download Experience
 │
 ├── Search (global, reachable from any screen)
 ├── User Dashboard (Purchases / Wishlist / Invoices / Account / Theme / Support)
 └── Error States (404 / 500 / Maintenance / Offline) — reachable from any failure point
```

---

## 23. Navigation Hierarchy

```
Primary Navigation (persistent, in Navbar — Part 2, Section 12)
 ├── Logo → always returns to Landing
 ├── Transcript Trail → jump to any prior step in the current journey
 ├── Global Search → bypass into any Subject/Resource directly
 └── Profile → Dashboard / Theme / Logout

Contextual Navigation (in-page only)
 ├── Course → Branch → Semester → Subject → Resource List (forward, tile/card taps)
 ├── Resource List ↔ Resource Details (forward/back)
 ├── Resource Details → PDF Preview (modal/full-view, closes back to Details)
 └── Resource Details → Checkout → Payment Success → Download (linear, no backward skip once payment starts)
```

The rule that governs both: **the Trail can always take you back, contextual taps always take you forward — the two systems never overlap in responsibility**, which is what keeps navigation predictable at any catalog size.

---

## 24. User Journey Summary

Landing → Browse → Course → Branch → Semester → Subject → Resource List → Resource Details → Preview → (Authentication, only if not logged in) → Checkout → Payment Success → Download → Dashboard.

At every layer: one clear purpose, one primary action, a visible exit back up the Trail, and zero shortcuts around Preview — the single non-negotiable gate between browsing and paying, because it's the mechanism that makes the entire trust model (and therefore the entire business model) work.

---

## 25. UX Principles (Screen-Level Additions to Part 2's Design Principles)

1. **Login is earned, not demanded** — authentication sits at Checkout, never earlier.
2. **Every number shown must be real** — no fabricated ratings, download counts, or student counts; absence of a metric is preferable to a fake one.
3. **Preview is never skippable and never downloadable** — it is a reading experience, not a content grab.
4. **Every future feature must fit an existing screen** — no feature justifies a new pattern until the existing pattern genuinely cannot hold it.
5. **Errors and payment failures over-explain, everything else stays terse** — verbosity is spent exactly where anxiety is highest, nowhere else.

---

## 26. Future Expansion Strategy

Every screen in this document was designed against one test: *does this still work when Course = 30 active options, Branch = 40, Subject = thousands, Resource = 50,000?* Concretely, that means:

- Grids paginate, never infinite-scroll into unpredictability.
- Metadata fields are added only once real, defensible data exists to back them (ratings, download counts, study-time estimates) — the product would rather show *less* than show *fabricated*.
- New content types extend enums, never require new card designs.
- New universities/courses extend the tile grid and URL hierarchy, never require new screen types.
- Personalization (current semester, recommendations) is additive and opt-in, layered on top of a product that already works perfectly without it.

**End of Part 3.** Screens are fully specified; no wireframes, HTML, CSS, or code were produced, per instruction. Stopping here — no Part 4.
