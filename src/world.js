window.PAD_WORLD = {
  startArea: 'green',
  quests: [
    { id:'car', label:"Find Rick's car AND his glasses", area:'green', target:{x:420,y:350} },
    { id:'milk', label:'Behbeh, we need milk too', area:'shop', target:{x:480,y:285} },
    { id:'tap', label:'Go to Tap-ish and see Will + Denise', area:'tap', target:{x:520,y:250} },
    { id:'beat', label:'Find Prince Andrew 3000', area:'green', target:{x:1450,y:800} },
    { id:'roast', label:'Investigate the Sunday roast emergency', area:'fats', target:{x:560,y:270} },
    { id:'boss', label:'De-pout FATS', area:'fats', target:{x:760,y:355} }
  ],

  areas: {
    green: {
      name:'Weird Friends Green',
      kind:'outdoor',
      size:[2200,1500],
      floor:'#2d6445',
      accent:'#95c86e',
      spawn:{x:1050,y:820},
      exits:[
        {x:820,y:130,w:250,h:145,to:'coffee',spawn:{x:480,y:430},label:'4AM COFFEE'},
        {x:1570,y:120,w:310,h:170,to:'pub',spawn:{x:500,y:430},label:'OLD MAN PUB'},
        {x:150,y:1100,w:300,h:175,to:'shop',spawn:{x:480,y:420},label:'CORNER SHOP'},
        {x:650,y:1110,w:300,h:180,to:'sauna',spawn:{x:480,y:420},label:'SAUNA'},
        {x:1110,y:1110,w:360,h:180,to:'travel',spawn:{x:480,y:420},label:'WEALTHY LITTLE PIGS'},
        {x:1710,y:650,w:300,h:180,to:'tap',spawn:{x:480,y:420},label:'TAP & VINE'},
        {x:1960,y:1080,w:210,h:300,to:'fats',spawn:{x:180,y:420},label:'PAD THAI PALACE',lockedQuest:4}
      ],
      props:[
        {type:'sign',x:980,y:690,text:'WEIRD FRIENDS GREEN'},
        {type:'bench',x:1050,y:910},
        {type:'tree',x:350,y:700},{type:'tree',x:530,y:630},{type:'tree',x:650,y:940},
        {type:'tree',x:1250,y:600},{type:'tree',x:1420,y:560},{type:'tree',x:1980,y:520},
        {type:'pond',x:1030,y:250,w:320,h:230},
        {type:'car',x:420,y:350},
        {type:'festival',x:1120,y:940,text:'KENDAL CALLING 2027\nparking spiritually unresolved'}
      ],
      npcs:[
        {
          id:'andrew',
          art:'andrew',
          x:1450,y:800,
          name:'PRINCE ANDREW 3000',
          quest:3,
          lines:[
            'I have prepared one extremely dusty beat.',
            'Nobody remembers why I am called this. We move.'
          ]
        }
      ]
    },

    coffee: {
      name:'4AM Coffee',
      kind:'indoor',
      size:[960,620],
      floor:'#382c31',
      accent:'#ad765c',
      spawn:{x:480,y:430},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:950,y:340},label:'OUT'}],
      props:[
        {type:'counter',x:470,y:170,w:520,h:70},
        {type:'coffee',x:250,y:300},{type:'coffee',x:700,y:315},
        {type:'sign',x:480,y:95,text:'4AM COFFEE'}
      ],
      npcs:[
        {
          id:'barista',
          art:'barista',
          x:480,y:255,
          name:'4AM BARISTA',
          lines:[
            "It's 4am.",
            'Rick has ordered another coffee.',
            'Laura has accepted this as a permanent character defect.'
          ]
        }
      ]
    },

    pub: {
      name:'The Old Man Pub',
      kind:'indoor',
      size:[960,620],
      floor:'#4b342b',
      accent:'#d4a65a',
      spawn:{x:500,y:430},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1710,y:340},label:'OUT'}],
      props:[
        {type:'bar',x:480,y:145,w:610,h:75},
        {type:'table',x:250,y:330},{type:'table',x:720,y:330},
        {type:'sign',x:480,y:75,text:'A PROPER OLD MAN PUB'}
      ],
      npcs:[
        {
          id:'dad',
          art:'dad',
          x:690,y:315,
          name:'DAD',
          lines:[
            'You two again?',
            'Have you actually found the car this time?'
          ],
          rickLines:[
            'There he is. My wandering son.',
            'Have you actually found the car this time?',
            'Rick: yes. Eventually.'
          ],
          lauraLines:[
            'You keeping him organised then?',
            'Laura: I have several systems. None of them can locate his glasses.'
          ]
        },
        {
          id:'oldman',
          art:'oldman',
          x:250,y:310,
          name:'PUB LOCAL',
          lines:[
            'This used to be a proper pub.',
            'Now apparently guitar shockwaves are allowed indoors.'
          ]
        }
      ]
    },

    shop: {
      name:'Corner Shop',
      kind:'indoor',
      size:[960,620],
      floor:'#405141',
      accent:'#8bc28e',
      spawn:{x:480,y:420},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:300,y:1070},label:'OUT'}],
      props:[
        {type:'shelf',x:260,y:190,w:170,h:230},
        {type:'shelf',x:700,y:190,w:170,h:230},
        {type:'milk',x:480,y:285},
        {type:'sign',x:480,y:75,text:'BEHBEH WE NEED MILK TOO'}
      ],
      npcs:[]
    },

    sauna: {
      name:'Sauna Shrine',
      kind:'indoor',
      size:[960,620],
      floor:'#604c3f',
      accent:'#e39a5c',
      spawn:{x:480,y:420},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:800,y:1070},label:'OUT'}],
      props:[
        {type:'bench',x:250,y:300},{type:'bench',x:700,y:300},
        {type:'steam',x:480,y:180},{type:'sign',x:480,y:75,text:'SAUNA SHRINE'}
      ],
      npcs:[
        {
          id:'sauna-guy',
          art:'sauna',
          x:480,y:285,
          name:'SAUNA BLOKE',
          lines:[
            'I once did twelve hours in here.',
            'Laura: did ye aye.',
            '...right. Fair enough.'
          ]
        }
      ]
    },

    travel: {
      name:'Wealthy Little Pigs Travel',
      kind:'indoor',
      size:[960,620],
      floor:'#39505a',
      accent:'#73bed0',
      spawn:{x:480,y:420},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1290,y:1070},label:'OUT'}],
      props:[
        {type:'desk',x:480,y:200,w:470,h:80},
        {type:'palm',x:180,y:250},{type:'palm',x:790,y:250},
        {type:'sign',x:480,y:75,text:'LIVE LIKE WEALTHY LITTLE PIGS'}
      ],
      npcs:[
        {
          id:'agent',
          art:'agent',
          x:480,y:285,
          name:'TRAVEL AGENT',
          lines:[
            'Somewhere disgustingly beautiful and cheap?',
            'Two weeks? Five star? Waterpark?',
            'Excellent. School holidays have made that £97,000.'
          ]
        }
      ]
    },

    tap: {
      name:'Tap & Vine',
      kind:'indoor',
      size:[960,620],
      floor:'#332b45',
      accent:'#a982c4',
      spawn:{x:480,y:420},
      exits:[{x:390,y:520,w:180,h:80,to:'green',spawn:{x:1850,y:830},label:'OUT'}],
      props:[
        {type:'bar',x:480,y:155,w:600,h:75},
        {type:'stage',x:250,y:350,w:260,h:100},
        {type:'guitar',x:250,y:300},
        {type:'wine',x:620,y:220},
        {type:'sign',x:480,y:75,text:'TAP & VINE'}
      ],
      npcs:[
        {
          id:'will',
          art:'will',
          x:540,y:245,
          name:'WILL',
          quest:2,
          lines:[
            "When you're in the Tap, you're a pub."
          ],
          rickLines:[
            "When you're in the Tap, you're a pub.",
            'Rick: that sentence has never improved with repetition.'
          ],
          lauraLines:[
            "When you're in the Tap, you're a pub.",
            'Laura: Will, I am begging you to explain that sentence.'
          ]
        },
        {
          id:'denise',
          art:'denise',
          x:720,y:320,
          name:'DENISE',
          quest:2,
          lines:[
            'Kendal again next year, then?',
            'Obviously.'
          ],
          rickLines:[
            'Kendal again next year, then?',
            'Rick: apparently I have no say in this.',
            'Denise: correct.'
          ],
          lauraLines:[
            'Kendal again next year, then?',
            'Laura: obviously.',
            'Denise hands Laura a tactical Sauvignon.'
          ]
        }
      ]
    },

    fats: {
      name:'Pad Thai Palace',
      kind:'boss',
      size:[1120,720],
      floor:'#271d2c',
      accent:'#ff5e67',
      spawn:{x:180,y:420},
      exits:[{x:40,y:330,w:90,h:180,to:'green',spawn:{x:1890,y:1210},label:'RUN AWAY'}],
      props:[
        {type:'sign',x:560,y:80,text:'FATS HQ / PAD THAI PALACE'},
        {type:'table',x:300,y:220},{type:'table',x:820,y:220},
        {type:'roast',x:560,y:270},
        {type:'kfc',x:860,y:500}
      ],
      npcs:[]
    }
  },

  dialogue: {
    firstMeet:[
      "It's Rick from the weird friends app btw 😂",
      'Laura: I gathered that, yeah.'
    ],
    car:[
      'Found my car. Found my glasses.',
      'Wild free spirit restored. Barely.'
    ],
    milk:[
      'Behbeh we need milk too.',
      'The most important logistical operation in Lancashire is complete.'
    ],
    tap:[
      "Will: When you're in the Tap, you're a pub.",
      'Denise: Kendal again next year then?',
      'Laura has acquired tactical Sauvignon.'
    ],
    beat:[
      'Prince Andrew 3000 hands Rick a dusty beat.',
      'Rick has absolutely no idea what to do with this responsibility.'
    ],
    roast:[
      "FATS: THE FIRST PUB ISN'T DOING SUNDAY ROASTS.",
      'FATS has entered a completely proportionate emotional response.'
    ],
    win:[
      'FATS has been comprehensively de-pouted.',
      'Achievement unlocked: I LOVE YOUR SILLY BULLSHIT BITCH X'
    ]
  }
};