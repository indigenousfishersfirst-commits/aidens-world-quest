# Phase 10a scaffold on branch phase10a

Status: groundwork. Nothing in this folder is loaded by index.html yet, so the live game is unchanged.
progress.js at the repository root IS replaced on this branch (schema v4) and behaves identically to v3
with today's six stops. All files were unit-tested in Node, not in a browser.

Related documents: PHASE10-PLAN.md (master plan and status map), PHASE10-SUPERCHARGE.md (story,
narration, typography, dysgraphia and juice specs for 10b to 10d), progress.md (build log).

## Files

- `skills.js` - hidden per-skill tracker, Grit meter, Try-It tokens, Flexibility and Comeback stars,
  spaced-review due list, support hints for mini-games. Stores under `live.g.skills10` so it rides
  along in backups. Exposes `window.QuestSkills`. Test: `node test.js`.
- `stops-10a.js` - draft content for Honolulu (Popplio, Water badge, magic-e words) and Paris
  (Fennekin + Klefki, Steel badge, vowel-team words) in the `window.WORLDS` shape, plus word banks
  for Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb (`window.PLAY10A`).
- `test.js` - Node smoke test for skills.js and stops-10a.js.
- `test-progress.js` - Node test for ../progress.js schema v4 (v3 load, padding to 8 worlds, world-7 ids,
  buddy gating, AWQ3 import, legacy AWQ2, over-cap rejection, new profiles, skills10 passthrough).

## Save-schema blockers: RESOLVED in progress.js v4

| Field | Was (v3) | Now (v4) |
|---|---|---|
| `done` (keys) | 0..18 | 0..WORLDS.length*3 (max 36) |
| `badges`, `side`, `dashPlayed`, `dashBest` | length 6 | length WORLDS.length (6..12) |
| `hearts` | length 30 | length `window.POKE_TOTAL` (30..120) |
| `buddy` | -1..29 | -1..POKE_TOTAL-1; indexes 30+ must be in `g.unlocked10` (use `QuestProgress.unlockPoke(i)`) |
| `ledger` / `discoveries` / `labs` ids | `^\d-\d$` | `^\d{1,2}-\d$` |
| `wordRecords` ids | `^\d{1,2}$` | `^\d{1,3}$` |
| record limit per map | 300 | 600 |
| backup codes | AWQ3 | writes AWQ4; imports AWQ3, AWQ4, JSON, legacy AWQ1/AWQ2 |
| new helpers | - | `QuestProgress.limits()` returns `{worlds, keys, pokemon, schema}`; `g.skills10` sanitised via `QuestSkills.sanitize` when loaded |

Still hard-coded elsewhere: index.html top bar shows "/ 18" and "/ 30"; game.js may contain 18 and 30
constants. Replace with `QuestProgress.limits()`.

## Wiring order for the Computer session

1. Load `phase10/skills.js` after progress.js in index.html; call `QuestSkills.attach(state)` right after `QuestProgress.attach`.
2. In data.js, append `window.WORLDS_10A` to `WORLDS` behind a feature flag (for example `window.FLAGS.phase10a`) and set `window.POKE_TOTAL`.
3. Replace hard-coded 18 and 30 in index.html and game.js with `QuestProgress.limits()`.
4. Add Field Lab engines for `honolulu` (chain) and `paris` (pattern) in expedition-data.js; add adventure cards `6-0..7-2`.
5. Build Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb in play.js using `PLAY10A` and `QuestSkills.support(skill)`; call `QuestSkills.record` once per item.
6. Badge case screen reading `QuestSkills.badgeReady(skill)`; evolution cinematic on the first `mastered` result.
7. Assets: 2 backgrounds, 2 NPC portraits, 2 foods, sprites 728, 653, 707, 661, 278, 771, 722, 129, 130 (normal and shiny) from PokeAPI sprites.
8. Narration: 6 stories (short and long), 6 questions, 2 lab missions, game instructions, Magikarp lines. Normalise to -16 LUFS.
9. Bump sw.js cache to v14, add new files to the precache list, run the QA checklist in PHASE10-PLAN.md section 8.
10. Open a pull request phase10a -> main; merge only after QA; republish the Perplexity site only when Andy approves.

Never include NIFI, NIFI-Tech or Cantek.
