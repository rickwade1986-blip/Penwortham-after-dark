window.PAD_WORLD = {
  startArea: 'green',
  quests: [
    { id:'car', label:"Find Rick's car AND his glasses", area:'green', target:{x:420,y:350} },
    { id:'milk', label:'Behbeh, we need milk too', area:'shop', target:{x:480,y:280} },
    { id:'wine', label:'Acquire Sauvignon for Laura', area:'pub', target:{x:720,y:300} },
    { id:'beat', label:'Find Prince Andrew 3000', area:'green', target:{x:1450,y:800} },
    { id:'roast', label:'Investigate the Sunday roast emergency', area:'fats', target:{x:690,y:350} },
    { id:'boss', label:'De-pout FATS', area:'fats', target:{x:720,y:360} }
  ],
  areas: {
    green: {
      name:'Weird Friends Green',
      kind:'outdoor', size:[2200,1500], floor:'#2d6445', accent:'#95c86e',
      spawn:{x:1050,y:820},
      exits:[
        {x:820,y:130,w:250,h:145,to:'coffee',spawn:{x:480,y:430},label:'4AM COFFEE'},
        {x:1570,y:120,w:310,h:170,to:'pub',spawn:{x:500,y:430},label:'OLD MAN PUB'},
        {x:150,y:1100,w:300,h:175,to:'shop',spawn:{x:480,y:420},label:'CORNER SHOP'},
        {x:650,y:1110,w:300,h:180,to:'sauna',spawn:{x:480,y:420},label:'SAUNA'},
        {x:1110,y:1110,w:360,h:180,to:'travel',spawn:{x:480,y:420},label:'WEALTHY LITTLE PIGS'},
        {x:1710,y:650,w:300,h:180,to:'tap',spawn:{x:480,y:420},label:'TAP-ISH'},
        {x:1960,y:1080,w:210,h:300,to:'fats',spawn:{x:180,y:420},label:'PAD THAI PALACE',lockedQuest:4}
      ],
      props:[
        {type:'sign',x:980,y:690,text:'WEIRD FRIENDS GREEN'},
        {type:'bench',x:1050,y:910},{type:'tree',x:350,y:700},{type:'tree',x:530,y:630},{type:'tree',x:650,y:940},
        {type:'tree',x:1250,y:600},{type:'tree',x:1420,y:560},{type:'tree',x:1980,y:520},
        {type:'pond',x:1030,y:250,w:320,h:230},{type:'car',x:420,y:350},
        {type:'festival',x:1120,y:940,text:'KENDAL CALLING 2027\nparking spiritually unresolved'}
      ],
      npcs:[
        {id:'denise-ish',x:1780,y:930,name:'PUB ORACLE',lines:['Tonight feels like an Old Man Pub night.','Also: FATS is already moaning about food. Obviously.']},
        {id:'andrew',x:1450,y:800,name:'PRINCE ANDREW 3000',quest:3,lines:['I have prepared one extremely dusty beat.','Please do not ask why I am called this. Nobody remembers anymore.']},
        {id:'stranger',x:820,y:820,name:'WEIRD FRIEND',lines:['You two met on a weird friends app, yeah?','Healthy Tinder habits at 2am. Very normal.']}
      ]
    },
    coffee: {
      name:'4AM Coffee',kind:'indoor',size:[960,620],floor:'#382c31',accent:'#ad765c',
      spawn:{x:480,y:430},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:950,y:340},label:'OUT'}],
      props:[{type:'counter',x:470,y:170,w:520,h:70},{type:'coffee',x:250,y:300},{type:'coffee',x:700,y:315},{type:'sign',x:480,y:95,text:'4AM COFFEE'}],
      npcs:[{id:'barista',x:480,y:255,name:'BARISTA',lines:["It's 4am.","Rick has ordered another coffee.","Laura looks like she has accepted this as a character flaw."]}]
    },
    pub: {
      name:'The Old Man Pub',kind:'indoor',size:[960,620],floor:'#4b342b',accent:'#d4a65a',
      spawn:{x:500,y:430},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1710,y:340},label:'OUT'}],
      props:[{type:'bar',x:480,y:145,w:610,h:75},{type:'table',x:250,y:330},{type:'table',x:720,y:330},{type:'wine',x:720,y:300},{type:'sign',x:480,y:75,text:'PRETENTIOUS WATER BAR'}],
      npcs:[
        {id:'barman',x:470,y:235,name:'BARMAN',lines:['A pint of whatever?','...water?','Love going to a pretentious bar for a water 🙄']},
        {id:'local',x:240,y:310,name:'OLD MAN',lines:['This used to be a proper pub.','Now people order Sauvignon and rap attacks.']}
      ]
    },
    shop: {
      name:'Corner Shop',kind:'indoor',size:[960,620],floor:'#405141',accent:'#8bc28e',
      spawn:{x:480,y:420},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:300,y:1070},label:'OUT'}],
      props:[{type:'shelf',x:260,y:190,w:170,h:230},{type:'shelf',x:700,y:190,w:170,h:230},{type:'milk',x:480,y:280},{type:'sign',x:480,y:75,text:'BEHBEH WE NEED MILK TOO'}],
      npcs:[{id:'cashier',x:480,y:175,name:'CASHIER',lines:['Milk. Coffee. KFC later.','A balanced household economy.']}]
    },
    sauna: {
      name:'Sauna Shrine',kind:'indoor',size:[960,620],floor:'#604c3f',accent:'#e39a5c',
      spawn:{x:480,y:420},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:800,y:1070},label:'OUT'}],
      props:[{type:'bench',x:250,y:300},{type:'bench',x:700,y:300},{type:'steam',x:480,y:180},{type:'sign',x:480,y:75,text:'SAUNA SHRINE'}],
      npcs:[{id:'sauna-guy',x:480,y:285,name:'SAUNA BLOKE',lines:['I once did twelve hours in here.','Laura: did ye aye.','...right. Fair enough.']}]
    },
    travel: {
      name:'Wealthy Little Pigs Travel',kind:'indoor',size:[960,620],floor:'#39505a',accent:'#73bed0',
      spawn:{x:480,y:420},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1290,y:1070},label:'OUT'}],
      props:[{type:'desk',x:480,y:200,w:470,h:80},{type:'palm',x:180,y:250},{type:'palm',x:790,y:250},{type:'sign',x:480,y:75,text:'LIVE LIKE WEALTHY LITTLE PIGS'}],
      npcs:[{id:'agent',x:480,y:285,name:'TRAVEL AGENT',lines:['Somewhere disgustingly beautiful and cheap?','Two weeks? Five star? Waterpark?','Of course. That will be four million pounds in school holidays.']}]
    },
    tap: {
      name:'Tap-ish',kind:'indoor',size:[960,620],floor:'#332b45',accent:'#a982c4',
      spawn:{x:480,y:420},exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1850,y:830},label:'OUT'}],
      props:[{type:'bar',x:480,y:155,w:600,h:75},{type:'stage',x:250,y:350,w:260,h:100},{type:'guitar',x:250,y:300},{type:'sign',x:480,y:75,text:'TAP-ISH'}],
      npcs:[{id:'handsome-barman',x:520,y:245,name:'HANDSOME BARMAN',lines:["When you're in the Tap, you're a pub.",'Nobody knows what that means. Including me.']}]
    },
    fats: {
      name:'Pad Thai Palace',kind:'boss',size:[1120,720],floor:'#271d2c',accent:'#ff5e67',
      spawn:{x:180,y:420},exits:[{x:40,y:330,w:90,h:180,to:'green',spawn:{x:1890,y:1210},label:'RUN AWAY'}],
      props:[{type:'sign',x:560,y:80,text:'FATS HQ / PAD THAI PALACE'},{type:'table',x:300,y:220},{type:'table',x:820,y:220},{type:'roast',x:560,y:270},{type:'kfc',x:860,y:500}],
      npcs:[]
    }
  },
  dialogue: {
    firstMeet:["It's Rick from the weird friends app btw 😂","Laura: I gathered that, yeah."],
    car:["Found my car, found my glasses.","Wild free spirit. Never follows a script. Mainly because he can't find the car."],
    milk:['Behbeh we need milk too.','The most important quest in Lancashire has been completed.'],
    wine:["Sauvignon in hand she's the master of the band she's in.","LAURA has acquired BATTLE SAUVIGNON."],
    beat:['Prince Andrew 3000 hands Rick a dusty beat.','RICK RAP DAMAGE increased for no sensible reason.'],
    roast:['FATS: THE FIRST PUB ISN\'T DOING SUNDAY ROASTS.','FATS has entered a completely proportionate emotional response.'],
    win:['FATS has been comprehensively de-pouted.','Achievement unlocked: I LOVE YOUR SILLY BULLSHIT BITCH X']
  }
};