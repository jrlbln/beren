# Nihongo Learning App — Implementation Plan

## Project Overview

A mobile-responsive Next.js 14 progressive web app for learning Japanese hiragana, katakana, and kanji. The app has three tabs: **Learn**, **Quiz**, and **Sheet**. It uses Firebase Firestore for mnemonic and progress data, KanjiVG for stroke path data, the Jisho API for kanji lookups, and the Web Speech API for audio pronunciation.

---

## Tech Stack

| Layer       | Tool                               | Purpose                               |
| ----------- | ---------------------------------- | ------------------------------------- |
| Framework   | Next.js 14 (App Router)            | Routing, SSR, PWA                     |
| Styling     | Tailwind CSS                       | Utility-first responsive styles       |
| Animation   | Framer Motion                      | Card flip (3D), panel transitions     |
| Database    | Firebase Firestore                 | Mnemonics, user progress, quiz scores |
| Storage     | Firebase Storage                   | Mnemonic illustration images          |
| Stroke data | KanjiVG (bundled JSON)             | SVG stroke paths in correct order     |
| Kanji data  | Jisho API                          | Kanji readings, meanings (Phase 4)    |
| Audio       | Web Speech API (`speechSynthesis`) | Pronunciation, `lang: ja-JP`          |
| PWA         | next-pwa                           | Offline support, installable          |
| Hosting     | Firebase Hosting                   | Deployment                            |

---

## Data Architecture

### Local static data (bundled at build time)

```
/data/kana.json       — all hiragana + katakana rows, romaji, dakuten, handakuten
/data/kanjivg.json    — SVG stroke paths keyed by character (sourced from KanjiVG)
```

### Firebase Firestore schema

```
/mnemonics/{char}
  hira_text:      string     — e.g. "Ah! There is a snake!"
  hira_sub:       string     — e.g. "あ looks like a person shocked by a snake"
  hira_image_url: string     — Firebase Storage URL
  kata_text:      string
  kata_sub:       string
  kata_image_url: string

/progress/{userId}/{row}
  learned:        string[]   — characters marked as learned
  quiz_scores:    { date, score, mode }[]
```

---

## Card Design Spec

### Front face

- Top half: hiragana character (large) + "hiragana" label
- Center divider: romaji (large, bold) + speaker icon button (triggers Web Speech API)
- Bottom half: katakana character (large) + "katakana" label
- Tap card anywhere → 3D flip to back

### Back face

- Divided into two halves mirroring the front: top = hiragana side, bottom = katakana side
- Each half shows either **mnemonic mode** or **stroke mode** simultaneously (toggled together)
- Center divider: toggle icon button — pencil icon = mnemonic mode active, clock/brush icon = stroke mode active

#### Mnemonic mode (default back state)

- Each half: mnemonic illustration image + mnemonic text + sub-text
- Speaker icon on each half for pronunciation

#### Stroke mode (toggled via center icon)

- Each half: dark canvas (SVG, black background) with animated stroke paths
- Strokes draw in sequence using `stroke-dashoffset` animation
- Stroke number indicators below canvas
- Replay button per half
- Stroke paths sourced from KanjiVG data

---

## App Structure

```
/app
  layout.tsx               — root layout, tab bar
  /learn
    page.tsx               — row selector grid
    /[row]
      page.tsx             — card view for selected row
  /quiz
    page.tsx               — row + mode selector
    /[row]
      page.tsx             — quiz session
  /sheet
    page.tsx               — full kana reference table

/components
  Card/
    CardScene.tsx          — perspective wrapper, flip state
    CardFront.tsx          — hiragana + romaji + katakana
    CardBack.tsx           — mnemonic/stroke back with toggle
    StrokeCanvas.tsx       — animated SVG stroke renderer
    MnemonicPanel.tsx      — illustration + text + audio
  Quiz/
    QuizCard.tsx           — question display
    OptionGrid.tsx         — 4-choice answer grid
    ResultBadge.tsx        — correct/wrong feedback
  Sheet/
    KanaTable.tsx          — hiragana or katakana grid
    KanaCell.tsx           — single character cell with tap-to-hear
  UI/
    TabBar.tsx
    RowSelector.tsx
    SoundButton.tsx

/data
  kana.json
  kanjivg.json

/lib
  firebase.ts              — Firestore + Auth init
  speech.ts                — Web Speech API wrapper
  kana.ts                  — kana data helpers
  strokes.ts               — KanjiVG path lookup helpers
```

---

## Phase 1 — Foundation & Sheet Tab

**Goal:** Project scaffolding, data layer, and a fully working Sheet tab.

### Tasks

1. Init Next.js 14 project with App Router + Tailwind CSS
2. Install and configure Firebase (Firestore + Auth + Storage)
3. Create `/data/kana.json` with full hiragana and katakana tables:
   - Base rows: a-o, ka-ko, sa-so, ta-to, na-no, ha-ho, ma-mo, ya-yu-yo, ra-ro, wa-wo-n
   - Dakuten rows: ga, za, da, ba
   - Handakuten row: pa
4. Build `KanaTable` and `KanaCell` components
5. Wire Web Speech API (`lib/speech.ts`) — tap a cell plays pronunciation
6. Build Sheet tab (`/app/sheet/page.tsx`) — hiragana table, katakana table, dakuten/handakuten section
7. Build `TabBar` component with Learn / Quiz / Sheet navigation
8. Configure `next-pwa` for offline support

**Deliverable:** App runs locally, Sheet tab shows complete kana tables, tapping a character speaks it.

---

## Phase 2 — Learn Tab & Flip Card

**Goal:** Full Learn tab with row selector and the interactive flip card.

### Tasks

1. Bundle KanjiVG stroke data into `/data/kanjivg.json` — extract hiragana and katakana paths
2. Seed mnemonic data into Firestore (`/mnemonics/{char}`) for the a-row as a pilot
3. Build `CardScene` (perspective + flip logic with Framer Motion)
4. Build `CardFront` — hiragana / romaji+speaker / katakana layout
5. Build `StrokeCanvas` — SVG renderer with `stroke-dashoffset` animation, sequential delay per stroke, replay button, stroke number indicators
6. Build `MnemonicPanel` — fetches mnemonic from Firestore by character, displays image + text + speaker
7. Build `CardBack` — two halves (hira top / kata bottom), center toggle button switches both halves between mnemonic and stroke mode simultaneously
8. Build `RowSelector` — grid of pill buttons for each row
9. Build Learn tab (`/app/learn/page.tsx` → `/app/learn/[row]/page.tsx`) — row selector → card deck with swipe/next/previous navigation
10. Firebase anonymous auth — create session on first visit

**Deliverable:** Full Learn tab working end-to-end. Card flips, mnemonic loads from Firestore, stroke animation plays for both hira and kata sides.

---

## Phase 3 — Quiz Tab

**Goal:** Quiz tab with two modes and correct/wrong feedback.

### Tasks

1. Build quiz engine (`lib/quiz.ts`):
   - Accept selected rows + mode
   - Generate question pool from `kana.json`
   - Generate 4 options (1 correct + 3 distractors from same row set, weighted to avoid repeats)
2. Build `QuizCard` — displays prompt (romaji or character depending on mode)
3. Build `OptionGrid` — 4-button answer grid
4. Build `ResultBadge` — green correct / red wrong flash on selected option
5. Mode A: show romaji → user picks the correct hiragana or katakana character
6. Mode B: show character (toggle hira/kata) → user picks the correct romaji
7. Build Quiz tab (`/app/quiz/page.tsx` → `/app/quiz/[row]/page.tsx`) — row multi-selector + mode picker → quiz session
8. Write quiz scores to Firestore (`/progress/{userId}/{row}`)

**Deliverable:** Both quiz modes fully working, results saved to Firestore.

---

## Phase 4 — Kanji + Progress + Polish

**Goal:** Kanji section, progress tracking UI, and production polish.

### Tasks

1. Integrate Jisho API for kanji data — JLPT N5 kanji (80 characters) as first milestone
2. Extend `kana.json` (or create `kanji.json`) with N5 kanji + readings + meanings
3. Extend card components to support kanji mode — same card design pattern as kana
4. Add kanji rows to RowSelector in Learn and Quiz tabs
5. Build progress dashboard — learned count per row, quiz score history
6. Upgrade Firebase Auth from anonymous to Google Sign-In for cross-device progress
7. Add Kanji section to Sheet tab
8. Performance audit: lazy load card images, prefetch next card in deck
9. PWA final config: app icons, splash screens, manifest
10. Deploy to Vercel

**Deliverable:** Full app production-ready and deployed.

---

## Key Decisions & Notes

- **Mnemonic illustrations:** Author your own and store in Firebase Storage. These are personal and more effective for memory than generic sources. Seed them per row as you progress through phases.
- **KanjiVG license:** CC BY-SA 3.0 — attribution required. Add a small credits note in the app footer.
- **Stroke animation timing:** 650ms per stroke, 200ms delay between strokes. Adjust per character complexity.
- **Offline:** Base kana data and KanjiVG paths are bundled locally so the app works fully offline. Mnemonics and progress require connectivity.
- **Kanji scope:** Start with JLPT N5 (80 kanji). Expand to N4 (170) in a future phase.
