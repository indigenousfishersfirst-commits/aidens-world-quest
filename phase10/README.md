# Phase 10a scaffold (not wired in yet)

Status: groundwork only. These files are NOT loaded by index.html, so the live game is unchanged.
They were written and unit-tested in Node (skills tracker logic and data shape), not in a browser.

## Files

- `skills.js` - hidden per-skill tracker, Grit meter, Try-It tokens, Flexibility and Comeback stars,
  spaced-review due list, support hints for mini-games. Stores under `live.g.skills10` so it rides
  along in AWQ3 backups. Exposes `window.QuestSkills`.
- `stops-10a.js` - draft content for Honolulu (Popplio, Water badge, magic-e words) and Paris
  (Fennekin + Klefki, Steel badge, vowel-team words) in the `window.WORLDS` shape, plus word banks
  for Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb (`window.PLAY10A`).
- `test.js` - Node smoke test. Run `node test.js` from this folder.

## Save-schema blockers found in progress.js (must change before stops 7 and 8 can be added)

`safeState()` and `safeG()` hard-cap the save, so simply pushing two more entries into WORLDS will
make saves fail validation or be clipped. Required changes (bump to v4 with migration from v3):

| Field | Current cap | Needed for 12 stops |
|---|---|---|
| `done` (keys) | 0..18 | 0..36 |
| `badges`, `side`, `dashPlayed`, `dashBest` | length 6 | length 12 |
| `hearts` | length 30 | 30 + new Pokemon count (about 60) |
| `buddy` | -1..29 with squad/egg index rules | extend index rules for new partners and spotters |
| `ledger` / `discoveries` / `labs` ids | regex `^\d-\d$` (single digit world) | `^\d{1,2}-\d$` |
| `wordRecords` ids | `^\d{1,2}$` | fine up to 99 words; raise if the word bank passes 99 |
| `safeG` record limit | 300 keys per map | raise to 600 |

Also add `skills10` to the `safeG` pass-through and call `QuestSkills.sanitize` there.

## Wiring order for the Computer session

1. Schema v4 in progress.js with a v3 -> v4 migration (pad arrays, keep AWQ3 import working, emit AWQ4).
2. Load `phase10/skills.js` after progress.js; call `QuestSkills.attach(state)` where `QuestProgress.attach` is called.
3. Merge `WORLDS_10A` into `WORLDS` behind a feature flag until Honolulu and Paris have art, labs, cards and audio.
4. Add Field Lab engines for `honolulu` (chain) and `paris` (pattern) in expedition-data.js; add adventure cards `6-0..7-2`.
5. Build the four mini-games in play.js using `PLAY10A` and `QuestSkills.support(skill)`; call `QuestSkills.record` once per item.
6. Badge case screen reading `QuestSkills.badgeReady(skill)`; evolution cinematic on first `mastered` result.
7. Assets: 2 backgrounds, 2 NPC portraits, 2 foods, sprites 728, 653, 707, 661, 278, 771, 722, 129, 130 (normal and shiny) from PokeAPI sprites.
8. Narration: 6 stories (short and long), 6 questions, 2 lab missions, game instructions, Magikarp lines. Normalise to -16 LUFS.
9. Bump sw.js cache to v14, add new files to the precache list, run the QA checklist in PHASE10-PLAN.md.

Never include NIFI, NIFI-Tech or Cantek.
