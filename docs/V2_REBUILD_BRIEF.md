# Penwortham After Dark — V2 Rebuild Brief

## Why V2 exists

The current build proved the basic controls, scene transitions, GitHub deployment and Phaser setup, but it fails the quality bar.

The problems are not "a few bugs". They are structural:

- inconsistent art styles
- main characters and NPCs not sharing one visual language
- placeholder buildings and room geometry
- text labels overlapping the world
- weak movement and animation feel
- first objective not reliably readable/completable
- browser pinch/double-tap zoom getting through
- jokes written like generic game copy instead of actual Rick/Laura/FATS dialogue
- too much of the character identity reduced to "Rick = rap" and "Laura = guitar"
- filler NPCs with no visual identity
- combat and dialogue systems interfering with one another

V2 treats the existing game as a prototype, not a base that must be preserved.

---

# 1. Core pitch

**Penwortham After Dark** is a short, polished, cheeky top-down comedy adventure for mobile.

It should feel like a tiny real indie game, not a web demo.

Target playtime: **8–12 minutes**.

The player can freely swap between Rick and Laura. Their personalities affect dialogue and certain interactions, not just attacks.

The game should feel personal enough that Rick and Laura instantly recognise their world, but coherent enough that somebody else could still play it and understand the joke.

---

# 2. Art direction

## Style

One single visual style across the entire game:

**chunky illustrated top-down RPG**
- expressive
- slightly exaggerated
- adult characters, not chibi
- bold silhouettes
- clean linework
- richer shading than pixel-placeholder art
- readable on a phone
- dark British-comedy atmosphere
- intentionally stylised, never "AI photo cut-out"

Do **not** mix:
- pixel people with flat vector rooms
- realistic sprites with MS Paint NPCs
- generated checkerboard backgrounds
- huge white signboards over scenery
- random emoji as environment art

## Camera

Three-quarter top-down perspective.

Every character asset must be generated/designed for the same camera angle.

Target rendered character height on phone: **95–120 px**.

## Character proportions

Roughly **4 heads tall**:
- recognisable adult anatomy
- slightly oversized heads/faces for readability
- not Funko/chibi
- not realistic enough to look uncanny

## Palette

World palette:
- deep green
- pub amber
- plum
- charcoal
- dirty cream

UI accents:
- acid lime
- hot pink
- warm gold

The UI accent colours should not leak into every building and prop.

## Character asset rules

Every named character gets:
- idle
- walk down
- walk up
- walk left/right
- talk/gesture
- one expressive reaction
- combat/action animation if relevant

All sprites:
- transparent PNG
- no checkerboard baked into image
- no text embedded in artwork
- no pose labels embedded in artwork
- no white background
- no mismatched frame scale

---

# 3. Named cast

## Rick

Visual:
- dark styled hair
- neat beard
- lean/athletic
- casual dark/green clothes
- expressive face
- recognisable without being photoreal

Personality in game:
- quick with nonsense
- overconfident about things he has clearly misplaced
- coffee at ridiculous hours
- capable of bullshitting his way through situations

Combat/action:
- microphone / verbal projectile remains, but is only one part of the character
- coffee causes temporary over-caffeinated movement and rapid-fire mode
- special interaction ability: **BULLSHIT** — Rick can talk certain NPCs into giving information or letting him through

## Laura

Visual:
- long blonde hair
- arm tattoos
- black/dark clothing
- guitar only when contextually relevant, not permanently welded to her body
- confident adult silhouette

Personality in game:
- sharp
- decisive
- dry
- calls nonsense immediately
- can be affectionate and savage in the same sentence

Combat/action:
- guitar shockwave when guitar is equipped
- strong knockback / stun so it visibly does something
- Sauvignon can temporarily widen/strengthen the attack
- special interaction ability: **CALL BULLSHIT** — reveals dodgy information, shortcuts or hidden interaction options

## FATS

Visual:
- slim Asian man
- dark styled hair
- lean build
- tattoos
- black clothes
- smug/pouty expression
- nickname is ironic and must never drive body-shape jokes

Personality:
- petty
- theatrical
- easily affronted
- weirdly intense about small inconveniences
- escalates mundane problems to boss-level emergencies

Boss concept:
**THE SUNDAY ROAST INCIDENT**
- phase 1: sulking / verbal projectiles / roast plates
- phase 2: PAD THAI MODE
- phase 3 optional: full melodrama with ridiculous arena hazards

## Dad

Visual:
- short
- fat
- older
- glasses
- black/dark casual clothing
- warm but dry face

Personality:
- dry humour
- unimpressed by Rick's chaos
- says funny things without performing jokes

Example tone:
> "You lost the car again? That's not a personality trait, son."

## Will

Visual:
- long hair tied back
- glasses
- bar staff
- relaxed/slightly alternative
- recognisable silhouette, no generic beard-man fallback

Personality:
- confidently says things that make no sense
- treats nonsense like accepted pub philosophy

Recurring line:
> "When you're in the Tap, you're a pub."

Rick response:
> "That still isn't a sentence, Will."

## Denise

Visual:
- woman in her 50s
- bigger build
- dark hair
- festival/pub energy
- visually distinct from Laura
- warm, expressive face

Personality:
- warm
- cheeky
- casually savage
- festival-auntie energy

Example:
> "Kendal? Course you're coming. I've already emotionally booked you."

---

# 4. World structure

V2 uses **six polished areas**, not one giant flat prototype map.

Each area is a proper illustrated scene with foreground and background layers.

## Area 1 — Penwortham street / Weird Friends Green

Purpose:
- intro
- movement tutorial
- first objective
- establish tone

Important:
- car and glasses are separate visible interactables
- both have clear interaction indicators
- first quest cannot fail because of collision placement
- no generic NPCs walking around

## Area 2 — Corner Shop

Purpose:
- milk quest
- first Rick/Laura-specific interaction choice

Visual:
- cramped shelves
- fridge glow
- recognisable local-shop mess
- proper interior dressing

## Area 3 — Tap & Vine

Purpose:
- main social hub
- Will
- Denise
- guitar
- Sauvignon
- strongest character dialogue

This should be the best-looking interior in the game.

## Area 4 — Old Man Pub

Purpose:
- Dad
- dry dialogue
- optional side interaction

Visual:
- warm amber
- dark wood
- old pub clutter
- no massive floating "OLD MAN PUB" billboard inside

## Area 5 — 4AM Coffee / Sauna side area

These can be short optional rooms.

4AM Coffee:
- gives Rick caffeine buff
- Laura reacts to him ordering coffee at an idiotic hour

Sauna:
- Laura gets the "did ye aye" interaction
- health restore / calm buff

## Area 6 — Pad Thai Palace / FATS arena

Purpose:
- payoff
- boss fight
- strongest visual effects
- no random filler NPCs

---

# 5. Quest flow

Main quest should be obvious and always completable.

## Beat 1 — Lost car + glasses

Player spawns near Weird Friends Green.

Objective UI:
**FIND THE CAR**
Then:
**NOW FIND THE GLASSES, GENIUS**

The car and glasses are two separate interactions.

Completion line:
> Rick: "Found my car. Found my glasses."
> Laura: "An incredible day for basic object permanence."

## Beat 2 — Milk

Objective:
**BEHBEH, WE NEED MILK TOO**

At shop:
> Laura: "Milk."
> Rick: "This is the most organised we've ever been."
> Laura: "We've bought one item."

## Beat 3 — Tap & Vine

Meet Will and Denise.

Will:
> "When you're in the Tap, you're a pub."

Rick:
> "That still isn't a sentence, Will."

Denise:
> "Kendal again next year?"
> Laura: "Obviously."
> Denise: "Good. I wasn't asking."

Reward:
- Laura gets tactical Sauvignon
- optional guitar equip

## Beat 4 — Prince Andrew 3000

Short absurd encounter.

Tone:
do not over-explain the joke.

Example:
> "Got a beat for you."
> Rick: "Why are you called Prince Andrew 3000?"
> "Move on."

Reward:
Rick gets Dusty Beat mode.

## Beat 5 — FATS crisis

The player hears:
> "No roast."

Then:
> "FATS has taken this badly."

No narrator explaining three paragraphs of the joke.

## Beat 6 — Boss

FATS:
> "First pub: no roast."
> "Second pub: twenty-minute wait."
> "So yes, obviously, we're fighting."

Phase 2:
> "Fine."
> "PAD THAI MODE."

Victory:
> Laura: "Was all that genuinely about a roast?"
> Rick: "Don't."
> FATS: "It was about respect."

Achievement:
**SILLY BULLSHIT BITCH**

---

# 6. Humour rules

The current humour is too "AI quirky". V2 has strict writing rules.

## Do

- short lines
- character-specific voice
- jokes from escalation, pettiness and recognition
- occasional dark/cheeky adult humour
- let a line sit without explaining it
- use real recurring phrases sparingly
- use contrast: ordinary task treated like apocalypse

## Do not

- say "relationship simulator"
- say "relationship nonsense"
- explain why a joke is funny
- make every line an in-joke reference
- turn every noun into a whimsical game term
- rely on emojis
- make everyone sound like the same sarcastic narrator

## Dialogue length rule

Most lines under **12 words**.

No dialogue box should contain an essay.

---

# 7. Gameplay identity

Rick and Laura must feel different even outside combat.

## Rick

World skill:
**BULLSHIT**

Examples:
- charm information out of NPC
- talk past a minor barrier
- improvise a ridiculous explanation

Combat:
- ranged
- faster
- lower knockback
- caffeine increases fire rate and movement

## Laura

World skill:
**CALL BULLSHIT**

Examples:
- expose obviously false NPC claim
- reveal shortcut
- end pointless dialogue immediately
- intimidate a minor obstacle into moving

Combat:
- shorter range
- wider cone/ring
- strong knockback and stun
- Sauvignon increases radius

## Swap design

At least **three moments** where swapping changes what happens.

If swap only changes the attack button, V2 has failed.

---

# 8. Controls and game feel

## Mobile

Left:
- floating analogue joystick
- follows initial thumb position within left zone
- deadzone
- no page scrolling
- no pinch zoom
- no double-tap browser zoom

Right:
- ACT
- ability/combat
- SWAP

## Movement

- acceleration, not instant sliding
- deceleration
- diagonal normalisation
- animation frame tied to actual velocity
- feet remain visually grounded
- no sprite mirroring if it makes anatomy/weapons look wrong
- character hitbox smaller than visual body

## Camera

- close enough to appreciate art
- soft follow
- no jitter
- no browser-scale changes
- fixed game zoom per room
- no accidental user zoom

---

# 9. UI rules

The world should be visible.

## Keep

- small hero health panel
- concise objective
- touch controls

## Remove

- huge area-name boards in the middle of rooms
- giant NPC labels floating across scenery
- overlapping white text
- multiple signs saying the same thing
- giant HUD occupying top quarter of the phone

## Dialogue

- portrait
- speaker name
- one or two short lines at a time
- world freezes cleanly during dialogue
- button controls disabled except ACT/continue

NPC name appears only:
- in dialogue
- or as a tiny interaction prompt when nearby

---

# 10. Technical architecture

Engine: **Phaser 3 stays**.

Phaser is not the problem.

V2 changes how it is used.

## Scene structure

- BootScene
- StreetScene
- ShopScene
- TapScene
- PubScene
- CoffeeSaunaScene
- FatsScene
- UIScene

Do not run the entire game in one massive scene class.

## Character system

Shared Character controller:
- position
- velocity
- direction
- animation state
- interaction state
- ability cooldown
- invulnerability

Separate data definitions for:
- Rick
- Laura
- FATS
- NPCs

## Dialogue system

Dialogue manager owns pause state.

When dialogue opens:
- player velocity = zero
- hostile AI pauses
- projectiles pause/despawn
- interaction lock on
- joystick input ignored

When dialogue closes:
- restore systems cleanly

## Quest system

Quest state machine with explicit states.

Example:
- CAR_NOT_FOUND
- CAR_FOUND
- GLASSES_FOUND
- MILK_FOUND
- WILL_MET
- DENISE_MET
- BEAT_FOUND
- FATS_UNLOCKED
- BOSS_ACTIVE
- COMPLETE

No quest step should depend on vague proximity alone.

Interactions must explicitly call quest transitions.

## Save

LocalStorage:
- current quest state
- room
- items
- settings

During development include a hidden/reset query:
`?reset=1`

---

# 11. Asset strategy

The biggest change.

## Main characters

Create one approved master design for each:
- Rick
- Laura
- FATS
- Dad
- Will
- Denise

Do **not** generate an eight-frame sprite sheet and hope every frame is consistent.

Instead:

1. generate/approve character turnaround
2. generate individual pose frames from that reference
3. remove backgrounds programmatically
4. normalise scale and anchor
5. inspect every frame
6. only then wire it into game

## Environments

Each room gets a full art pass.

Use:
- illustrated background
- collision mask/rectangles
- foreground occluder layer
- interactive prop layer

Avoid building rooms entirely out of Phaser rectangles.

---

# 12. V2 build order

## Milestone A — Clean foundation

- [ ] create new V2 scene architecture
- [ ] disable browser pinch/double-tap zoom
- [ ] implement analogue movement with acceleration/deceleration
- [ ] implement clean camera
- [ ] implement global dialogue pause
- [ ] implement explicit quest state machine
- [ ] add `?reset=1`
- [ ] remove all legacy generic NPC/enemy systems
- [ ] no old placeholder buildings in V2 scenes

**Acceptance:** player can move smoothly around an empty test room, open dialogue, close it, swap characters, reset save, and cannot break browser zoom.

## Milestone B — Character art

- [ ] Rick master design approved
- [ ] Laura master design approved
- [ ] FATS master design approved
- [ ] Dad master design approved
- [ ] Will master design: long hair tied back + glasses
- [ ] Denise master design: bigger woman in her 50s
- [ ] all walk frames consistent
- [ ] no checkerboard backgrounds
- [ ] no embedded pose text
- [ ] animation visually tested on phone

**Acceptance:** six characters can stand beside each other and clearly belong to the same game.

## Milestone C — First playable

- [ ] illustrated street
- [ ] separate car interaction
- [ ] separate glasses interaction
- [ ] corner shop
- [ ] milk quest
- [ ] Tap & Vine
- [ ] Will + Denise
- [ ] hero-specific interactions
- [ ] objective updates always correctly

**Acceptance:** start → milk → Tap & Vine sequence is completely playable without guessing where to stand.

## Milestone D — Personality systems

- [ ] Rick Bullshit ability
- [ ] Laura Call Bullshit ability
- [ ] coffee buff
- [ ] Sauvignon buff
- [ ] guitar interaction
- [ ] Dad hero-specific dialogue
- [ ] Will hero-specific dialogue
- [ ] Denise hero-specific dialogue
- [ ] at least 3 swap-dependent moments

**Acceptance:** swapping characters changes more than the attack animation.

## Milestone E — FATS finale

- [ ] Pad Thai Palace art
- [ ] FATS intro scene
- [ ] boss phase 1
- [ ] boss phase 2 / Pad Thai Mode
- [ ] readable health bar
- [ ] Laura attack visibly damages/knocks back FATS
- [ ] Rick projectiles visibly hit FATS
- [ ] no damage during dialogue
- [ ] victory scene

**Acceptance:** boss can be completed on iPhone without accidental zoom or control conflicts.

## Milestone F — polish

- [ ] remove all temporary labels
- [ ] eliminate overlapping UI
- [ ] sound effects
- [ ] subtle ambient music
- [ ] impact shake/haptics where available
- [ ] loading screen
- [ ] home-screen icon
- [ ] final mobile browser test
- [ ] 8–12 minute full run
- [ ] no softlocks

---

# 13. Hard acceptance criteria

V2 does not ship until all are true:

1. Laura visibly animates in all movement directions.
2. Rick movement looks grounded rather than sliding.
3. No generic MS Paint NPC remains anywhere.
4. Will has long tied-back hair and glasses.
5. Denise reads as a bigger woman in her 50s.
6. Dad reads as short and fat.
7. No checkerboard backgrounds are visible.
8. No giant text overlaps characters or scenery.
9. The first objective can be completed on the first attempt.
10. Safari pinch/double-tap cannot zoom the page.
11. Dialogue freezes every hostile/combat system.
12. Laura's attack has obvious hit feedback and damage.
13. Rick and Laura each have at least one non-combat ability.
14. At least three interactions change based on active character.
15. The world has one coherent art style.
16. The humour reads like Rick/Laura/FATS, not generic assistant copy.
17. The full game can be completed from a clean save in under 12 minutes.
18. No new feature is added until the above foundation is stable.

---

# 14. Scope rule

Do not add more locations, mechanics, NPCs or jokes because they are easy.

First make:
- movement good
- art coherent
- first quest reliable
- dialogue readable
- six main characters right

Quality before quantity.

That is the V2 rule.
