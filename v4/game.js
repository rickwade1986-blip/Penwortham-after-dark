(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('game');
  const ctx = canvas.getContext('2d', { alpha: false });

  const ui = {
    objective: $('objective').querySelector('strong'),
    heroName: $('heroName'),
    hearts: $('hearts'),
    prompt: $('prompt'),
    swap: $('swap'),
    act: $('act'),
    ability: $('ability'),
    dialogue: $('dialogue'),
    portrait: $('portrait'),
    speaker: $('speaker'),
    line: $('line'),
    toast: $('toast'),
    startCard: $('startCard'),
    start: $('start'),
    stickBase: $('stickBase'),
    stickKnob: $('stickKnob'),
    moveGhost: $('moveGhost')
  };

  const Q = Object.freeze({
    CAR: 'CAR',
    MILK: 'MILK',
    WILL: 'WILL',
    WRISTBAND: 'WRISTBAND',
    GLASSES: 'GLASSES',
    DENISE: 'DENISE',
    TURKISH: 'TURKISH',
    FATS: 'FATS',
    DONE: 'DONE'
  });

  const objectiveText = {
    [Q.CAR]: "Find Rick's car",
    [Q.MILK]: 'Behbeh, we need milk too',
    [Q.WILL]: "Go to Tap & Vine. Will's got the glasses.",
    [Q.WRISTBAND]: "Find Will's Kendal wristband",
    [Q.GLASSES]: 'Take the wristband back to Will',
    [Q.DENISE]: 'Now find Denise. She knows everything.',
    [Q.TURKISH]: 'Get some food at The Turkish',
    [Q.FATS]: 'FATS has had a roast incident. Find him.',
    [Q.DONE]: 'Survived. Go somewhere stupidly expensive for a water.'
  };

  const HERO = {
    rick: { name: 'RICK', color: '#b6ff3b', ability: 'BULLSHIT', speed: 232 },
    laura: { name: 'LAURA', color: '#ff4fa3', ability: 'CALL BS', speed: 224 }
  };

  const SCENES = {
    town: { w: 1600, h: 900, bg: 'town', spawn: { x: 820, y: 646 } },
    tap: { w: 1200, h: 700, bg: 'tap', spawn: { x: 600, y: 618 } },
    shop: { w: 1200, h: 700, bg: 'shop', spawn: { x: 600, y: 610 } },
    turkish: { w: 1200, h: 700, bg: 'turkish', spawn: { x: 600, y: 615 } },
    kendal: { w: 1400, h: 800, bg: 'kendal', spawn: { x: 700, y: 688 } }
  };

  const SAVE = 'penwortham-after-dark-v4';
  const params = new URLSearchParams(location.search);

  function initialState() {
    return {
      hero: 'rick',
      hp: 6,
      maxHp: 6,
      quest: Q.CAR,
      scene: 'town',
      positions: {},
      flags: {
        started: false,
        car: false,
        glasses: false,
        milk: false,
        wristband: false,
        will: false,
        denise: false,
        dad: false,
        turkish: false,
        kendal: false,
        wine: false,
        beat: false,
        bossDefeated: false
      }
    };
  }

  function loadState() {
    if (params.get('reset') === '1') localStorage.removeItem(SAVE);
    let s = initialState();
    try {
      const old = JSON.parse(localStorage.getItem(SAVE) || 'null');
      if (old) s = {
        ...s,
        ...old,
        flags: { ...s.flags, ...(old.flags || {}) },
        positions: { ...(old.positions || {}) }
      };
    } catch {}
    const testScene = params.get('scene');
    const testQuest = params.get('quest');
    if (SCENES[testScene]) s.scene = testScene;
    if (Object.values(Q).includes(testQuest)) s.quest = testQuest;
    if (params.get('test') === '1') s.flags.started = true;
    return s;
  }

  const state = loadState();
  let room = SCENES[state.scene] || SCENES.town;
  let player = { x: 0, y: 0, vx: 0, vy: 0, dirX: 0, dirY: 1, walk: 0, step: 0, flash: 0 };
  let hotspots = [];
  let npcs = [];
  let particles = [];
  let shots = [];
  let enemyShots = [];
  let dialogue = null;
  let toastTimer = 0;
  let last = performance.now();
  let running = false;
  let viewScale = 1;
  let cameraY = 0;
  let dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
  const input = { x: 0, y: 0 };
  const keys = new Set();

  const boss = {
    active: false,
    hp: 32,
    maxHp: 32,
    x: 805,
    y: 410,
    vx: 0,
    vy: 0,
    vulnerable: 'rick',
    swapTimer: 4.2,
    fireTimer: 1.1,
    flash: 0,
    started: false
  };

  const images = {};
  const artEntries = [
    ['town', PAD_ART.town], ['tap', PAD_ART.tap], ['shop', PAD_ART.shop], ['turkish', PAD_ART.turkish], ['kendal', PAD_ART.kendal],
    ['rick0', PAD_ART.hero.rick[0]], ['rick1', PAD_ART.hero.rick[1]],
    ['laura0', PAD_ART.hero.laura[0]], ['laura1', PAD_ART.hero.laura[1]],
    ['will', PAD_ART.npc.will], ['denise', PAD_ART.npc.denise], ['dad', PAD_ART.npc.dad], ['fats', PAD_ART.npc.fats]
  ];

  function loadImages() {
    return Promise.all(artEntries.map(([key, src]) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { images[key] = img; resolve(); };
      img.onerror = () => reject(new Error('Failed to load art: ' + key));
      img.src = src;
    })));
  }

  function save() {
    state.scene = currentSceneName();
    state.positions[state.scene] = { x: player.x, y: player.y };
    try { localStorage.setItem(SAVE, JSON.stringify(state)); } catch {}
    refreshUI();
    document.body.dataset.quest = state.quest;
    document.body.dataset.scene = state.scene;
  }

  function advanceQuest(nextQuest, flagName) {
    if (flagName) state.flags[flagName] = true;
    state.quest = nextQuest;
    buildScene();
    save();
  }

  function currentSceneName() {
    return Object.keys(SCENES).find((k) => SCENES[k] === room) || state.scene || 'town';
  }

  function refreshUI() {
    const h = HERO[state.hero];
    ui.objective.textContent = objectiveText[state.quest] || 'Cause avoidable chaos';
    ui.heroName.textContent = h.name;
    ui.heroName.style.color = h.color;
    ui.hearts.textContent = '♥'.repeat(Math.max(0, state.hp)) + '♡'.repeat(Math.max(0, state.maxHp - state.hp));
    if (boss.active) {
      ui.ability.textContent = state.hero === 'rick' ? 'BULLSHIT' : 'CALL BS';
    } else {
      ui.ability.textContent = h.ability;
    }
  }

  function showToast(text, ms = 1050) {
    ui.toast.textContent = text;
    ui.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.add('hidden'), ms);
  }

  function renderPortrait(name) {
    ui.portrait.innerHTML = '';
    const c = document.createElement('canvas');
    c.width = 164; c.height = 164;
    const cctx = c.getContext('2d');
    cctx.fillStyle = '#201b27';
    cctx.fillRect(0, 0, 164, 164);
    let img = null;
    const n = String(name || '').toUpperCase();
    if (n.includes('RICK')) img = images.rick0;
    else if (n.includes('LAURA')) img = images.laura0;
    else if (n === 'WILL') img = images.will;
    else if (n === 'DENISE') img = images.denise;
    else if (n === 'DAD') img = images.dad;
    else if (n.includes('FATS')) img = images.fats;
    if (img) {
      const ratio = img.width / img.height;
      const h = 190;
      const w = h * ratio;
      cctx.drawImage(img, 82 - w / 2, -4, w, h);
    } else {
      cctx.fillStyle = '#ff4fa3';
      cctx.font = '900 38px Impact, sans-serif';
      cctx.textAlign = 'center';
      cctx.textBaseline = 'middle';
      cctx.fillText(n.split(/\s+/).map(x => x[0]).join('').slice(0,3), 82, 82);
    }
    ui.portrait.appendChild(c);
  }

  function say(speaker, lines, done) {
    dialogue = { speaker, lines: Array.isArray(lines) ? lines : [String(lines)], index: 0, done: done || null };
    player.vx = player.vy = 0;
    input.x = input.y = 0;
    resetStick();
    ui.speaker.textContent = speaker;
    ui.speaker.style.color = speaker === 'LAURA' ? '#ff4fa3' : speaker === 'RICK' ? '#b6ff3b' : '#f2c766';
    ui.line.textContent = dialogue.lines[0] || '';
    renderPortrait(speaker);
    ui.dialogue.classList.remove('hidden');
    ui.prompt.classList.add('hidden');
  }

  function advanceDialogue() {
    if (!dialogue) return false;
    dialogue.index += 1;
    if (dialogue.index >= dialogue.lines.length) {
      const done = dialogue.done;
      dialogue = null;
      ui.dialogue.classList.add('hidden');
      if (done) done();
      refreshUI();
    } else {
      ui.line.textContent = dialogue.lines[dialogue.index];
    }
    return true;
  }

  function setScene(name, spawn) {
    if (!SCENES[name]) return;
    state.positions[currentSceneName()] = { x: player.x, y: player.y };
    state.scene = name;
    room = SCENES[name];
    const saved = state.positions[name];
    const p = spawn || saved || room.spawn;
    player.x = p.x;
    player.y = p.y;
    player.vx = player.vy = 0;
    player.walk = 0;
    player.step = 0;
    cameraY = 0;
    buildScene();
    save();
    showToast(name === 'tap' ? 'TAP & VINE' : name === 'shop' ? 'BEHBEH SHOP' : name === 'turkish' ? 'THE TURKISH' : name === 'kendal' ? 'KENDAL CALLING' : 'PENWORTHAM');
  }

  function addHotspot(o) {
    hotspots.push(o);
    document.body.dataset.hotspots = hotspots.map(h => h.id).join(',');
    return o;
  }
  function addNpc(o) { npcs.push(o); return o; }

  const lines = {
    car: {
      rick: ['Found it.', 'Laura: The large blue car? Extraordinary detective work.'],
      laura: ['There. Your car.', 'Rick: I knew where it was.', 'Laura: Course you did.']
    },
    glasses: {
      rick: ['And the glasses.', 'Laura: Object permanence. Massive day for you.'],
      laura: ['They were basically next to the car.', 'Rick: I was doing a sweep.', 'Laura: Die.']
    },
    milk: {
      rick: ['Milk acquired.', 'Laura: We bought one thing. Do not get emotional.'],
      laura: ['Milk.', 'Rick: Look at us. Functioning adults.', 'Laura: Do not push it.']
    },
    will: {
      rick: ["When you're in the Tap, you're a pub.", "Rick: That's not language, Will.", "Will: It's hospitality."],
      laura: ["When you're in the Tap, you're a pub.", "Laura: Will, what the fuck does that mean?", "Will: You understood it. That's enough."]
    },
    denise: {
      rick: ['Kendal again next year then?', "Rick: Apparently I've already agreed.", "Denise: You have now."],
      laura: ['Kendal again next year then?', 'Laura: Obviously.', "Denise: Good. Wasn't asking."]
    },
    dad: {
      rick: ['Dad: You found the car then?', 'Rick: Eventually.', 'Dad: Christ. He can be taught.'],
      laura: ['Dad: You keeping him then?', "Laura: Trial period keeps getting extended.", 'Dad: Brave.']
    },
    turkish: {
      rick: ['Rick: We ordered two mains.', "Laura: There is enough lamb here to destabilise a small economy.", 'Rick: Leftovers?', 'Laura: Behave.'],
      laura: ["Laura: I said we'd order sensibly.", 'Rick: We have.', 'Laura: There are six plates of bread alone.']
    }
  };

  function buildScene() {
    hotspots = [];
    npcs = [];
    const scene = currentSceneName();

    if (scene === 'town') {
      addHotspot({
        id:'car', x:255, y:690, r:115, label:'RICK’S CAR',
        act:() => {
          if (state.quest === Q.CAR) {
            advanceQuest(Q.MILK, 'car');
            say(state.hero.toUpperCase(), lines.car[state.hero], () => burst(255,690,'#b6ff3b',18));
          } else say('RICK', ['Yep. Still the car. Miraculous.']);
        }
      });

      addHotspot({
        id:'coffee', x:270, y:475, r:95, label:'4AM COFFEE',
        act:() => say(state.hero.toUpperCase(), state.hero === 'rick'
          ? ['Coffee?', 'Laura: It is nearly 4am.', 'Rick: So that is a yes.', 'Laura: Your heart is filing a grievance.']
          : ['No.', 'Rick: I did not ask anything yet.', 'Laura: You were going to say coffee.', 'Rick: I feel profiled.']),
        ability:() => say(state.hero.toUpperCase(), state.hero === 'rick'
          ? ['I could absolutely drink another one.', 'Laura: You are one coffee away from seeing through time.']
          : ['Bullshit.', 'Rick: What?', 'Laura: The entire concept of another coffee.'])
      });

      addHotspot({
        id:'shopDoor', x:1390, y:815, r:105, label:'BEHBEH SHOP',
        act:() => {
          if (state.quest === Q.CAR) {
            say('LAURA', ['Car first.', 'Then we can begin the rest of your administrative collapse.']);
          } else setScene('shop');
        }
      });

      addHotspot({
        id:'tapDoor', x:1320, y:474, r:105, label:'TAP & VINE',
        act:() => {
          if ([Q.CAR,Q.MILK].includes(state.quest)) {
            say('LAURA', ['Milk first.', 'Rick: The Tap is basically hydration.', 'Laura: It really is not.']);
          } else setScene('tap');
        }
      });

      addHotspot({
        id:'turkishDoor', x:820, y:818, r:110, label:'THE TURKISH',
        act:() => {
          if ([Q.TURKISH,Q.FATS,Q.DONE].includes(state.quest)) setScene('turkish');
          else say('RICK', ['Food?', 'Laura: We are pretending to have a plan.', 'Rick: Food is a plan.']);
        }
      });

      addHotspot({
        id:'kendalPoster', x:610, y:330, r:75, label:'KENDAL CALLING',
        act:() => setScene('kendal')
      });

      addHotspot({
        id:'bench', x:970, y:455, r:110, label:'SUSPICIOUS BENCH',
        act:() => say(state.hero.toUpperCase(), state.hero === 'rick'
          ? ['Sit down for a minute?', 'Laura: Every time you say “a minute” we lose forty-five minutes.']
          : ['I am not sitting there.', 'Rick: Why?', 'Laura: Look at it. It knows what it did.']),
        ability:() => say(state.hero.toUpperCase(), state.hero === 'rick'
          ? ['I could sell this bench a consultancy package.']
          : ['Bullshit bench.'])
      });

      if ([Q.FATS,Q.DONE].includes(state.quest)) {
        addNpc({ id:'fats', key:'fats', x:805, y:445, w:93, h:136, label:'FATS' });
        addHotspot({
          id:'fats', x:805, y:445, r:105, label:'FATS',
          act:() => {
            if (state.quest === Q.DONE) {
              say('FATS', ['I am still saying twenty minutes was unacceptable.']);
              return;
            }
            if (!boss.active) {
              say('FATS', [
                'First pub: no roast.',
                'Second pub: twenty-minute wait.',
                'At that point society had failed.',
                'Laura: You could have eaten literally anything else.',
                "FATS: Don't start talking sense now. We're too far in."
              ], startBoss);
            }
          }
        });
      }
    }

    if (scene === 'shop') {
      addHotspot({
        id:'milk', x:240, y:430, r:120, label:'MILK FRIDGE',
        act:() => {
          if (state.quest === Q.MILK) {
            advanceQuest(Q.WILL, 'milk');
            say(state.hero.toUpperCase(), lines.milk[state.hero], () => burst(240,430,'#7fc7d7',18));
          } else say('LAURA', ['We already have milk.', 'Rick: Worth checking.', 'Laura: No.']);
        }
      });
      addHotspot({
        id:'sign', x:960, y:480, r:110, label:'TARGETED SIGN',
        act:() => say('LAURA', ['“No, you do not need another coffee.”', 'Rick: That feels legally targeted.', 'Laura: It is.'])
      });
      addHotspot({ id:'exit', x:600, y:630, r:110, label:'OUT', act:() => setScene('town',{x:1390,y:760}) });
    }

    if (scene === 'tap') {
      addNpc({ id:'will', key:'will', x:300, y:510, w:90, h:132, label:'WILL' });
      addNpc({ id:'denise', key:'denise', x:600, y:520, w:94, h:138, label:'DENISE' });
      addNpc({ id:'dad', key:'dad', x:935, y:505, w:98, h:142, label:'DAD' });

      addHotspot({
        id:'will', x:300, y:510, r:110, label:'WILL',
        act:() => {
          if (state.quest === Q.WILL) {
            say('WILL', [
              "Yeah, I've got your glasses.",
              "Rick: Why have you got my glasses?",
              "Will: More importantly, why did you leave them in the Tap?",
              "Laura: He's got you there.",
              "Will: Tell you what — find my Kendal wristband and we're even.",
              "Rick: This feels like extortion.",
              "Will: Hospitality."
            ], () => {
              state.flags.will = true;
              advanceQuest(Q.WRISTBAND);
            });
            return;
          }

          if (state.quest === Q.GLASSES && state.flags.wristband) {
            say('WILL', [
              "That's the one.",
              "Here. Your glasses.",
              "Laura: An unnecessarily complicated transaction for an object he already owned.",
              "Rick: I feel like I won.",
              "Laura: You absolutely didn't."
            ], () => {
              state.flags.glasses = true;
              advanceQuest(Q.DENISE);
              showToast('GLASSES RECOVERED. SOMEHOW.', 1250);
            });
            return;
          }

          if (state.quest === Q.WRISTBAND) {
            say('WILL', [
              "Wristband first.",
              "It's on the Kendal display.",
              "Rick: You mean the display about a festival none of us can fully remember?",
              "Will: That's the one."
            ]);
            return;
          }

          say('WILL', lines.will[state.hero]);
        },
        ability:() => say(state.hero.toUpperCase(), state.hero === 'rick'
          ? ['This is literally blackmail.', 'Will: It is a loyalty scheme.']
          : ['Bullshit.', 'Will: Counterpoint: pub.'])
      });

      addHotspot({
        id:'denise', x:600, y:520, r:105, label:'DENISE',
        act:() => {
          if ([Q.WILL,Q.WRISTBAND,Q.GLASSES].includes(state.quest)) {
            say('DENISE', state.quest === Q.WILL
              ? ['Speak to Will first.', 'He has been waiting to turn your own glasses into a side quest.']
              : ['Sort Will out first.', 'Honestly, this is between you two now.']);
            return;
          }
          say('DENISE', lines.denise[state.hero], () => {
            state.flags.denise = true;
            state.flags.wine = true;
            if (state.quest === Q.DENISE) state.quest = Q.TURKISH;
            save();
            showToast('TACTICAL SAUVIGNON ACQUIRED', 1200);
          });
        }
      });

      addHotspot({
        id:'dad', x:935, y:505, r:105, label:'DAD',
        act:() => say('DAD', lines.dad[state.hero], () => {
          state.flags.dad = true;
          save();
        })
      });

      addHotspot({
        id:'kendalWall', x:1000, y:130, r:90, label:'KENDAL WALL',
        act:() => setScene('kendal')
      });

      addHotspot({ id:'exit', x:600, y:650, r:110, label:'OUT', act:() => setScene('town',{x:1320,y:535}) });
    }

    if (scene === 'turkish') {
      addHotspot({
        id:'food', x:600, y:505, r:150, label:'THE FEAST',
        act:() => {
          if (!state.flags.turkish) {
            say(state.hero.toUpperCase(), lines.turkish[state.hero], () => {
              state.flags.turkish = true;
              state.quest = Q.FATS;
              save();
              say('PHONE — FATS', [
                'First pub. No roast.',
                'Second pub. Twenty-minute wait.',
                'Rick: Oh no.',
                'Laura: He is going to make this everyone else’s problem.'
              ]);
            });
          } else {
            say('LAURA', ['I physically cannot eat another thing.', 'Rick: Give it seven minutes.']);
          }
        }
      });
      addHotspot({ id:'exit', x:600, y:650, r:110, label:'OUT', act:() => setScene('town',{x:820,y:760}) });
    }

    if (scene === 'kendal') {
      addHotspot({
        id:'flashback', x:700, y:480, r:165, label: state.quest === Q.WRISTBAND ? "WILL'S WRISTBAND" : 'QUESTIONABLE FESTIVAL MEMORY',
        act:() => {
          if (state.quest === Q.WRISTBAND && !state.flags.wristband) {
            say('LAURA', [
              "There. Will's wristband.",
              "Rick: Why is it here?",
              "Laura: Because apparently the entire town operates like a Zelda dungeon now.",
              "Rick: Fair."
            ], () => {
              state.flags.wristband = true;
              state.flags.kendal = true;
              state.flags.beat = true;
              advanceQuest(Q.GLASSES);
              showToast("WILL'S WRISTBAND ACQUIRED", 1400);
              burst(700,480,'#ff4fa3',30);
            });
            return;
          }

          if (!state.flags.kendal) {
            say('LAURA', [
              'I remember this bit.',
              'Rick: You absolutely do not.',
              'Laura: Correct. That is why it was good.'
            ], () => {
              state.flags.kendal = true;
              state.flags.beat = true;
              save();
              showToast('DUSTY FESTIVAL MEMORY UNLOCKED', 1250);
              burst(700,480,'#ff4fa3',28);
            });
          } else {
            say('RICK', ['Parking remains spiritually unresolved.']);
          }
        }
      });
      addHotspot({ id:'exit', x:700, y:718, r:125, label:'BACK', act:() => setScene(state.flags.will ? 'tap' : 'town') });
    }
  }

  function startBoss() {
    if (boss.active || state.flags.bossDefeated) return;
    boss.active = true;
    boss.started = true;
    boss.hp = boss.maxHp;
    boss.x = 805; boss.y = 445;
    boss.vulnerable = 'rick';
    boss.swapTimer = 4.2;
    boss.fireTimer = 1.05;
    enemyShots.length = 0;
    shots.length = 0;
    showToast('SUNDAY ROAST INCIDENT RESPONSE', 1400);
    refreshUI();
  }

  function endBoss() {
    boss.active = false;
    boss.hp = 0;
    enemyShots.length = 0;
    shots.length = 0;
    state.flags.bossDefeated = true;
    state.quest = Q.DONE;
    save();
    burst(boss.x,boss.y,'#f2c766',50);
    say('FATS', [
      'Laura: Was all that genuinely about a roast?',
      "Rick: Don't.",
      'FATS: It was about respect.'
    ], () => {
      showToast('ACHIEVEMENT: SILLY BULLSHIT BITCH', 2400);
      setTimeout(() => say('RICK + LAURA', [
        'Against all available evidence, date night survived.',
        'END. Probably.'
      ]), 350);
    });
  }

  function hurt() {
    if (player.flash > 0 || !boss.active) return;
    state.hp = Math.max(0, state.hp - 1);
    player.flash = 0.85;
    refreshUI();
    if (state.hp <= 0) {
      boss.active = false;
      enemyShots.length = 0;
      shots.length = 0;
      state.hp = state.maxHp;
      save();
      say('FATS', ['Defeated by a roast dispute. Grim.'], () => setScene('town',{x:820,y:690}));
    }
  }

  function heroAbility() {
    if (dialogue) return;
    if (!boss.active) {
      const n = nearestHotspot();
      if (n && n.ability) {
        n.ability();
        return;
      }
      if (state.hero === 'rick') {
        say('RICK', ['I can bullshit my way through something here.', 'There is currently fuck all to bullshit.']);
      } else {
        say('LAURA', ['Bullshit.', 'Rick: On what?', 'Laura: Vibes.']);
      }
      return;
    }

    if (state.hero === 'rick') {
      const len = Math.hypot(player.dirX, player.dirY) || 1;
      const dx = player.dirX / len || 1;
      const dy = player.dirY / len;
      shots.push({
        x: player.x + dx * 34,
        y: player.y - 25 + dy * 25,
        vx: dx * 470,
        vy: dy * 470,
        life: 1.25,
        kind: 'rick',
        text: state.flags.beat ? (Math.random() < .45 ? 'BARS' : 'TECHNICALLY') : (Math.random() < .5 ? 'YEAH BUT—' : 'ACTUALLY')
      });
      burst(player.x,player.y,'#b6ff3b',8);
    } else {
      const range = state.flags.wine ? 210 : 180;
      burst(player.x, player.y, '#ff4fa3', 24, range);
      enemyShots = enemyShots.filter(s => Math.hypot(s.x-player.x,s.y-player.y) > range);
      const d = Math.hypot(boss.x - player.x, boss.y - player.y);
      if (d < range) hitBoss(state.flags.wine ? 4.2 : 3.5, 'laura');
      if (state.flags.beat && Math.random() < .45) showToast('SECRET RIFF', 500);
    }
  }

  function hitBoss(amount, by) {
    if (!boss.active) return;
    if (boss.vulnerable !== by) {
      showToast(by === 'rick' ? 'HE’S ABSORBING THE BULLSHIT — SWAP' : 'HE’S TOO FAR AWAY IN HIS OWN HEAD — SWAP', 700);
      boss.flash = 0.12;
      return;
    }
    boss.hp = Math.max(0, boss.hp - amount);
    boss.flash = 0.16;
    burst(boss.x,boss.y, by === 'rick' ? '#b6ff3b' : '#ff4fa3', 14);
    if (boss.hp <= 0) endBoss();
  }

  function burst(x, y, color, count = 16, radius = 70) {
    for (let i=0;i<count;i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * radius;
      particles.push({
        x, y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: .35 + Math.random() * .45,
        max: .7,
        size: 2 + Math.random() * 5,
        color
      });
    }
  }

  function nearestHotspot() {
    let best = null;
    let bd = Infinity;
    for (const h of hotspots) {
      if (h.disabled && h.disabled()) continue;
      const d = Math.hypot(h.x - player.x, h.y - player.y);
      if (d <= (h.r || 90) && d < bd) { best = h; bd = d; }
    }
    return best;
  }

  function doAct() {
    if (advanceDialogue()) return;
    if (boss.active) return;
    const n = nearestHotspot();
    if (n && n.act) {
      n.act();
      return;
    }

  }

  function doSwap() {
    if (dialogue) return;
    state.hero = state.hero === 'rick' ? 'laura' : 'rick';
    player.step = 0;
    save();
    showToast(state.hero === 'rick' ? 'RICK IN' : 'LAURA IN', 520);
  }

  function resize() {
    dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
    canvas.width = Math.max(1, Math.round(innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(innerHeight * dpr));
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    fitCamera();
  }

  function fitCamera() {
    const sw = innerWidth;
    const sh = innerHeight;
    // Always show the entire room width. This deliberately avoids the absurdly zoomed-in old build.
    viewScale = sw / room.w;
    const visibleWorldH = sh / viewScale;
    cameraY = clamp(player.y - visibleWorldH * .68, 0, Math.max(0, room.h - visibleWorldH));
  }

  function screenToWorldY(sy) { return sy / viewScale + cameraY; }

  function pointInRect(x,y,r) {
    return x > r.x && x < r.x+r.w && y > r.y && y < r.y+r.h;
  }

  function obstaclesForScene() {
    const s = currentSceneName();
    if (s === 'town') return [
      {x:18,y:105,w:470,h:350},
      {x:1055,y:72,w:530,h:340},
      {x:1210,y:610,w:355,h:110},
      {x:660,y:675,w:320,h:88},
      {x:700,y:220,w:195,h:245}
    ];
    if (s === 'tap') return [
      {x:54,y:205,w:1092,h:230},
      {x:115,y:505,w:250,h:95},
      {x:475,y:510,w:250,h:95},
      {x:840,y:495,w:250,h:95}
    ];
    if (s === 'shop') return [
      {x:80,y:165,w:320,h:390},
      {x:455,y:175,w:320,h:380},
      {x:812,y:175,w:305,h:200}
    ];
    if (s === 'turkish') return [
      {x:92,y:405,w:345,h:145},
      {x:430,y:440,w:345,h:160},
      {x:788,y:392,w:330,h:145}
    ];
    return [];
  }

  function tryMove(nx, ny) {
    const margin = 32;
    nx = clamp(nx, margin, room.w - margin);
    ny = clamp(ny, 110, room.h - margin);
    const r = 24;
    const obstacles = obstaclesForScene();
    const collides = (x,y) => obstacles.some(o => x+r > o.x && x-r < o.x+o.w && y+r > o.y && y-r < o.y+o.h);
    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;
  }

  function update(dt) {
    if (dialogue || !state.flags.started) {
      player.vx *= .75; player.vy *= .75;
    } else {
      let mx = input.x + (keys.has('ArrowRight')||keys.has('d')?1:0) - (keys.has('ArrowLeft')||keys.has('a')?1:0);
      let my = input.y + (keys.has('ArrowDown')||keys.has('s')?1:0) - (keys.has('ArrowUp')||keys.has('w')?1:0);
      const m = Math.hypot(mx,my);
      if (m > 1) { mx/=m; my/=m; }
      if (m < .08) { mx=0; my=0; }
      const speed = HERO[state.hero].speed;
      const response = mx||my ? 10.5 : 13;
      const blend = 1 - Math.exp(-response * dt);
      player.vx += (mx*speed-player.vx)*blend;
      player.vy += (my*speed-player.vy)*blend;

      if (Math.abs(player.vx)+Math.abs(player.vy) < 1.5) { player.vx=0; player.vy=0; }

      if (mx || my) {
        player.dirX = mx;
        player.dirY = my;
        player.walk += dt * 8.5;
        const ns = Math.floor(player.walk) % 2;
        player.step = ns;
      } else {
        player.walk = 0;
        player.step = 0;
      }

      tryMove(player.x + player.vx*dt, player.y + player.vy*dt);
    }

    player.flash = Math.max(0, player.flash-dt);
    boss.flash = Math.max(0, boss.flash-dt);

    if (boss.active && currentSceneName()==='town' && !dialogue) {
      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const dist = Math.hypot(dx,dy) || 1;
      const chase = dist > 120 ? 58 : 0;
      boss.vx += ((dx/dist)*chase - boss.vx) * Math.min(1, dt*4);
      boss.vy += ((dy/dist)*chase - boss.vy) * Math.min(1, dt*4);
      boss.x += boss.vx * dt;
      boss.y += boss.vy * dt;

      boss.swapTimer -= dt;
      if (boss.swapTimer <= 0) {
        boss.swapTimer = 4.1;
        boss.vulnerable = boss.vulnerable === 'rick' ? 'laura' : 'rick';
        showToast(boss.vulnerable === 'rick' ? 'FATS IS NOW VULNERABLE TO BULLSHIT' : 'FATS IS NOW VULNERABLE TO CALLING BS', 900);
      }

      boss.fireTimer -= dt;
      if (boss.fireTimer <= 0) {
        boss.fireTimer = boss.hp < boss.maxHp*.5 ? .68 : 1.0;
        const angle = Math.atan2(player.y-boss.y,player.x-boss.x);
        const count = boss.hp < boss.maxHp*.5 ? 3 : 1;
        for (let i=0;i<count;i++) {
          const a = angle + (i-(count-1)/2)*.24;
          enemyShots.push({x:boss.x,y:boss.y-25,vx:Math.cos(a)*230,vy:Math.sin(a)*230,life:3});
        }
      }

      if (dist < 52) hurt();
    }

    for (const s of shots) {
      s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt;
      if (boss.active && Math.hypot(s.x-boss.x,s.y-boss.y) < 48 && !s.dead) {
        s.dead = true;
        hitBoss(state.flags.beat ? 2.8 : 2.2, 'rick');
      }
    }
    shots = shots.filter(s => s.life > 0 && !s.dead);

    for (const s of enemyShots) {
      s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt;
      if (Math.hypot(s.x-player.x,s.y-player.y) < 30 && !s.dead) {
        s.dead = true;
        hurt();
      }
    }
    enemyShots = enemyShots.filter(s => s.life > 0 && !s.dead);

    for (const p of particles) {
      p.x += p.vx*dt; p.y += p.vy*dt;
      p.vx *= Math.pow(.08,dt); p.vy *= Math.pow(.08,dt);
      p.life -= dt;
    }
    particles = particles.filter(p => p.life > 0);

    fitCamera();

    const n = nearestHotspot();
    if (n && !dialogue && !boss.active && state.flags.started) {
      ui.prompt.textContent = 'ACT · ' + n.label;
      ui.prompt.classList.remove('hidden');
    } else {
      ui.prompt.classList.add('hidden');
    }
  }

  function drawWorldImage(img) {
    ctx.drawImage(img, 0, -cameraY*viewScale, room.w*viewScale, room.h*viewScale);
  }

  function worldToScreen(x,y) {
    return { x: x*viewScale, y: (y-cameraY)*viewScale };
  }

  function drawNpc(n) {
    const p = worldToScreen(n.x,n.y);
    const img = images[n.key];
    const t = performance.now()/1000;
    const phase = ({will:0,denise:1.6,dad:3.1,fats:4.2}[n.key] || 0);
    const bob = Math.sin(t*2.05 + phase) * 2.4 * viewScale;
    const breathe = 1 + Math.sin(t*1.4 + phase) * .008;
    const w = n.w*viewScale*breathe, h = n.h*viewScale;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(img, p.x-w/2, p.y-h+8*viewScale+bob, w, h);
    ctx.restore();

    const d = Math.hypot(n.x-player.x,n.y-player.y);
    if (d < 150 && !boss.active) {
      ctx.save();
      ctx.font = `900 ${Math.max(10,16*viewScale)}px Impact, Arial Black, sans-serif`;
      ctx.textAlign='center';
      ctx.lineWidth=Math.max(2,4*viewScale);
      ctx.strokeStyle='#090b10';
      ctx.fillStyle = n.key === 'denise' ? '#ff4fa3' : n.key === 'dad' ? '#f2c766' : '#b6ff3b';
      ctx.strokeText(n.label,p.x,p.y-h-4);
      ctx.fillText(n.label,p.x,p.y-h-4);
      ctx.restore();
    }
  }

  function drawPlayer() {
    const p = worldToScreen(player.x,player.y);
    const img = images[state.hero + player.step];
    const baseH = state.hero === 'laura' ? 178 : 184;
    const bob = Math.sin(player.walk*Math.PI) * 3.3;
    const lean = clamp(player.vx/260,-1,1)*.035;
    const h = baseH*viewScale;
    const w = h * (img.width/img.height);

    ctx.save();
    ctx.translate(p.x,p.y + bob*viewScale);
    ctx.rotate(lean);
    const facingLeft = player.dirX < -.05;
    if (facingLeft) ctx.scale(-1,1);
    if (player.flash > 0 && Math.floor(player.flash*20)%2===0) ctx.globalAlpha=.38;
    ctx.drawImage(img,-w/2,-h+9*viewScale,w,h);
    ctx.restore();
  }

  function drawGlasses() {
    if (currentSceneName() !== 'town' || state.quest === Q.CAR || state.flags.glasses) return;
    const p = worldToScreen(430,715);
    const t = performance.now()/250;
    const bob = Math.sin(t)*4;
    ctx.save();
    ctx.translate(p.x,p.y+bob);
    ctx.strokeStyle='#eef8ff';
    ctx.lineWidth=Math.max(2,4*viewScale);
    const rr=14*viewScale;
    ctx.beginPath();ctx.arc(-16*viewScale,0,rr,0,Math.PI*2);ctx.arc(16*viewScale,0,rr,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-2*viewScale,0);ctx.lineTo(2*viewScale,0);ctx.stroke();
    ctx.shadowColor='#fff';ctx.shadowBlur=16;
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(0,-26*viewScale,3*viewScale,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawBoss() {
    if (!boss.active || currentSceneName() !== 'town') return;
    const p = worldToScreen(boss.x,boss.y);
    const img = images.fats;
    const h=148*viewScale, w=h*(img.width/img.height);
    ctx.save();
    if (boss.flash>0) ctx.globalAlpha=.55;
    ctx.drawImage(img,p.x-w/2,p.y-h+9*viewScale,w,h);
    ctx.restore();

    const ringColor = boss.vulnerable === 'rick' ? '#b6ff3b' : '#ff4fa3';
    ctx.save();
    ctx.strokeStyle=ringColor;
    ctx.lineWidth=Math.max(2,5*viewScale);
    ctx.globalAlpha=.85;
    ctx.beginPath();ctx.ellipse(p.x,p.y-8*viewScale,58*viewScale,26*viewScale,0,0,Math.PI*2);ctx.stroke();
    ctx.restore();

    const bw=Math.min(360,innerWidth*.38), bh=18;
    const bx=innerWidth/2-bw/2, by=60;
    ctx.save();
    ctx.fillStyle='#0a0c14e8';ctx.fillRect(bx-5,by-5,bw+10,bh+10);
    ctx.strokeStyle='#ff6673';ctx.lineWidth=2;ctx.strokeRect(bx-5,by-5,bw+10,bh+10);
    ctx.fillStyle=ringColor;ctx.fillRect(bx,by,bw*Math.max(0,boss.hp/boss.maxHp),bh);
    ctx.font='900 15px Impact, Arial Black, sans-serif';
    ctx.textAlign='center';ctx.fillStyle='#f4eee7';
    ctx.fillText('FATS — ' + (boss.vulnerable==='rick'?'ABSORBING EVERYTHING EXCEPT BULLSHIT':'CALL HIM ON HIS SHIT'),innerWidth/2,by-9);
    ctx.restore();
  }

  function drawProjectiles() {
    for (const s of shots) {
      const p=worldToScreen(s.x,s.y);
      ctx.save();
      ctx.font=`900 ${Math.max(11,18*viewScale)}px Impact, Arial Black, sans-serif`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle='#b6ff3b';ctx.strokeStyle='#10140b';ctx.lineWidth=3;
      ctx.strokeText(s.text,p.x,p.y);ctx.fillText(s.text,p.x,p.y);
      ctx.restore();
    }
    for (const s of enemyShots) {
      const p=worldToScreen(s.x,s.y);
      const r=13*viewScale;
      ctx.save();
      ctx.fillStyle='#e4c188';ctx.strokeStyle='#79472f';ctx.lineWidth=Math.max(2,4*viewScale);
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#6b3e2c';
      ctx.beginPath();ctx.arc(p.x-r*.35,p.y-r*.2,r*.12,0,Math.PI*2);ctx.arc(p.x+r*.3,p.y+r*.25,r*.1,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const s=worldToScreen(p.x,p.y);
      ctx.save();
      ctx.globalAlpha=clamp(p.life/p.max,0,1);
      ctx.fillStyle=p.color;
      ctx.beginPath();ctx.arc(s.x,s.y,p.size*viewScale,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  }

  function drawAmbient() {
    const t = performance.now()/1000;
    if (currentSceneName() === 'town') {
      // Warm pub-light reflections move across the road.
      for (let i=0;i<5;i++) {
        const wx = 520 + i*220 + Math.sin(t*.55+i)*20;
        const wy = 565 + Math.sin(t*.8+i*.7)*10;
        const p = worldToScreen(wx,wy);
        const r = (10 + i*2) * viewScale;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4);
        g.addColorStop(0,'rgba(255,205,110,.19)');
        g.addColorStop(1,'rgba(255,205,110,0)');
        ctx.fillStyle=g;
        ctx.beginPath();ctx.arc(p.x,p.y,r*4,0,Math.PI*2);ctx.fill();
      }

      // Moving pigeons, because Penwortham nightlife apparently needed a wildlife system.
      for (let i=0;i<3;i++) {
        const px = ((t*(46+i*9)+i*520)%1720)-70;
        const py = 610 + i*35 + Math.sin(t*3+i)*8;
        const p=worldToScreen(px,py);
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.strokeStyle='rgba(215,220,225,.68)';
        ctx.lineWidth=Math.max(1.5,3*viewScale);
        ctx.beginPath();
        ctx.moveTo(-12*viewScale,0);
        ctx.quadraticCurveTo(-4*viewScale,-8*viewScale,0,0);
        ctx.quadraticCurveTo(5*viewScale,-8*viewScale,12*viewScale,0);
        ctx.stroke();
        ctx.restore();
      }

      // Occasional passing headlights at the very bottom edge.
      const carX = ((t*115)%1850)-140;
      const cp = worldToScreen(carX,835);
      ctx.save();
      ctx.globalAlpha=.55;
      ctx.fillStyle='#f7e8b4';
      ctx.beginPath();ctx.arc(cp.x,cp.y,5*viewScale,0,Math.PI*2);ctx.arc(cp.x+42*viewScale,cp.y,5*viewScale,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  }

  function render() {
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,innerWidth,innerHeight);
    const bg = images[room.bg];
    if (bg) drawWorldImage(bg);
    drawAmbient();

    npcs.forEach(drawNpc);
    drawBoss();
    drawProjectiles();
    drawParticles();
    drawPlayer();

    if (!state.flags.started) {
      ctx.fillStyle='rgba(0,0,0,.16)';
      ctx.fillRect(0,0,innerWidth,innerHeight);
    }
  }

  function loop(now) {
    const dt = Math.min(.034, Math.max(.001,(now-last)/1000));
    last=now;
    if (running) update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

  // Floating joystick
  let stickPointer = null;
  let stickOrigin = {x:0,y:0};
  const STICK_MAX = 44;

  function resetStick() {
    stickPointer = null;
    input.x = input.y = 0;
    ui.stickBase.classList.add('hidden');
    ui.stickKnob.style.transform='translate(-50%,-50%)';
    ui.moveGhost.style.opacity='.55';
  }

  window.addEventListener('pointerdown', (e) => {
    if (!state.flags.started || dialogue || stickPointer !== null) return;
    if (e.target.closest && e.target.closest('button')) return;
    if (e.clientX > innerWidth*.48) return;
    stickPointer=e.pointerId;
    stickOrigin={x:e.clientX,y:e.clientY};
    ui.stickBase.style.left=e.clientX+'px';
    ui.stickBase.style.top=e.clientY+'px';
    ui.stickBase.classList.remove('hidden');
    ui.moveGhost.style.opacity='.18';
  }, {passive:false});

  window.addEventListener('pointermove', (e) => {
    if (e.pointerId !== stickPointer) return;
    let dx=e.clientX-stickOrigin.x, dy=e.clientY-stickOrigin.y;
    const d=Math.hypot(dx,dy);
    if (d>STICK_MAX){dx=dx/d*STICK_MAX;dy=dy/d*STICK_MAX;}
    input.x=dx/STICK_MAX;input.y=dy/STICK_MAX;
    ui.stickKnob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  }, {passive:false});

  const endStick=(e)=>{if(e.pointerId===stickPointer)resetStick();};
  window.addEventListener('pointerup',endStick,{passive:false});
  window.addEventListener('pointercancel',endStick,{passive:false});

  ui.act.addEventListener('pointerdown',(e)=>{e.preventDefault();doAct();});
  ui.swap.addEventListener('pointerdown',(e)=>{e.preventDefault();doSwap();});
  ui.ability.addEventListener('pointerdown',(e)=>{e.preventDefault();heroAbility();});
  ui.start.addEventListener('pointerdown',(e)=>{
    e.preventDefault();
    state.flags.started=true;
    ui.startCard.classList.add('hidden');
    save();
    showToast('GOOD LUCK WITH WHATEVER THIS IS',900);
  });

  window.addEventListener('keydown',(e)=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    keys.add(k);
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    if (e.key==='e'||e.key==='Enter') doAct();
    if (e.key==='k') doSwap();
    if (e.key===' ') heroAbility();
  });
  window.addEventListener('keyup',(e)=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));

  // Kill browser zoom/pinch. Camera zoom is game-controlled only.
  ['gesturestart','gesturechange','gestureend','dblclick'].forEach(type=>document.addEventListener(type,e=>e.preventDefault(),{passive:false}));
  document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
  let lastTouch=0;
  document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastTouch<300)e.preventDefault();lastTouch=n;},{passive:false});

  window.addEventListener('resize',resize);

  window.addEventListener('error',(e)=>{document.body.dataset.gameError=String(e.message||'error').slice(0,160);});
  window.addEventListener('unhandledrejection',(e)=>{document.body.dataset.gameError=('promise:'+String(e.reason||'error')).slice(0,160);});

  async function boot() {
    try {
      await loadImages();
      room=SCENES[state.scene]||SCENES.town;
      const p=state.positions[state.scene]||room.spawn;
      player.x=p.x;player.y=p.y;
      buildScene();
      resize();
      refreshUI();
      if (state.flags.started) ui.startCard.classList.add('hidden');
      if (params.get('test')==='1') ui.startCard.classList.add('hidden');
      running=true;
      document.body.dataset.gameReady='true';
      document.body.dataset.scene=state.scene;
      document.body.dataset.quest=state.quest;

      function drainDialogueForTest() {
        let guard = 0;
        while (dialogue && guard++ < 30) advanceDialogue();
      }

      // CI-only progression check: the car must unlock the shop/milk path.
      if (params.get('autotest') === 'car-milk') {
        state.quest = Q.CAR;
        state.flags.car = false;
        buildScene();
        const car = hotspots.find(h => h.id === 'car');
        if (car && car.act) car.act();
        drainDialogueForTest();
        document.body.dataset.autoTest = state.quest + ':' + (document.body.dataset.hotspots || '');
      }

      // Full regression for the new glasses side quest:
      // Will -> Kendal wristband -> Will -> glasses -> Denise.
      if (params.get('autotest') === 'will-glasses-chain') {
        state.scene = 'tap';
        room = SCENES.tap;
        player.x = 300; player.y = 510;
        state.quest = Q.WILL;
        state.flags.will = false;
        state.flags.wristband = false;
        state.flags.glasses = false;
        buildScene();

        const will1 = hotspots.find(h => h.id === 'will');
        if (will1 && will1.act) will1.act();
        drainDialogueForTest();

        state.scene = 'kendal';
        room = SCENES.kendal;
        player.x = 700; player.y = 480;
        buildScene();
        const wristband = hotspots.find(h => h.id === 'flashback');
        if (wristband && wristband.act) wristband.act();
        drainDialogueForTest();

        state.scene = 'tap';
        room = SCENES.tap;
        player.x = 300; player.y = 510;
        buildScene();
        const will2 = hotspots.find(h => h.id === 'will');
        if (will2 && will2.act) will2.act();
        drainDialogueForTest();

        document.body.dataset.autoTest =
          state.quest + ':wristband=' + String(!!state.flags.wristband) +
          ':glasses=' + String(!!state.flags.glasses) +
          ':hotspots=' + (document.body.dataset.hotspots || '');
      }

      requestAnimationFrame(loop);
    } catch (err) {
      document.body.dataset.gameError=String(err&&err.message||err);
      ui.startCard.innerHTML='<div class="startInner"><div class="eyebrow">LOAD ERROR</div><h1>OH<br><em>FUCK</em></h1><p>'+String(err&&err.message||err)+'</p></div>';
    }
  }

  boot();
})();