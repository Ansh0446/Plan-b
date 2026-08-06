# PLAN B — Information Architecture & Product Strategy
### Part 1: Foundation (Pre-UI)

---

## 1. Core Design Thesis

Plan B is not a store. It is a **guided academic journey that happens to end in a transaction.**

Every other student-notes site in India (and most digital marketplaces globally) uses the same broken pattern: a search bar + a grid of products + filters. That pattern works for Amazon because Amazon sells commodities the user already knows they want. It fails for education because:

- Students don't know what they need — they know *where they are* (their course, branch, semester).
- A grid of 500 PDFs triggers choice paralysis, not confidence.
- A grid has no *identity*. A journey does.

**The governing principle:** at every screen, the user should be able to answer the question *"where am I in my degree right now?"* — not *"what am I shopping for?"*

This single principle is what makes the product feel premium (Apple-like restraint), navigable at scale (Notion-like hierarchy), fast to use (Linear-like directness), and trustworthy at checkout (Gumroad-like simplicity).

---

## 2. The Navigation Paradigm: "Academic Descent"

Instead of a marketplace taxonomy (Category → Subcategory → Product), Plan B uses what I'll call **Academic Descent** — a hierarchy that mirrors the actual structure of a degree, not the structure of a catalog.

```
Course  →  Branch  →  Semester  →  Subject  →  Resource Type  →  Resource  →  Preview  →  Payment  →  Download
```

Why this ordering matters, structurally:

| Layer | Answers the question | Cognitive function |
|---|---|---|
| Course | "What am I studying?" | Establishes identity |
| Branch | "What's my specialization?" | Narrows peer group |
| Semester | "Where am I right now, in time?" | Anchors urgency |
| Subject | "What am I struggling with?" | Anchors relevance |
| Resource Type | "What kind of help do I need?" | Anchors intent |
| Resource | "Is this the actual thing?" | Anchors trust |
| Preview | "Can I verify before I pay?" | Removes risk |
| Payment | "Am I confident enough to pay?" | Conversion moment |
| Download | "Did I get what I paid for?" | Closes the loop |

No layer is skippable, and no layer is reorderable. This is intentional — see Section 5 (Psychology).

---

## 3. Full Product Hierarchy (Data Model, Not UI)

This is the backbone that must scale from 10 products to 50,000 without redesign. Think of it as a tree, but built so that **branches can share subjects**, and **new top-level nodes can be added without touching existing ones.**

```
Platform
│
├── Course: B.Tech ................................ [ACTIVE]
│   ├── Branch: AI & Data Science .................. [ACTIVE]
│   ├── Branch: AI & Machine Learning .............. [ACTIVE]
│   ├── Branch: Industrial IoT ...................... [ACTIVE]
│   ├── Branch: Computer Science .................... [COMING SOON]
│   ├── Branch: Electronics & Comm ................. [COMING SOON]
│   └── Branch: Mechanical .......................... [COMING SOON]
│
├── Course: BCA ..................................... [COMING SOON]
├── Course: BBA ...................................... [COMING SOON]
├── Course: MBA ...................................... [COMING SOON]
├── Course: MCA ...................................... [COMING SOON]
├── Course: B.Com .................................... [COMING SOON]
├── Course: B.Sc ...................................... [COMING SOON]
├── Course: B.Arch .................................... [COMING SOON]
├── Course: LLB ........................................ [COMING SOON]
├── Course: MBBS ...................................... [COMING SOON]
└── ... (~20 more, all COMING SOON)
```

Inside each **active** branch:

```
Branch: AI & Data Science
│
├── Semester 1 → Subjects → Resource Types → Resources
├── Semester 2 → Subjects → Resource Types → Resources
├── Semester 3 → Subjects → Resource Types → Resources
├── Semester 4 → Subjects → Resource Types → Resources
├── Semester 5 → Subjects → Resource Types → Resources
├── Semester 6 → Subjects → Resource Types → Resources
│
└── Internship & Placement Hub  (parallel node — see Section 4)
```

Inside each **Subject**:

```
Subject: Data Structures & Algorithms (Semester 3)
│
├── Resource Type: Cheat Sheet
│   └── Resource: "DSA Cheat Sheet — GGSIPU Sem 3, 2025 Edition"
├── Resource Type: One Night Revision Notes
│   └── Resource: "DSA One-Night Notes"
├── Resource Type: PYQ Solutions
│   └── Resource: "DSA PYQ Solved (2019–2024)"
```

### 3.1 The Shared-Subject Problem (Critical for Scalability)

You noted AI&DS, AI&ML, and IIoT share most subjects through 3rd year. If each branch stores its own copy of "Data Structures," you'll have triplicate content, triplicate pricing, and a maintenance nightmare at 50,000 products.

**Solution: Subjects are platform-level entities, not branch-level entities.**

```
Subject Master Record: "Data Structures & Algorithms"
   subject_id: DSA-301
   mapped_to: [AI&DS-Sem3, AI&ML-Sem3, IIoT-Sem3]
```

A single Subject record can be **mapped to multiple Branch+Semester combinations.** The resources attached to that subject are created once and inherited everywhere it's mapped. When a 4th branch is added later and it also studies DSA in Sem 3, you don't create new content — you just add a new mapping. This is the single most important architectural decision for your 50,000-product goal, because it means **content creation scales linearly, but content availability scales combinatorially.**

### 3.2 The Resource Object (Universal Schema)

Every single item on the platform — regardless of type — is the same underlying object, just tagged differently. This is what lets the UI never change as inventory grows:

```
Resource {
  id
  title
  type: [Cheat Sheet | Revision Notes | PYQ Solutions | Placement Handbook |
          Internship Guide | DSA Notes | Interview Qs | Resume Guide]
  subject_id (nullable — null for Placement Hub items)
  branch_ids[] (inherited via subject mapping)
  semester (nullable — null for Placement Hub items)
  price
  preview_asset (watermarked sample)
  full_asset (locked until purchase)
  status: [live | coming_soon]
}
```

Because every resource — a cheat sheet or a resume guide — is the *same* object shape, the UI component that renders it ("Resource Card," "Preview Screen," "Purchase Screen") is written once and works for all 50,000 items forever. New resource types can be added to the `type` enum without any redesign.

---

## 4. The Internship & Placement Hub (Parallel Track)

You correctly identified that Semesters 7–8 don't fit the "subject" model — placement prep isn't tied to a specific course subject, it's tied to a *life stage* in the degree.

**Design decision: this is not Semester 7. It is a sibling node to the semester chain, not a continuation of it.**

```
Branch: AI & Data Science
│
├── Semester 1–6 (the "academic" track)
│
└── Internship & Placement (the "career" track)
     ├── Placement Handbook
     ├── DSA Notes
     ├── Interview Questions
     ├── Resume Guides
     ├── Internship Guides
     └── HR Preparation
```

Why it's structured as a hub, not a semester:

- **Psychologically**, students don't think "I'm in semester 7," they think "I'm entering placement season." The label must match their mental model, not the university's official numbering.
- **Structurally**, this hub can be shared across *all* branches and even *all* courses eventually — an MBA student's resume guide content is closer to a B.Tech student's than DSA is to Electronics. Decoupling it from the semester chain means one Placement Hub can eventually serve the entire platform, not just B.Tech.
- **Commercially**, this becomes your highest-intent, highest-price section later (placement prep bundles), so it deserves to be a first-class destination, not buried as "semester 7."

---

## 5. User Psychology — Why Every Step Exists

This is the part most marketplaces skip, and it's why they feel like marketplaces instead of experiences.

**Course selection** — *Identity anchor.* Before anything else, the user needs to see themselves reflected ("B.Tech" clickable, everything else "Coming Soon"). This does two things: it filters out the wrong audience instantly, and it signals exclusivity/focus rather than "we sell everything to everyone," which paradoxically increases trust in the B.Tech content quality.

**Branch selection** — *Peer-group anchor.* Seeing your exact branch name (not a generic "Computer Science" bucket) tells the student "this was made for people exactly like me," not "this was made for engineering students in general." Specificity signals quality.

**Semester selection** — *Temporal urgency anchor.* This is the step that converts browsing into intent. "Semester 4" isn't just a filter — it's an admission ("I'm behind on this material right now"). This is where motivation peaks, and it should be visually treated as a bigger, more deliberate decision than the other steps.

**Subject selection** — *Relevance/pain anchor.* This is where the user's actual stress lives ("I'm failing Thermodynamics"). The UI here should feel like relief is one click away, not like a catalog page.

**Resource type selection** — *Intent anchor.* By this point the student has already committed emotionally to the journey (sunk-cost momentum from 4 prior clicks). This is deliberate — each step increases psychological investment, so by resource selection, browsing away feels like a bigger loss than continuing.

**Preview** — *Risk reversal.* Because payment comes right after, preview must be generous enough to prove quality without giving away the value. This is the trust bridge between four steps of building intent and the actual ask for money.

**Payment** — *Conversion moment.* Should feel like the smallest, most anticlimactic step in the whole flow — because all the emotional and cognitive work was already done in the five steps before it. A payment screen that feels heavy after a light journey will cause drop-off.

**Download** — *Loop closure + re-engagement seed.* This is the moment to reinforce "you made the right call" and softly reintroduce the journey ("Back to Semester 4" / "More for Data Structures") rather than dumping the user back to a homepage.

**Why no shortcuts are allowed:** a search bar or a "browse all" grid would let students skip straight to Resource selection, which collapses steps 1–4. That would save two clicks but destroy the entire psychological arc above — the product would revert to feeling like a file-sharing site instead of a guided companion through their degree. The friction is the product.

---

## 6. Full User Journey Map

```
LANDING
  → sees brand promise ("Your Last-Minute Exam Saviour")
  → single primary CTA: "Browse"

COURSE SELECTION (~30 tiles)
  → B.Tech = active, everything else = "Coming Soon" badge, disabled tap
  → reinforces focus, sets expectation of future expansion

BRANCH SELECTION
  → 3 active branches (AI&DS, AI&ML, IIoT), rest visible-but-disabled
  → "Coming Soon" branches still listed → signals platform is alive & growing,
    without letting the user hit a dead end

SEMESTER SELECTION
  → Semester 1–6 as a clean progression
  → Internship & Placement shown as a distinct 7th tile, visually separated
    (different color/section, not "Semester 7")

SUBJECT SELECTION
  → subjects for the selected branch+semester
  → shared subjects (DSA etc.) resolve to the same underlying content
    regardless of which branch the student came from

RESOURCE SELECTION
  → only resource types that actually exist for this subject are shown
    (a subject with only a Cheat Sheet doesn't show 8 empty categories)

PREVIEW
  → watermarked/partial sample, enough to verify handwriting/formatting/quality
  → price shown here, not earlier — price should appear only once trust is built

PURCHASE
  → single-item checkout, minimal fields, no account-wall friction beyond
    what's needed to deliver the download + receipt

DOWNLOAD
  → immediate delivery
  → soft prompt back into the journey ("more resources for this subject")
```

---

## 7. Why This Architecture Is Future-Proof

**1. New courses require zero redesign.**
Adding "BCA" later means adding a node under `Course`, then populating Branch → Semester → Subject → Resource underneath it. The Course selection screen, Branch screen, Semester screen, etc. are all *templates driven by data*, not hand-built pages. The 30-tile Course screen already anticipates this — it's not "1 course + placeholder," it's "30 courses, 1 active," so the UI never needs to change shape when #2 goes live.

**2. New universities require zero redesign.**
GGSIPU is not hardcoded as *the* university — it's the first `University` entity under `Course → Branch`. When a second university is added, it inserts as a sibling node with its own Branch/Semester/Subject tree (universities can have different subject names for the same course). The navigation pattern doesn't change — only the data underneath it does.

**3. Shared-subject mapping prevents content duplication at scale.**
As shown in 3.1, because Subjects are platform-level entities mapped to multiple Branch+Semester combinations, going from 3 branches to 30 branches doesn't multiply your content-creation workload — it multiplies your content's *reach*. This is the mechanism that makes "10 → 50,000 products" realistic instead of aspirational.

**4. The Resource object is type-agnostic.**
Every product — Cheat Sheet, Resume Guide, Interview Questions — is the same schema (Section 3.2). The Resource Card, Preview screen, and Purchase screen are built once and never need to be rebuilt when new resource types are introduced. Adding a 9th resource type is a data change, not a UI change.

**5. The Internship & Placement Hub is decoupled from the academic ladder.**
Because it's a sibling to the semester chain rather than "Semester 7," it can later be promoted to a platform-wide hub shared across every course and university, without restructuring the semester tree beneath it.

**6. "Coming Soon" states are a first-class UI pattern, not an afterthought.**
Because inactive Courses/Branches are visible from day one, the emotional experience of the product doesn't change the day you flip a new branch or course to "active." Growth becomes invisible to the user experience — which is exactly the property a scaling marketplace needs.

**7. The journey never gets shorter or longer.**
Whether the platform has 10 products or 50,000, the path is always exactly: Course → Branch → Semester → Subject → Resource → Preview → Payment → Download. Scale is absorbed entirely *inside* each layer (more tiles at each step), never by adding or removing layers. This is what guarantees the UI genuinely never needs to be redesigned — only re-populated.

---

## 8. Complete Information Architecture Diagram

```
                                    PLAN B
                                      │
                        ┌─────────────┴─────────────┐
                        │        Course Layer         │  (~30 tiles, 1 active)
                        └─────────────┬─────────────┘
                                      │
                              [ B.Tech — ACTIVE ]
                                      │
                        ┌─────────────┴─────────────┐
                        │        Branch Layer         │  (3 active, rest visible/disabled)
                        └─────────────┬─────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
        AI & Data Science      AI & Machine Learning     Industrial IoT
              │                        │                       │
              └────────────┬───────────┴──────────┬────────────┘
                            │   (shared subjects mapped across branches)
                  ┌─────────┴─────────┐
                  │   Semester Layer   │   Sem 1–6  +  Internship & Placement (parallel)
                  └─────────┬─────────┘
                            │
                  ┌─────────┴─────────┐
                  │   Subject Layer    │   (platform-level, many-to-many mapped)
                  └─────────┬─────────┘
                            │
                  ┌─────────┴─────────┐
                  │ Resource Type Layer│   Cheat Sheet / Revision Notes / PYQ / etc.
                  └─────────┬─────────┘
                            │
                  ┌─────────┴─────────┐
                  │   Resource Item    │   (universal schema, Section 3.2)
                  └─────────┬─────────┘
                            │
                       ┌────┴────┐
                    Preview → Payment → Download
```

**Parallel branch:**

```
                  ┌────────────────────┐
                  │ Internship & Placement Hub │  (sibling to Semester Layer)
                  └────────────────────┘
                            │
        ┌──────────┬─────────────┬──────────────┬─────────────┬─────────────┐
   Placement    DSA Notes    Interview       Resume        Internship      HR
   Handbook                  Questions       Guides         Guides       Preparation
```

---

This is the full pre-UI foundation: navigation model, product hierarchy, data schema, journey psychology, and the scalability logic behind all of it. Ready for Part 2 — whether that's screen-by-screen UX flow, content/pricing strategy, or the visual/interaction design system.
