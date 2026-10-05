# Penwortham After Dark — V5 Production Pipeline

## Principle

V5 is not a patch of V4. V4 is useful only as a record of interaction failures, pacing problems and technical regressions.

The V5 build follows an asset-first vertical-slice pipeline:

1. Art bible
2. Character master art
3. Animation source frames
4. One finished Tap & Vine environment
5. One complete five-minute interaction loop
6. Mobile playtest
7. Expand only after the vertical slice passes

## Production tools

- **Figma** — visual bible, UI, layout, asset approval board, sprite specs.
- **Image generation** — character/environment master illustrations.
- **Adobe** — cutouts, cleanup, crop/resize, transparent asset preparation.
- **Context7** — current Phaser documentation and API verification.
- **GitHub** — canonical source, assets, tests and releases.
- **Replit** — optional runtime/debugging sandbox, never canonical source.
- **Superpowers methodology** — small tasks, regression-first fixes, no giant speculative rewrites.

## Current verified constraints / blockers

- Figma account is on Starter and is limited to **3 pages**. The file is therefore organized as:
  - 00 — Production Board
  - 01 — Approved Assets
  - 02 — Vertical Slice
- Adobe is connected; generative features use Firefly credits. Use Adobe primarily for cleanup and production preparation after master art exists.
- Context7 is connected and resolves current Phaser 3.90 documentation.
- GitHub writes and Actions verification are working.
- Replit connection works, but there is no existing Penwortham app found there; do not duplicate the canonical GitHub project unnecessarily.

## Visual non-negotiables

- No crude vector/SVG placeholder art in a shipping scene.
- No asset enters the game before it is visually approved.
- Rick and Laura must read as themselves without identity props.
- Rick is not permanently holding a microphone.
- Laura is not permanently holding a guitar.
- Camera is 3/4 top-down and wide enough to read the room.
- Environments require intentional lighting, texture and depth.
- UI never hides important scenery or interactables.
- NPCs need idle life, not static exposition poses.

## Vertical Slice 01 — The Tap

### Premise

Rick realizes his glasses are missing. Will has them because Rick left them at Tap & Vine. Instead of simply returning them, Will turns it into an unnecessary favour involving a missing Kendal Calling wristband.

### Player flow

1. Enter a fully finished Tap & Vine.
2. Talk to Will.
3. Use **Laura — CALL BS** to expose that the wristband is still in the Kendal display.
4. Use **Rick — BULLSHIT** during the attempt to gain access to the display.
5. Recover the wristband with visible pickup feedback.
6. Return to Will and get the glasses back.
7. Denise provides the tactical Sauvignon beat.
8. Dad remains a customer and contributes dry commentary, not a staff role.
9. FATS roast-dispute teaser ends the slice.

### What is not plot

“Behbeh, we need milk too” can survive as an optional shop interaction or environmental gag. It is not a primary quest.

## Acceptance gates

The slice is not allowed to expand until all are true:

- Rick and Laura silhouettes read clearly on an iPhone.
- Tap & Vine visually matches the approved concept-art quality bar.
- Movement feels good before dialogue is layered in.
- Both character abilities have a meaningful use.
- No objective can soft-lock.
- All pickups and interactions have visible feedback.
- The room feels alive while the player is idle.
- The five-minute run is entertaining without explanation.
- Browser/mobile smoke tests pass on the exact build sent to the user.

## Engine guidance

Use Phaser 3.90 patterns and current documentation. Prefer the Scale Manager rather than bespoke browser zoom hacks. Use a smaller Arcade Physics body than the visual sprite and keep animation tied to actual velocity.

