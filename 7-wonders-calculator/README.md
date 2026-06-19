# 7 Wonders — Score Calculator

A fast, step-by-step end-game score calculator for the original **7 Wonders**
board game (Repos Production, Antoine Bauza). Pick your wonder, tap the cards
you built, and get an accurate breakdown with a score chart.

Built with **React 19 + Vite**. Rules verified against the official rulebook.

## Features

- **All 7 base-game wonders**, both Day (A) and Night (B) sides, with the
  actual board art and correct per-stage victory points, coins, shields and
  science symbols.
- **Rulebook-accurate scoring** for every category:
  - Civilian (blue) flat VP
  - Science (green) — `symbol²` per family **+ 7 per set of three**, including
    the extra symbols from **Babylon** and the **Scientists Guild**
  - Military conflict tokens
  - Commercial (yellow) — Age III scaling cards (Haven, Lighthouse, Chamber of
    Commerce, Arena)
  - Guilds (purple) — each scored by its specific neighbor/own-city rule
  - Coins (1 VP per 3), with wonder-stage coins added automatically
- **Optimal science symbol** auto-suggested for Babylon / Scientists Guild.
- Save / Load / New game (via `localStorage`).
- Keyboard accessible, responsive, mobile-friendly.

## Scoring notes (the rules this enforces)

| Source | Rule |
| --- | --- |
| Science | `n²` per identical-symbol family + 7 per set of 3 different symbols (cumulative) |
| Babylon | Side A stage 2 / Side B stage 3 grant **one science symbol of choice** (chosen at game end) |
| Scientists Guild | Also grants one science symbol of choice (chosen at game end) |
| Coins | `floor(coins / 3)` VP. Ephesos, Colossus B etc. add coins per stage automatically |
| Gizah | Stages are simply worth 3/5/7 (A) and 3/5/5/7 (B) — there is **no** extra per-stage bonus |
| Guilds | Counted from your own and/or both neighbors' cities, per each guild's text |

> The science symbol granted by a wonder stage is folded directly into the
> Science total — you choose which symbol on the **Science Bonus** step, and the
> app pre-selects the choice that maximizes your score.

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # production build → dist/
npm run preview   # preview the build
npm run lint
```

## Art credits

Wonder board art is by **Miguel Coimbra** © Repos Production. Images are
hotlinked from the [7 Wonders Fandom wiki](https://7-wonders.fandom.com/) CDN
for reference use only.
