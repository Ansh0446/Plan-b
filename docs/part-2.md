# PLAN B — Design System & Brand Bible
### Part 2: Visual Language (Pre-Screens)

*Foundation: this document assumes the Information Architecture from Part 1 (Course → Branch → Semester → Subject → Resource → Preview → Payment → Download) is final. Every visual decision below exists to serve that journey — not to decorate it.*

---

## 0. The Design Metaphor (Read This First)

Before tokens and rules, one idea has to be named, because everything else derives from it:

**Plan B is not styled like a marketplace. It is styled like a transcript.**

Universities already have a visual language students trust instinctively: mark sheets, roll numbers, subject codes, admit cards, grade ledgers. That world is precise, sequential, slightly formal, and unmistakably *academic* — not corporate, not "edtech," not a Notion template. Plan B borrows the **discipline** of that world (structured codes, ledger lines, exact hierarchy) and combines it with the **restraint** of premium software (Linear, Stripe) and the **warmth** of a genuinely helpful senior (not a cold institution).

The signature visual motif that comes out of this — introduced fully in Section 3 — is the **Transcript Trail**: a persistent, monospaced breadcrumb (`BTECH / AI-DS / SEM-04 / DSA-301`) that behaves like navigation but *reads* like an official record. It is the one element a student will recognize Plan B by, the way a Linear issue ID or a Stripe receipt number is instantly recognizable to their users.

Everything below protects that idea from being diluted.

---

## 1. Core Design Principles

These are non-negotiable. Every future screen must be checkable against this list.

1. **One primary action per screen.**
   A screen with two competing CTAs makes the user do the deciding the product should be doing for them. At every step of the journey there is exactly one obvious next move.

2. **Never show more than one level of the hierarchy at once.**
   Course, Branch, Semester, Subject are shown one layer at a time, never as a combined nested tree. Showing multiple levels simultaneously reintroduces the "marketplace grid" feeling Part 1 was built to avoid.

3. **The Transcript Trail is always visible, never editable inline.**
   The breadcrumb shows the student their position at all times, but changing a step happens by tapping *that* step, not by typing or dropdowns. Position should feel like a place you're standing, not a filter you're setting.

4. **Content over decoration.**
   No illustration, gradient, or pattern is allowed to exist purely for atmosphere. If a visual element doesn't help the student find, trust, or understand a resource, it doesn't ship.

5. **Large, deliberate whitespace.**
   Density signals "content dump." Space signals "curated." Given the competitive set (recycled-PDF Telegram channels, cluttered notes sites), whitespace alone is a trust signal before a single word is read.

6. **Motion communicates state, it never entertains.**
   Every animation must answer "what just changed?" (loading, selected, unlocked, purchased). If an animation's only job is to look nice, cut it.

7. **Typography is the primary hierarchy tool, color is secondary.**
   Size, weight, and spacing establish importance first. Color is reserved for state (success, error, locked) and the single accent — not for decoration or emphasis that type could carry instead.

8. **Every locked/unlocked state must be unmistakable at a glance.**
   Because the entire business model depends on the preview→purchase moment, "can I see this or not" can never require a second look. Lock iconography, price, and preview affordance are held to a stricter consistency standard than any other UI pattern.

9. **The interface never punishes exploration.**
   Going back a step (Semester → Branch) must be as fast and cheap as going forward. Friction is deliberately placed *within* a step (to build trust — Section 5 of Part 1) but never *between* steps.

10. **Every screen must work with zero images.**
    Preview PDFs may fail to render, thumbnails may not exist yet for new uploads. The product must look intentional and complete on type and structure alone — imagery is an enhancement, never a dependency.

11. **Consistency beats novelty at the component level.**
    A Resource Card looks the same whether it's a ₹49 cheat sheet or a ₹499 placement handbook. Novelty is spent once, deliberately (Section 0's signature), not sprinkled across components.

12. **Design for the 30th course before the 3rd is finished.**
    Every list, grid, and state must be designed assuming hundreds of siblings exist, even when only three do today. This is the direct visual-design consequence of Part 1's scalability mandate.

13. **Every empty and disabled state is written, not just grayed out.**
    "Coming Soon" is a sentence, a tone, and a small piece of copy — never just a faded tile. Section 20 defines this fully.

14. **Dark mode is a first-class surface, not an inverted filter.**
    Given the "last-minute, late-night exam" use case, a meaningful share of usage will happen at night. Dark mode gets its own token values (Section 4), not `filter: invert()`.

15. **Nothing ships that couldn't be explained in one sentence to a first-time user.**
    If a pattern needs a tooltip to be understood, it's too clever for this product. Clarity is the brand.

---

## 2. Brand Identity

**Brand Personality**
Plan B is the calm, sharp senior who already took this exam and kept their notes organized. Not a teacher (authority), not a friend (too casual), not a corporation (too cold) — a **trusted senior**. Competent, direct, a little dry-witted under pressure, never condescending.

**Voice**
Plain, confident, economical. Short sentences. Verbs over adjectives. Plan B tells you what to do, not how impressed you should be by it.

- ✅ "Preview before you buy."
- ❌ "Experience our revolutionary preview technology."

**Tone by context**

| Context | Tone |
|---|---|
| Landing | Confident, brief — a promise, not a pitch |
| Browsing | Neutral, structural — get out of the way |
| Preview | Reassuring — "this is really what you'll get" |
| Purchase | Calm, minimal-friction — no upsell pressure |
| Download | Warm, quietly celebratory — "you're ready" |

**Emotion, Trust, Energy**
- *Emotion*: relief-on-arrival. The dominant feeling should be the exhale after finding exactly the right note at 1 a.m.
- *Trust*: built through specificity (exact subject names, exact preview pages) not through badges or testimonials-as-decoration.
- *Energy*: low-key urgency — awake, alert, unhurried panic. Not hype-energy (no countdown timers, no "only 2 left").

**Target feeling, per stage**

| Stage | Student should feel |
|---|---|
| Landing | "This was made by someone who gets it." |
| Browsing | "I'm exactly where I need to be." |
| Preview | "This is legit — I can tell before paying." |
| Purchase | "That was fast, no tricks." |
| Download | "I'm actually going to be okay." |

---

## 3. Logo System

**Philosophy, not graphic.** The logo's job is to work at 16px in a browser tab and to survive a decade without a refresh — it should never rely on a trend (gradients, 3D bevels, mascots).

- **Wordmark**: "Plan B" set in the display typeface (Section 4), tightly tracked, sentence case, with the "B" given a single distinguishing structural detail (e.g., a subtly squared bowl echoing an index-card corner). The wordmark is the primary lockup everywhere — this is a *word* brand, not an *icon* brand, because "Plan B" is the entire value proposition in two words and should always be legible as words.
- **Icon**: derived from the Transcript Trail motif (Section 0) — a simple bracket/slash mark ( `›` or `/` ) treated as a standalone glyph. It represents "the next step" — literally the separator used in the breadcrumb. This makes the icon and the core navigation pattern the same visual idea, so the brand mark and the product experience reinforce each other every single time a student navigates.
- **Monogram**: a single "B" inside a rounded square, used only where the wordmark cannot fit (app icon, favicon, notification badge).
- **Favicon**: monogram only, at full contrast (ink-on-paper or paper-on-ink, no gradient, no accent color — accent color disappears at 16px).
- **App Icon**: monogram on a solid Ink background (Section 4), no drop shadow, no bevel — matches the restraint of Linear/Stripe app icons over illustrative edtech icons.
- **Dark mode**: full wordmark inverts to Paper-on-Ink; icon/monogram inverts identically. No separate "dark logo" design — one mark, two flat color applications.
- **Minimum size**: wordmark never smaller than 20px cap-height; below that, switch to monogram automatically.
- **Spacing rule**: clear space around the mark equal to the cap-height of the "B" on all sides — nothing (nav items, rules, copy) enters that zone.
- **Brand recognition anchor**: the wordmark always appears top-left, never centered, never top-right — consistent with how the Transcript Trail reads left-to-right as a sequence, so the whole header reads as one continuous "path" from logo through breadcrumb.
- **Where it appears**: header (every screen), favicon, app icon, purchase receipts/download footers, loading screen.
- **Where it never appears**: inside cards, inside empty states, as a watermark on preview PDFs (a separate, smaller "Preview — Plan B" stamp is used there instead, see Section 20), or anywhere at an opacity below 100% (no ghosted logos).

---

## 4. Color System

Two philosophies were rejected deliberately: (1) warm-cream-plus-terracotta, and (2) near-black-plus-acid-accent — both are the current default "AI-generated" palette and would make Plan B indistinguishable from a template. Instead, the palette is drawn from the transcript metaphor: **ink, paper, and a single highlighter accent** — literally the three colors present on a student's actual desk while revising.

**Foundation**

| Token | Hex | Use |
|---|---|---|
| `color.paper` | `#FBF9F4` | Light-mode base background — warm paper, not stark white |
| `color.ink` | `#15172E` | Primary text, dark-mode base background, logo |
| `color.ink-soft` | `#4A4D6B` | Secondary text, metadata, captions |
| `color.ink-faint` | `#9497B0` | Placeholder text, disabled labels |

**Surfaces (light mode)**

| Token | Hex | Use |
|---|---|---|
| `surface.base` | `#FBF9F4` | Page background |
| `surface.card` | `#FFFFFF` | Standard card |
| `surface.elevated` | `#FFFFFF` + shadow.md | Modals, dropdowns, popovers |
| `surface.sunken` | `#F2EFE6` | Input fields, code/ID chips, table stripes |
| `border.default` | `#E6E2D6` | Card borders, dividers |
| `border.strong` | `#D2CDBB` | Input borders, focus outlines (paired with accent) |

**Surfaces (dark mode)**

| Token | Hex | Use |
|---|---|---|
| `surface.base.dark` | `#0F1124` | Page background |
| `surface.card.dark` | `#181A34` | Standard card |
| `surface.elevated.dark` | `#20223F` | Modals, dropdowns |
| `surface.sunken.dark` | `#0A0B1A` | Input fields, code chips |
| `border.default.dark` | `#2B2E4E` | Card borders, dividers |

**The accent — "Highlighter"**

| Token | Hex | Use |
|---|---|---|
| `accent.highlighter` | `#E7A928` | Primary CTA, active step in Transcript Trail, price emphasis, selection state |
| `accent.highlighter-hover` | `#D89A1C` | Hover on accent surfaces |
| `accent.highlighter-pressed` | `#C08A16` | Pressed/active on accent surfaces |
| `accent.highlighter-subtle` | `#FBEDCB` (light) / `#3A3011` (dark) | Backgrounds behind selected states, badges |

The accent is used exactly like a highlighter pen is used on a real page: sparingly, on the one thing that matters right now. It never becomes a background color for large areas.

**Buttons**

| Token | Hex | State |
|---|---|---|
| `button.primary.bg` | `accent.highlighter` | Default |
| `button.primary.bg-hover` | `accent.highlighter-hover` | Hover |
| `button.primary.bg-pressed` | `accent.highlighter-pressed` | Pressed |
| `button.primary.text` | `#15172E` | Always ink — accent is warm/light enough that white text fails contrast |
| `button.secondary.border` | `border.strong` | Default |
| `button.secondary.bg-hover` | `surface.sunken` | Hover |
| `button.disabled.bg` | `#E6E2D6` (light) / `#22243F` (dark) | Disabled |
| `button.disabled.text` | `ink-faint` | Disabled |

**Navigation / Search / Sidebar**

| Token | Hex | Use |
|---|---|---|
| `nav.bg` | `surface.base` with 90% opacity + blur | Sticky header background |
| `nav.active-indicator` | `accent.highlighter` | Active nav item underline, active Transcript Trail node |
| `search.bg` | `surface.sunken` | Search field idle |
| `search.bg-focus` | `surface.card` + `border.strong` outline | Search field focused |

**Semantic**

| Token | Hex | Use |
|---|---|---|
| `status.success` | `#2E9E63` | Purchase confirmed, download ready |
| `status.success-subtle` | `#E3F4EA` (light) / `#123222` (dark) | Success banners/badges |
| `status.error` | `#D64545` | Payment failed, form errors — deliberately reads as "red pen" correction ink, on-brand for an academic product |
| `status.error-subtle` | `#FBE7E7` (light) / `#3A1414` (dark) | Error banners |
| `status.warning` | `#C97A1F` | Non-blocking caution (e.g., "preview may differ slightly from final PDF") |
| `status.warning-subtle` | `#FBEFDD` (light) / `#3A2A10` (dark) | Warning banners |
| `status.info` | `#3B5BDB` | Informational callouts, links inside body copy |
| `status.info-subtle` | `#E8ECFB` (light) / `#151C3A` (dark) | Info banners |

**Product-specific states**

| Token | Hex | Use |
|---|---|---|
| `state.locked` | `ink-faint` icon on `surface.sunken` chip | Preview-locked content overlay |
| `state.premium` | `accent.highlighter-subtle` bg + `ink` text | Premium/bundle resource badge |
| `state.coming-soon` | `surface.sunken` bg + `ink-faint` text, no accent | Deliberately *desaturated* — must never borrow the accent color, or it will visually compete with active/purchasable items |
| `state.sold-out` | `ink-faint` bg + `surface.base` text (inverted) | Rare, but reserved (e.g., time-limited bundles) |
| `state.discount` | `status.success` text on `status.success-subtle` bg | Price strikethrough + discount tag — green (not accent gold) so it never gets confused with the primary CTA color |

**Why this system, structurally:** every color above maps to exactly one job. There is no "primary/secondary/tertiary" ambiguity that later gets stretched to cover new needs — new states get a new named token (e.g., `state.bundle` later), never a reused color repurposed for a different meaning. This is what lets the palette survive 50,000 products without color drift.

---

## 5. Typography System

**Type roles**

| Role | Typeface | Reasoning |
|---|---|---|
| Display / Headings | **Fraunces** (serif, used at Light/Medium weight) | A soft, slightly academic serif — evokes a printed transcript/certificate without tipping into "formal invitation." Used with restraint: headings only, never body copy. |
| Body / UI | **Inter** | Neutral, extremely legible at small sizes, the current standard for premium software UI (Linear, Stripe) — chosen deliberately so the *product* recedes and the *content* (subject names, prices) leads. |
| Metadata / Codes / Prices | **JetBrains Mono** (or Berkeley Mono if licensing allows) | This is the signature typographic move: subject codes, semester tags, prices, and the Transcript Trail itself are set in monospace, so they read as *data* — like a roll number or grade — not as marketing copy. This single choice is what makes the "transcript" metaphor felt, not just described. |

**Scale** (base 16px, 1.25 ratio)

| Token | Size | Line height | Use |
|---|---|---|---|
| `type.display.xl` | 48px | 1.1 | Landing hero only |
| `type.display.lg` | 36px | 1.15 | Section headers (Course, Branch screens) |
| `type.display.md` | 28px | 1.2 | Subject/Resource page titles |
| `type.heading.lg` | 22px | 1.3 | Card group headers |
| `type.heading.md` | 18px | 1.35 | Card titles |
| `type.body.lg` | 16px | 1.5 | Primary body copy |
| `type.body.md` | 14px | 1.5 | Secondary copy, descriptions |
| `type.label` | 13px | 1.4 | Buttons, form labels, nav items |
| `type.caption` | 12px | 1.4 | Timestamps, helper text |
| `type.mono.trail` | 13px | 1.2 | Transcript Trail breadcrumb |
| `type.mono.price` | 18px | 1.2 | Prices |
| `type.mono.code` | 12px | 1.3 | Subject codes, badges ("DSA-301", "SEM-04") |

**Weights**: Fraunces at 300 (Light, large sizes) and 500 (Medium, smaller headings) only — never Bold, which would push it toward "poster" rather than "transcript." Inter at 400 (body), 500 (emphasis/labels), 600 (buttons only). JetBrains Mono at 500 uniformly — mono text is never bolded further, weight itself is the emphasis it needs.

**Spacing/readability**: body copy max measure 68 characters (Section 6); generous line-height (1.5) on all body sizes because a meaningful share of reading happens on tired, late-night eyes; letter-spacing +1% on all-caps labels only (never on sentence case) to correct for the optical tightening caps produce at small sizes.

---

## 6. Spacing System

Base unit: **4px**, exposed as a token scale so nothing in the product is ever an arbitrary pixel value.

| Token | Value |
|---|---|
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 24px |
| `space.6` | 32px |
| `space.7` | 48px |
| `space.8` | 64px |
| `space.9` | 96px |

**Application rules**
- **Card internal padding**: `space.5` (24px) standard, `space.4` (16px) on dense mobile cards.
- **Card-to-card gap**: `space.4` desktop, `space.3` mobile — tighter than section spacing so a grid still reads as *one group*.
- **Section spacing**: `space.8` (64px) between major sections (e.g., Trail + filter bar vs. the resource grid below it) — this is the whitespace that signals "curated," per Principle 5.
- **Container max width**: 1200px, with content (text-heavy screens like Preview) capped further at a **68-character max reading width** (~640px) — wide grids are fine, wide paragraphs are not.
- **Vertical rhythm**: every text block's bottom margin equals its own token step-down (e.g., an `type.display.lg` heading is followed by `space.5`, a body paragraph by `space.4`) — rhythm is derived from the type scale, not set independently, so the two systems can never drift apart.
- **Responsive spacing**: scale down one full token step at the `sm` breakpoint (e.g., section spacing 64px → 48px on mobile), never a proportional/fluid shrink — discrete steps keep spacing predictable at any viewport, which matters more than perfect fluidity for a component library meant to last a decade.

---

## 7. Grid System

| Breakpoint | Range | Columns | Container | Card width (grid views) |
|---|---|---|---|---|
| Desktop | ≥1280px | 12 | 1200px | ~272px (4-up) |
| Laptop | 1024–1279px | 12 | fluid, 32px margin | ~232px (4-up) |
| Tablet | 768–1023px | 8 | fluid, 24px margin | ~228px (3-up) |
| Mobile | <768px | 4 | fluid, 16px margin | full-width (1-up), 2-up only for Course tiles |

**Layout logic**
- Course/Branch/Semester screens are **tile grids** (fixed aspect ratio, 4:3) — they represent *choices*, and equal-weight tiles reinforce that every option is a peer.
- Subject/Resource screens are **list-leaning grids** (wider cards, shorter height) — they represent *content to evaluate*, so more horizontal room is given to titles, tags, and price.
- Card height is **fixed per screen type**, never content-dependent — a Subject card with a 3-word name and one with a 6-word name occupy identical space (truncation over reflow), which is what keeps a 50,000-item catalog from ever producing a jagged, unpredictable grid.
- Grid gutter equals `space.4` at all breakpoints ≥768px, `space.3` below — gutter never scales with column count, only with breakpoint.

---

## 8. Iconography

**Philosophy**: outlined, 1.5px stroke, rounded joins, 20px default size, from a single consistent set (Phosphor or Lucide — not mixed sets). No filled icons except for a small, deliberate set of *state* icons (locked padlock, checkmark) where a filled treatment improves at-a-glance recognizability — this exception is intentional and limited to Section 1's Principle 8 (locked/unlocked must never be ambiguous).

- **Rounded, not sharp**: sharp/geometric icon sets read as "developer tool" (fits Linear, doesn't fit a warmer, student-facing brand). Rounded joins soften the interface without adding decoration.
- **No animated icons** as a default — icons change state via color/fill swap only (Section 15 covers the few exceptions, e.g., a spinner).
- **Icons support labels, they don't replace them**, with one exception: universally unambiguous actions (search, close, chevron/back) may appear icon-only. Anything else (download, preview, share) always carries a text label — a 50,000-product catalog used under exam stress is the wrong place to make someone guess what a glyph means.

---

## 9. Button System

| Type | Visual | Behavior |
|---|---|---|
| **Primary** | Solid `accent.highlighter`, ink text | One per screen (Principle 1). Used for the single forward action: Continue, Preview, Buy. |
| **Secondary** | Outline, `border.strong`, transparent bg | Alternate actions that don't move the journey forward (e.g., "Change subject"). |
| **Ghost** | No border, no fill, text only | Low-emphasis actions inside cards/lists (e.g., "View all"). |
| **Danger** | Outline/solid in `status.error` | Destructive-adjacent actions only (rare — e.g., "Cancel order"). |
| **Success** | Solid `status.success` | Used exactly once per flow — the post-purchase confirmation state — never as a general-purpose button color. |
| **Disabled** | `button.disabled.bg/text` | Always paired with a reason on hover/tap (never a silent dead button) |
| **Loading** | Primary button, label replaced by a 12px inline spinner in ink | Button retains its width (no layout shift), label reappears on completion |
| **Icon Button** | 36px square, ghost by default | Used for utility actions in the nav (search, theme toggle) |
| **FAB** | Not used | A floating action button has no job in a linear, one-path journey — including one would imply a shortcut the IA deliberately forbids |
| **Sticky Button** | Primary button, pinned to viewport bottom on mobile | Used only on Preview and Purchase screens, where the forward action must stay reachable while scrolling long content |
| **Purchase Button** | Primary, with mono-set price inline (`Buy — ₹49`) | Price is *inside* the button, not beside it — removing a decision by fusing the cost into the commitment itself, so there's no separate moment where the student has to hunt for the number |

All buttons: 8px corner radius, `space.3`×`space.5` padding (12px vertical / 24px horizontal), `type.label` typography, 150ms ease-out transition on background/border only (never on size — buttons never resize on hover, which would shift layout).

---

## 10. Form System

Given the product's checkout-and-content-access focus, forms are minimal by design — Plan B should almost never ask more than email + payment.

- **Inputs**: `surface.sunken` bg, `border.default` at rest, `border.strong` + 2px accent outline ring on focus. 44px min height (touch target).
- **Dropdowns**: used only where the option set is genuinely unordered (e.g., payment method) — never as a substitute for the tile-based Course/Branch/Semester navigation.
- **Search**: single field, icon-left, no filters attached to it (search finds Subjects/Resources by name only — it does not replace or shortcut the journey; results still open into the full Preview step).
- **Checkbox / Radio**: 20px, accent fill when checked, ink checkmark/dot — never accent-colored checkmark on accent-colored fill (fails contrast).
- **Switch**: used only for account preferences (e.g., email updates), accent when on, `border.strong` track when off.
- **OTP**: 6 individual boxes, mono type, auto-advance focus — used for login only.
- **Password**: standard masked field with a visibility toggle icon button, no strength meter (adds noise without adding trust for this product's threat model).
- **Upload**: not user-facing in v1 (content is platform-curated, not user-submitted) — reserved token only, for a possible future "submit your notes" flow.
- **Validation**: inline, below the field, in `status.error` text with an error icon — never a top-of-form summary list, which forces re-scanning.
- **Focus states**: every interactive element gets a visible 2px accent-colored outline with 2px offset — non-negotiable, ties directly to Accessibility (Section 19).
- **Success**: field border shifts to `status.success`, checkmark icon appears right-aligned inside the field.
- **Disabled**: `ink-faint` text, `surface.sunken` bg, no border — visually recedes rather than looking "broken."

---

## 11. Card System

Cards are the atomic unit of this product — nearly everything the student touches is a card. One base component, styled per context.

**Base card spec**: 12px corner radius, `border.default` 1px, `surface.card` bg, `shadow.sm` at rest. Padding `space.5` (24px desktop) / `space.4` (16px mobile).

| Card | Content hierarchy (top → bottom) | Notes |
|---|---|---|
| **Course Card** | Icon/monogram → Name → status badge (Active / Coming Soon) | Fixed 4:3, identical size whether active or not — inactive cards are *dimmed*, never *smaller*, so future growth never looks like a downgrade |
| **Branch Card** | Name → 1-line description → subject count (mono) | Subject count previews scale ("32 subjects mapped") without opening the branch — small trust signal |
| **Semester Card** | Semester number (large, mono) → subject count | Numeral is the hero of this card — it's the clearest "where am I in time" signal in the whole product |
| **Subject Card** | Name → code (mono chip) → resource-type icons row | Icon row previews *what kinds* of help exist before opening, reducing dead-end taps |
| **Resource Card** | Type badge → Title → price (mono) → preview thumbnail | Price is always bottom-right, always mono, always the same weight — consistency here is what lets a student price-scan a full grid at a glance |
| **Review Card** | Rating → 1–2 line quote → course/branch tag (not name) | Anonymized to branch-level only — protects privacy, keeps focus on the resource not the reviewer |
| **Statistic Card** | Large mono number → label | Used sparingly (e.g., "12,400 downloads this semester") — never fabricated, only shown once real numbers exist |
| **Pricing Card** | Type badge → title → full price → strikethrough (if discounted) → CTA | The only card allowed a Primary button inside it, since it's terminal (nothing opens further) |

**Hover**: `shadow.sm → shadow.md`, 2px translateY(-2px), 150ms ease-out — a lift, not a color change, which keeps the accent color reserved for genuine selection/CTA state (Principle 7).
**Pressed**: translateY(0), shadow returns to `shadow.sm` instantly (no transition) — mimics a physical push-down.
**Disabled (Coming Soon)**: no hover/press response at all, 60% opacity, cursor `not-allowed` — the card must *feel* inert, not just look grayed out.
**Selected** (e.g., a chosen payment method): 2px `accent.highlighter` border replaces `border.default` — border swap, not a background fill, so text contrast is never at risk.

---

## 12. Navbar

**Structure (desktop)**: Logo (left) → Transcript Trail (center-left, appears only past the Course-selection screen) → Search (center-right) → Notifications / Profile (right).

**Structure (mobile)**: Logo + hamburger/profile only in the top bar; Transcript Trail moves to a second, horizontally-scrollable row directly beneath it; Search becomes a full-screen overlay triggered by an icon.

- **Sticky**: always sticky, `nav.bg` at 90% opacity with backdrop blur — content should always feel like it's flowing *under* a fixed record of where the student is, reinforcing the transcript metaphor.
- **Scroll behavior**: navbar never hides on scroll-down (common on content sites) — because the Transcript Trail living in it is a wayfinding tool the student may need mid-scroll, hiding it would violate Principle 9.
- **Search behavior**: opens an inline results dropdown (desktop) or full-screen sheet (mobile) showing Subjects and Resources only, each result labeled with its own mini breadcrumb so a search result never loses journey context.
- **Dark mode**: toggled from the profile menu, persisted per device; navbar surface and Trail both re-theme via the dark-mode token set in Section 4 — no separate dark-mode-only components.
- **Notifications**: reserved for order confirmations and download-ready alerts only — never used for marketing/promotional pushes, to keep the icon meaningful.
- **Profile**: avatar-or-initial circle, opens a simple menu (Purchases, Theme, Log out) — no gamification (badges, streaks) which would contradict the calm-senior brand personality.
- **Breadcrumb integration**: the Transcript Trail *is* the breadcrumb — there is no separate breadcrumb component elsewhere in the product. One instance, always in the nav, is what lets it "survive ten years": it never has to be redesigned per-page because it's a nav-level system, not a page-level one.

---

## 13. Footer

Kept deliberately small and static — a premium product's footer is short because it doesn't need to compensate for a confusing header.

**Columns**: Product (Browse, How it works, Pricing) · Support (Help Center, Contact, Report an issue) · Legal (Terms, Privacy, Refund Policy) · Company (About, Careers — reserved for later).

- **Trust row**: payment method icons + a one-line statement ("Secure checkout, instant download") directly above the copyright line — trust signals belong near the bottom because by the time a student reaches the footer they're evaluating the *company*, not a single resource.
- **Copyright**: single line, mono `type.caption`, dimmed (`ink-faint`) — deliberately the quietest text on the page.
- **Social**: icon row, ghost style, only for platforms actually maintained (no dead links to unused accounts — an anti-pattern that undermines trust more than having no social row at all).
- **Newsletter: not included.**
  *Reasoning*: Plan B's engagement model is need-based, not habit-based — students arrive when they have an exam, not on a content-consumption cadence. A newsletter signup implies an ongoing content relationship the product doesn't have (yet), and an unused/ignored newsletter block is a visible signal of a stale product. Re-engagement instead happens transactionally: post-download prompts back into the journey (Part 1, Section 6) and, later, semester-start notifications via the already-scoped Notifications system — both tied to real academic timing rather than a generic email cadence.
- **Contact**: a single email/support link, no live-chat widget in v1 (adds visual noise disproportionate to actual support volume at this stage).

---

## 14. Animation Language

**Philosophy**: motion is a status report, not a performance. Every animation in this product must be answerable with "this told the student X changed."

| Moment | Motion | Duration | Easing |
|---|---|---|---|
| Card hover | translateY(-2px) + shadow step-up | 150ms | ease-out |
| Button press | scale(0.98) | 80ms | ease-in |
| Page transition | Cross-fade + 8px slide from the direction of travel (forward = slide-in from right, back = from left) | 200ms | ease-in-out |
| Modal open | Scale from 0.96→1 + fade | 180ms | ease-out |
| Modal close | Fade only, no scale | 120ms | ease-in |
| Drawer (mobile filters/menus) | Slide from edge, backdrop fade | 220ms | ease-out |
| Search results appearing | Fade + 4px slide-up, staggered 20ms per row (max 5 rows staggered, rest instant) | 150ms/row | ease-out |
| Success (purchase) | Single checkmark draw-on (SVG stroke animation), no confetti, no bounce | 400ms | ease-in-out |
| Download start | Progress bar fill, deterministic (not indeterminate) whenever file size is known | variable | linear |
| Skeleton → content | Cross-fade only, never a "pop" | 150ms | ease-out |
| Progress (multi-file / bundle downloads) | Stepped bar with mono percentage label | variable | linear |

**What's deliberately absent**: confetti, bounce/spring physics, parallax scrolling, auto-playing decorative loops, page-load "reveal" sequences. These read as entertainment, and Principle 6 rules them out categorically — a calm-senior brand does not need to celebrate louder than the moment (a purchase, a download) deserves.

---

## 15. Micro-interactions

| Element | Hover | Pressed | Focus (keyboard) |
|---|---|---|---|
| Buttons | bg color step (Section 4) | scale(0.98) | 2px accent outline, 2px offset |
| Cards | lift + shadow (Section 11) | shadow returns instantly | 2px accent outline around full card |
| Links | underline fades in | color shifts to `accent.highlighter-pressed` | 2px accent outline |
| Icon buttons | `surface.sunken` bg fades in behind icon | scale(0.95) | 2px accent outline, circular |
| Tiles (Course/Branch/Semester) | lift + border shifts to `border.strong` | scale(0.99) | 2px accent outline, matches tile radius |

**Timing philosophy**: hover states respond in 100–150ms (fast enough to feel connected to the cursor, slow enough not to flicker on fast mouse travel); pressed states are near-instant (80ms) because they're confirming a click already committed to; focus rings have **no transition at all** — they appear/disappear immediately, because a delayed focus ring is a keyboard-accessibility failure, not a stylistic choice.

**Touch vs. desktop**: on touch devices, hover states are skipped entirely (no "sticky hover" after tap) and pressed states are the only feedback — tuned slightly longer (120ms) than the desktop press, since touch feedback needs to be perceptible without a cursor confirming the target first.

---

## 16. Responsive Philosophy

Rather than three fixed layouts, each component has an explicit transformation rule:

- **Navbar**: search icon-only on mobile (opens overlay) → full inline field from tablet up. Transcript Trail drops to its own scrollable row below the logo bar on mobile.
- **Transcript Trail**: horizontally scrollable with a fade-edge mask on mobile (never wraps to multiple lines — wrapping would break its "single record line" identity).
- **Grids**: 4-up → 3-up → 2-up (Course tiles only) → 1-up. Resource/Subject cards go straight to 1-up below tablet (they carry more information per card than tiles do, and don't survive a 2-up squeeze).
- **Cards**: internal padding steps down one token (`space.5`→`space.4`) at mobile; card *content hierarchy never changes* — same elements, same order, at every size.
- **Sticky Purchase button**: appears (bottom-pinned) only below tablet width — on desktop the in-content CTA is always in view, so a sticky duplicate would be redundant chrome.
- **Footer columns**: 4-column → 2-column (tablet) → single accordion-style stack (mobile, columns become collapsible to avoid an extremely long scroll).
- **Modals**: centered floating panel (desktop/tablet) → full-screen sheet (mobile) — never a shrunk-down modal on a small viewport, which produces cramped tap targets.

---

## 17. Accessibility

Designed in from Section 1 (Principle 8, 14), not treated as an audit pass.

- **Keyboard**: full journey (Course → Download) must be completable with Tab/Enter/Arrow keys alone; tile grids support arrow-key navigation between siblings, not just Tab.
- **Contrast**: all text/background pairs meet WCAG AA minimum (4.5:1 body, 3:1 large text); the accent-on-ink button text pairing (Section 4) was specifically chosen to pass this, not just to look right.
- **ARIA philosophy**: semantic HTML first (real `<button>`, `<nav>`, heading levels that match visual hierarchy); ARIA attributes only fill genuine gaps (e.g., labeling the Transcript Trail as `nav aria-label="Your position"`), never used to patch a non-semantic div-soup.
- **Reduced motion**: `prefers-reduced-motion` disables all transform-based motion (lifts, slides, scale) product-wide; fades are kept (they don't trigger vestibular discomfort) at reduced duration.
- **Color blindness**: no state (success/error/locked/premium) is ever communicated by color alone — each pairs with an icon and/or text label (Section 4's semantic tokens are always used *with* their corresponding icon in Section 8).
- **Screen readers**: every card's accessible name includes its context (e.g., "Data Structures & Algorithms, Semester 4, Subject" not just "Data Structures & Algorithms") so list navigation by screen reader users doesn't lose the hierarchy sighted users get from the Trail.
- **Focus indicators**: see Section 15 — always visible, never suppressed with `outline: none` without a replacement, never delayed.

---

## 18. Empty States

Every empty state is copy-led first, illustration-second (per Principle 13 and the writing guidance this system is built on: empty screens are an invitation to act, not a mood board).

| State | Copy direction | Visual |
|---|---|---|
| No Results (search) | "No matches for '[query]'. Try a subject name or code." | Small line-icon (search), no illustration |
| Coming Soon (course/branch) | "[Name] isn't live yet. [Active options] are ready now." — always redirects to what *is* available | Monogram-style icon in `ink-faint`, no illustration |
| No Purchases | "Nothing here yet. Your downloads will show up the moment you buy something." | None — text-only, avoids implying failure |
| Offline | "You're offline. Reconnect to browse or download." | Simple line icon (wifi-off) |
| Error (generic) | "Something didn't load. Refresh, or try again in a moment." — never blames the user, never over-apologizes | Line icon (alert), `status.error` |
| Maintenance | "Plan B is updating — back in a few minutes." with a specific ETA if known | Monogram, ink-faint |
| No Internet (download blocked) | "Can't download without a connection. Your purchase is saved — try again once you're online." — explicitly reassures the purchase isn't lost | Line icon (cloud-off) |

Illustrations, where used at all, are restricted to simple single-color line drawings built from the same icon stroke system (Section 8) — never a separate "illustration style" (no isometric scenes, no mascots), so empty states never look like they were designed by a different team than the rest of the product.

---

## 19. Loading Experience

- **Skeletons**: used for all card grids (Course/Branch/Subject/Resource) — shape-matched to the real card layout (not generic gray boxes), `surface.sunken` base with a slow (1.5s loop) shimmer sweep at low opacity.
- **Progress**: used wherever a duration is knowable (file downloads, payment processing) — deterministic bars, mono percentage label, never a fake/eased progress bar that doesn't reflect real state.
- **Optimistic loading**: applied only to reversible, low-risk actions (e.g., adding to a wishlist, if introduced later) — never applied to payment or download states, where showing false success before confirmation would break trust irreparably.
- **Shimmer**: reserved for skeletons only, never used as a decorative loading spinner elsewhere.
- **Image loading**: blurred low-res placeholder (LQIP) cross-fades to full image — never a blank gray box, never a layout shift (space is reserved via aspect-ratio before load).
- **PDF loading (preview)**: page-shaped skeleton with a centered mono progress percentage — treated with extra care since this is the trust-critical moment of the whole journey (Principle 8).
- **Payment loading**: button enters Loading state (Section 9) immediately on submit, disables the form, and shows a single reassurance line beneath it ("Don't refresh — this takes a few seconds") — because payment is the single highest-anxiety moment in the product, it gets the most explicit, least ambiguous loading treatment of anything in the system.

---

## 20. Design Tokens (Consolidated Reference)

*(Full values defined in their respective sections above; this is the index every future component must draw from — no future screen may introduce a raw hex/px value outside this list.)*

**Typography tokens**: `type.display.xl/lg/md`, `type.heading.lg/md`, `type.body.lg/md`, `type.label`, `type.caption`, `type.mono.trail`, `type.mono.price`, `type.mono.code` — Section 5

**Spacing tokens**: `space.1` through `space.9` (4px–96px) — Section 6

**Color tokens**: `color.paper/ink/ink-soft/ink-faint`, `surface.*` (base/card/elevated/sunken, light + dark), `border.default/strong`, `accent.highlighter` (+hover/pressed/subtle), `button.*`, `nav.*`, `search.*`, `status.success/error/warning/info` (+subtle variants), `state.locked/premium/coming-soon/sold-out/discount` — Section 4

**Elevation tokens**:
| Token | Value |
|---|---|
| `shadow.sm` | `0 1px 2px rgba(21,23,46,0.06)` |
| `shadow.md` | `0 4px 12px rgba(21,23,46,0.10)` |
| `shadow.lg` | `0 12px 32px rgba(21,23,46,0.14)` (modals/elevated surfaces only) |

**Border radius tokens**:
| Token | Value | Use |
|---|---|---|
| `radius.sm` | 6px | Chips, badges, inputs |
| `radius.md` | 8px | Buttons |
| `radius.lg` | 12px | Cards |
| `radius.xl` | 16px | Modals |
| `radius.full` | 999px | Avatars, pills, monogram container |

**Motion tokens**:
| Token | Value |
|---|---|
| `motion.instant` | 80ms, ease-in |
| `motion.fast` | 150ms, ease-out |
| `motion.base` | 200ms, ease-in-out |
| `motion.slow` | 220ms, ease-out (drawers only) |
| `motion.none` | applied globally under `prefers-reduced-motion` |

---

## 21. Brand Bible (Summary)

**Plan B is the trusted senior's transcript** — precise like a mark sheet, warm like advice from someone who's already been through it, restrained like premium software. It never dresses itself up as entertainment, and it never apologizes for being direct. Every visual choice traces back to one job: make a stressed student feel like they've found exactly the right thing, exactly on time.

- **We are**: precise, warm, fast, quietly premium.
- **We are not**: playful, corporate, hyped, cluttered.
- **Say it in one line**: *Ink, paper, and one highlighter — nothing else earns a color.*

---

## 22. Design Language Summary

| Layer | Core choice |
|---|---|
| Metaphor | Transcript, not marketplace |
| Signature element | The Transcript Trail (monospaced breadcrumb) |
| Palette | Paper + Ink + single Highlighter accent |
| Type | Fraunces (display) + Inter (UI) + JetBrains Mono (data/prices/codes) |
| Motion | State-communication only, no entertainment |
| Density | Generous whitespace, one action per screen |
| Icon style | Outlined, rounded, 1.5px stroke |
| Card philosophy | One base component, contextualized per screen, never novel per-instance |

---

## 23. Component Hierarchy

```
Design Tokens (Section 20)
   │
   ├── Primitives
   │     ├── Typography styles
   │     ├── Color/surface tokens
   │     ├── Spacing scale
   │     ├── Radius & shadow scale
   │     └── Motion curves
   │
   ├── Base Components
   │     ├── Button (Primary/Secondary/Ghost/Danger/Success/Icon)
   │     ├── Input / Dropdown / Checkbox / Radio / Switch / OTP
   │     ├── Badge / Chip (status, code, premium, coming-soon)
   │     ├── Card (base shell)
   │     └── Icon (from single icon set)
   │
   ├── Composite Components
   │     ├── Course / Branch / Semester / Subject / Resource Card
   │     ├── Review Card / Statistic Card / Pricing Card
   │     ├── Transcript Trail (breadcrumb/nav)
   │     ├── Search (field + results panel)
   │     ├── Modal / Drawer
   │     └── Skeleton (per-card variants)
   │
   └── Patterns
         ├── Grid layouts (tile grid / list grid, per breakpoint)
         ├── Empty states (per context)
         ├── Loading states (skeleton / progress / shimmer)
         └── Navbar + Footer (fixed, product-wide shells)
```

This hierarchy is strict: a Composite Component may only be built from Base Components and Primitives — never from raw values. A Pattern may only be built from Composite + Base Components. This is what makes "50,000 products, same UI" enforceable in practice, not just in intent.

---

## 24. Design Token Hierarchy

```
Tokens
 ├── Global (Section 20) — the only place raw values (hex, px, ms) are allowed to exist
 ├── Semantic (Section 4's status.*, state.* / Section 5's role-based type tokens)
 │      — map Global tokens to *meaning* (e.g., status.error = #D64545)
 └── Component (e.g., button.primary.bg, card.padding)
        — map Semantic tokens to *specific component properties*
        — a component token may only reference a semantic token, never a global one directly
```

Enforcing this three-layer chain (Global → Semantic → Component) is what allows a future rebrand-lite (e.g., a seasonal accent, a dark-mode refinement) to happen by editing the Semantic layer alone — no component, card, or screen ever needs to be touched individually.

---

## 25. Future Scalability Rules

1. **No new raw color, font, or spacing value may be introduced outside Section 20.** New needs get a new *named* token derived from existing primitives, never a one-off value.
2. **New resource types extend the `type` enum only** — they inherit the Resource Card, Preview screen, and Purchase screen unchanged (Part 1, Section 3.2).
3. **New Course/Branch/University nodes never require new components** — only new data feeding the existing Course Card, Branch Card, tile grid, and "Coming Soon" state.
4. **The accent color is permanently singular.** If a second accent is ever proposed (e.g., for a "premium tier"), it must be justified against Section 4's "one highlighter" rule explicitly — the default answer is to express premium-ness through the existing `state.premium` badge, not a new color.
5. **The Transcript Trail is never removed, renamed, or replaced** for any future course/university — it is the one permanent piece of brand recognition (Section 0) and must survive every expansion unchanged in *behavior*, even as the data inside it grows.
6. **Dark mode tokens are updated in lockstep with light mode** — no component may ship with a light-mode-only or dark-mode-only spec.
7. **Any new empty/disabled/error state must follow Section 18's copy-led pattern** before a single pixel of illustration is considered.
8. **Motion additions must pass the Section 14 test** ("what does this tell the student changed?") before implementation — this is a permanent design-review gate, not a one-time rule.

---

**End of Part 2.** This document, together with Part 1's Information Architecture, is the complete pre-screen foundation for Plan B. Stopping here as instructed — no screens have been designed.
