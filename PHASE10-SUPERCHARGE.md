# Aiden's World Quest: Supercharge Brief (Phase 10b to 10d)

Prepared November 2, 2026. Extends PHASE10-PLAN.md and the phase10a branch. Four pillars: richer storylines, a real narration cast, deeper stealth learning, and best-practice reading and writing supports for dyslexia and dysgraphia. Everything keeps the standing rules: fun first, wrong answers never cost points, quiet place sounds, music only in action, local-first saves, no uploads.

Where this fits:

| Document | Purpose |
|---|---|
| PHASE10-PLAN.md | Master plan: stops, badges, mini-games, build phases, status map |
| PHASE10-SUPERCHARGE.md (this file) | Story, narration, typography, dysgraphia and juice specs for 10b to 10d |
| phase10/README.md | What is already coded on branch phase10a and how to wire it |
| phase10/skills.js, stops-10a.js | Hidden skills tracker and Honolulu / Paris draft content |
| progress.js (schema v4) | Save validator that now scales to 12 stops and 120 Pokemon |
| progress.md | Running build log, Phase 10 section added |

## 1. Story: from stops to a season-long adventure

Today each stop is a self-contained mystery. The upgrade threads them into one serialised story with cliffhangers, recurring characters and choices that visibly change what happens next.

- Season arc: The Fading Atlas. Pages of the world atlas are fading because people have stopped sharing stories about their places. A mischievous Pokemon trio (Murkrow, Meowth and a shy Ditto) keeps borrowing pieces. Aiden restores pages by collecting stories, foods and friends. The finale reveals Ditto only wanted to be included, and Aiden invites it onto the team: kindness as the ending.
- Episode shape: Cold open (10 second animated panel with narration), Explore, Experiment, Decode, Discover, Cliffhanger card (the next-time teaser already exists; add a 2 panel comic).
- Returning cast: each NPC gets a backstory card, a want and a running joke. Maya is training for a canoe race; Luca cannot find his lost recipe; Hana writes haiku on leaves. Later stops call back to earlier ones (Amelie in Paris trained with Luca in Rome).
- Pokemon personalities: each partner has a want (Popplio wants to sing on a stage, Fennekin is scared of rain) and a small arc that resolves when its badge is earned. Lines are short and spoken.
- Choice points that matter: two per stop. Which path (changes the Field Lab variant and spotter Pokemon), which gift to give (changes the thank-you scene). Choices are pictures plus two or three words. The save already stores `paths` and ledger `events`.
- Postcards between sessions: when Aiden returns after a day away, a postcard from the last NPC is waiting, read aloud, with one picture and one new word spark. The Comeback star (QuestSkills.comeback) attaches here.
- Captain's Log: at the end of a stop Aiden records one sentence about his favourite moment (voice, on device, stored locally, optional, deletable). It plays back on the passport page. Expressive language practice disguised as a travel diary.
- Home stop expansion stays as planned: Barkley Sound, salmon run and herring spawn, Magikarp's Climb, with any Nuu-chah-nulth language or place names added only with community permission and review.

## 2. Narration: a cast, not a single voice

Grandma remains the guide and the safe voice for all instructions. Stories gain character voices and sound design.

- Voice cast: Grandma (instructions, hints, growth lines), one voice per NPC (12), a light storybook narrator for scene text, and Pokemon signature sounds (short synthesised chirps, no words). Generate with TTS; normalise every clip to -16 LUFS like the existing clips.
- Emotion and pacing tags in content: each story card carries `voice`, `emotion` (warm, excited, whisper, sleepy) and pause markers. The build session maps these to TTS style settings.
- Word and syllable timing: generate per-word timestamps for every clip (forced alignment, or word durations from the TTS engine) so read-along highlighting follows the voice exactly at word level and, in Easy Read, at syllable level with the existing syllable colours.
- Three listening modes, chosen with a picture button: Hear first (Grandma reads, then Aiden reads with highlight); Read together (voice and highlight at 0.85 speed, tap any word to pause and hear it slowly); Try it myself (no voice, tap-to-hear only; earns a Brave bonus).
- Echo reading: after a card, Aiden can press record and read the sentence back. The game plays Grandma then Aiden side by side. No scoring, no upload, stored locally and deletable.
- Speed slider 0.7 to 1.2 for all voices, saved per profile. Whisper mode for bedtime: voices softer, music off, place sounds off.
- Sentence replay (back arrow replays the last sentence) and phrase chunking (long sentences visually split into meaning phrases with slightly larger gaps).
- Sound design: one signature stinger per stop (ukulele, accordion, koto, oud, panpipe, gull), short, under the quiet rules. Pokemon moves get satisfying hit sounds in the new mini-games.

## 3. Reading supports for dyslexia (built on published guidance)

The British Dyslexia Association style guide and related guidance recommend 12 to 14 point (16 to 19 px) plain text, inter-letter spacing of about 35 percent of average letter width, inter-word spacing at least 3.5 times the letter spacing, 1.5 line spacing, short lines (about 60 to 70 characters or fewer), left alignment, bold rather than italics or capitals for emphasis, and dark text on a light tinted (not bright white) background. Shorter lines reduce tracking and working-memory load, and spacing matters more than letter form.

| Setting | Default in Easy Read | Range a grown-up can set |
|---|---|---|
| Body text size | 18 px | 16 to 24 px |
| Letter spacing | 0.12 em (about 35 percent of letter width) | 0 to 0.2 em |
| Word spacing | 0.42 em (3.5 x letter spacing) | linked to letter spacing |
| Line height | 1.6 | 1.4 to 2.0 |
| Line length | max 55 characters on story cards | 45 to 70 |
| Alignment | left, ragged right | fixed |
| Emphasis | bold only; no italics, no all caps | fixed |
| Background | cream, pale blue, pale yellow or grey tint | four tints plus dark mode |
| Font | current game font; options Lexend and Atkinson Hyperlegible (open licences); OpenDyslexic if Aiden prefers it | per profile |

- Decodable ladder: every story exists in three text tiers. Tier 1 is highly decodable (short vowels, taught digraphs); Tier 2 mixes in the stop's badge pattern; Tier 3 is the current rich text. QuestSkills picks the tier; Aiden only sees the story. Word Sparks still surface rich vocabulary by voice.
- Line-at-a-time reveal: optional mode where the next line fades in as the previous is read.
- Reading ruler and focus window already exist; add tap-to-dim that greys everything except the current sentence.
- Environmental print: signs, menus and tickets in scenes are tappable and read aloud. Ten taps in a stop earn a Spotter Stamp.
- Morphology sparks: longer words show their parts (un-pack, sky-scraper, re-play) in syllable colours with a one-tap meaning; prefixes and suffixes become collectible Rune pieces.
- Letter confusion support: b, d, p, q and m, w get a consistent colour and a tiny mnemonic picture on first appearance each session. Flip Fortress trains the same pairs.
- Questions stay short, read aloud and answerable by picture tap. Where typing was required, offer letter tiles or voice.

## 4. Writing supports for dysgraphia

- Trace engine (shared by Lava Letters, Sand Scribe, Rune Trace, Letter Gates): start dot, numbered direction arrows, wide tolerance band that narrows slowly with mastery, three sizes from whole-screen to lined, left-hand mode, haptics on touch devices. Accept generous shapes; celebrate start point and direction first, neatness last.
- Motor warm-ups as Pokemon moves: 20 second rounds of big circles, zigzags, waves and loops (pre-writing strokes) before any tracing game, framed as charging the Pokemon's move.
- Voice answers: when the browser supports on-device speech recognition, Aiden can say a one-word answer and the game matches it against the options. Off by default, parent toggle, nothing leaves the device. Fallback is always tiles or picture taps.
- Build-not-write: spelling tasks use draggable letter tiles with letter sounds on touch, and a phonics keyboard that shows digraphs as single keys (sh, ch, th, ai, ee).
- Short bursts and breaks: writing rounds are 60 to 90 seconds with a visible fuel bar; the existing break timer nudges a stretch after writing-heavy play.
- Grown-ups view adds a handwriting page: which letters are traced with correct start and direction, average size, which pairs still flip. No grades.
- Progress keepsakes: every ten clean traces, the game prints a postcard (PDF via print stylesheet) with Aiden's best letters and a Pokemon sticker.

## 5. Stealth learning upgrades across the game

- Double tracking everywhere: every tap in every mini-game records one skill item through `QuestSkills.record`.
- Boss words from Aiden's own misses: the Dragon Sparring Ring draws its words from the tracker's weakest items, dressed as the boss's special moves.
- Comprehension hidden in choices: route signs, menus and NPC requests require reading one short line to pick well; the better pick yields a bonus discovery.
- Vocabulary through loot: every item found has a name and a one-line meaning, read aloud when collected; the Explorer's Lounge shelf shows them.
- Spaced retrieval as Pokemon play: at 1, 3 and 7 days a partner asks to play a word again (10 second round), already supported by `QuestSkills.dueForReview`.
- Fluency through repeated reading: Captain's Log and Echo Reading give natural reasons to reread the same sentence.

## 6. Excitement and juice

- Photo mode: pause any scene, pose the partner Pokemon, add stickers and the stop's stamp, save to the device gallery.
- Weather and time of day per stop, rare events (shooting star in Cusco, whale spout at home, snow squall in Sapporo) that trigger a 20 second bonus hunt.
- Evolution cinematics, badge case clicks, shiny sparkle (QuestSkills.shinyChance), hit-stop and screen shake in action games, confetti on comebacks as well as wins.
- Explorer ranks with titles Aiden can choose (Tide Reader, Trail Scout, Story Keeper), earned by trying, not by scores.
- Co-op hooks for Lily: two-player Sound Surf and Bagel Stack, shared Pumpkin Patch stop in October.
- Seasonal events: Salmon Run, Herring Spawn, Snow Festival, each with a mission chain and a cosmetic.

## 7. Build order and technical notes

| Sub-phase | Scope | Key technical work | Status |
|---|---|---|---|
| 10a Core | Skills tracker, schema v4, Honolulu and Paris, Sound Surf, Key Forge, Lava Letters, Magikarp's Climb | Wire phase10/skills.js; merge WORLDS_10A behind a flag; replace hard-coded 18 and 30 in index.html and game.js with QuestProgress.limits(); sw.js v14 | Scaffold and progress.js v4 on branch phase10a; games, art, audio and wiring still to do |
| 10b Narration and typography | Voice cast, timing JSON, three listening modes, Echo Reading, typography settings panel, decodable tiers for the six original stops | TTS per character, loudness normalisation, per-word timestamps, CSS custom properties for spacing, font files with licences in vendor | Not started |
| 10c Story and world | Season arc, postcards, choice points, four more stops, remaining mini-games, trace engine, motor warm-ups | Content model adds voice and emotion tags; choice outcomes stored in paths; trace engine module shared by four games | Not started |
| 10d Heart and juice | Change-Up cards, Try-It tokens, Brave Button, Captain's Log, photo mode, weather, seasonal events, handwriting page in grown-ups view | MediaRecorder for local voice notes, canvas export for photo mode, PDF postcard via print stylesheet | Not started |

- Size budget: keep total under 70 MB; new audio as Opus or AAC at 48 kbps mono.
- Speech recognition and recording are optional, parent-toggled, on device only, and never cached by the service worker.
- Every new narration line needs a clip; batch generation and normalisation as in Phases 5 to 8.
- QA per sub-phase: full stop playthrough; each mini-game with wrong inputs; save and AWQ4 backup round trip; offline reload after cache bump; layouts at 375, 800 and 1024 px; audio ducking under narration; typography settings persist per profile. State plainly what was not tested on a real tablet.

## 8. Decisions needed from Andy

- Voice cast: one TTS provider for all voices, or keep Grandma's current voice and add others only for NPCs?
- Fonts: ship Lexend and Atkinson Hyperlegible (free licences) and let Aiden pick, or keep one font to reduce size?
- Voice features (Echo Reading, Captain's Log, voice answers): on by default with a parent toggle, or off by default?
- Season villain trio: happy with Murkrow, Meowth and Ditto, or pick from the existing 30 Pokemon to avoid new art?
