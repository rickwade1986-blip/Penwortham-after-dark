(() => {
  const data = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  const common = `
    <defs>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#13233c"/>
        <stop offset=".55" stop-color="#1d3545"/>
        <stop offset="1" stop-color="#101a22"/>
      </linearGradient>
      <linearGradient id="brick" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#5c312c"/><stop offset="1" stop-color="#2a1a1d"/>
      </linearGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#7b4c31"/><stop offset=".5" stop-color="#4c3027"/><stop offset="1" stop-color="#271b1b"/>
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#25313a"/><stop offset="1" stop-color="#131b22"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#ffd477"/><stop offset=".5" stop-color="#d48c48"/><stop offset="1" stop-color="#50352b"/>
      </linearGradient>
      <radialGradient id="lamp" cx=".5" cy=".5" r=".5">
        <stop stop-color="#ffe8a9" stop-opacity=".95"/><stop offset=".45" stop-color="#ffc75d" stop-opacity=".3"/><stop offset="1" stop-color="#ffc75d" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="grass" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#315a3d"/><stop offset="1" stop-color="#183726"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity=".38"/>
      </filter>
      <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="11"/>
      </filter>
      <pattern id="brickPattern" width="46" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 0H46M0 24H46M23 0V12M0 12H46M0 12V24M46 12V24" stroke="#ffffff10" stroke-width="2"/>
      </pattern>
    </defs>
  `;

  const town = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
    ${common}
    <rect width="1600" height="900" fill="url(#night)"/>
    <circle cx="1275" cy="92" r="54" fill="#e7f5ea" opacity=".82"/>
    <circle cx="1291" cy="82" r="54" fill="#13233c"/>

    <rect y="520" width="1600" height="380" fill="url(#road)"/>
    <path d="M0 655 C260 610 490 640 760 622 S1260 610 1600 640" fill="none" stroke="#ffffff18" stroke-width="10" stroke-dasharray="62 44"/>
    <path d="M0 807 C310 775 555 802 840 780 S1320 784 1600 805" fill="none" stroke="#ffffff11" stroke-width="7" stroke-dasharray="50 35"/>

    <!-- 4AM COFFEE -->
    <g filter="url(#shadow)">
      <rect x="32" y="120" width="442" height="388" rx="12" fill="url(#brick)" stroke="#141318" stroke-width="10"/>
      <rect x="32" y="120" width="442" height="388" rx="12" fill="url(#brickPattern)"/>
      <rect x="62" y="166" width="382" height="82" rx="10" fill="#12151c" stroke="#2d3040" stroke-width="5"/>
      <text x="253" y="221" text-anchor="middle" font-family="Arial Black,Impact" font-size="43" fill="#e8f5ff">4AM COFFEE</text>
      <path d="M388 185h24v19c0 18-10 29-25 29s-25-11-25-29v-19z" fill="none" stroke="#a55cff" stroke-width="7"/>
      <path d="M412 193c16 0 19 9 13 18-4 5-9 7-15 7" fill="none" stroke="#a55cff" stroke-width="6"/>
      <path d="M374 169c-10-13 10-14 0-27M395 169c-10-13 10-14 0-27" fill="none" stroke="#a55cff" stroke-width="4"/>
      <g>
        <rect x="62" y="272" width="115" height="177" fill="#1a1b20" stroke="#090b0e" stroke-width="8"/>
        <rect x="200" y="272" width="108" height="120" fill="url(#glass)" stroke="#090b0e" stroke-width="8"/>
        <rect x="326" y="272" width="108" height="120" fill="url(#glass)" stroke="#090b0e" stroke-width="8"/>
        <path d="M215 300h78M215 331h78M340 300h78M340 331h78" stroke="#f8df9b55" stroke-width="4"/>
      </g>
      <rect x="83" y="423" width="132" height="70" rx="8" fill="#17191d" stroke="#eee" stroke-width="3"/>
      <text x="149" y="448" text-anchor="middle" font-family="Arial Black" font-size="15" fill="#f2efe8">GOOD COFFEE</text>
      <text x="149" y="469" text-anchor="middle" font-family="Arial Black" font-size="15" fill="#ff4fa3">BAD DECISIONS</text>
    </g>

    <!-- TAP & VINE -->
    <g filter="url(#shadow)">
      <rect x="1070" y="86" width="500" height="430" rx="12" fill="url(#brick)" stroke="#141318" stroke-width="10"/>
      <rect x="1070" y="86" width="500" height="430" rx="12" fill="url(#brickPattern)"/>
      <rect x="1110" y="132" width="420" height="86" rx="8" fill="#101217" stroke="#c79a55" stroke-width="4"/>
      <text x="1320" y="188" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="50" fill="#d8a95d">TAP &amp; VINE</text>
      <g fill="url(#glass)" stroke="#0b0c0e" stroke-width="8">
        <rect x="1115" y="244" width="164" height="150"/><rect x="1302" y="244" width="220" height="150"/>
      </g>
      <path d="M1134 285h126M1134 328h126M1320 285h184M1320 328h184" stroke="#ffd87a55" stroke-width="5"/>
      <rect x="1235" y="399" width="160" height="111" fill="#161417" stroke="#08090b" stroke-width="8"/>
      <g fill="#5f3f2d" stroke="#171319" stroke-width="5">
        <ellipse cx="1135" cy="474" rx="72" ry="36"/><ellipse cx="1490" cy="466" rx="70" ry="34"/>
      </g>
      <g fill="#b9783e"><circle cx="1107" cy="466" r="8"/><circle cx="1464" cy="458" r="8"/></g>
      <rect x="1430" y="404" width="116" height="82" rx="8" fill="#17191e" stroke="#ded3bf" stroke-width="3"/>
      <text x="1488" y="431" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#f0eadf">GOOD BEER</text>
      <text x="1488" y="453" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#b8ff3b">BETTER PEOPLE</text>
    </g>

    <!-- GREEN -->
    <g>
      <path d="M480 156 Q790 95 1090 185 L1064 512 Q810 585 492 506Z" fill="url(#grass)" stroke="#203b2a" stroke-width="12"/>
      <path d="M553 200 Q790 155 1025 218" fill="none" stroke="#6c8a62" stroke-width="8" opacity=".45"/>
      <ellipse cx="790" cy="338" rx="168" ry="102" fill="#153522"/>
      <path d="M779 154 C720 115 692 154 684 219 C651 190 608 211 616 259 C567 251 548 296 573 326 C538 349 550 392 591 401 C570 447 615 473 659 451 C682 492 737 474 748 440 C785 472 832 461 847 425 C892 453 938 427 928 389 C975 375 975 328 941 308 C969 266 934 224 892 237 C884 183 826 168 779 194Z" fill="#26583a"/>
      <path d="M787 238 C764 284 765 384 752 480" stroke="#4a3425" stroke-width="44" stroke-linecap="round"/>
      <path d="M790 270 C750 244 717 235 677 226M798 289C840 260 878 250 919 245M782 320C744 331 716 345 684 370M804 333C843 350 870 374 896 397" stroke="#4a3425" stroke-width="18" stroke-linecap="round"/>
      <g fill="#8f623f" stroke="#1a1617" stroke-width="5">
        <rect x="568" y="432" width="170" height="26" rx="6" transform="rotate(-7 568 432)"/>
        <rect x="871" y="430" width="165" height="26" rx="6" transform="rotate(6 871 430)"/>
      </g>
      <rect x="528" y="293" width="165" height="92" rx="8" fill="#111318" stroke="#f0c35c" stroke-width="4"/>
      <text x="610" y="326" text-anchor="middle" font-family="Arial Black" font-size="21" fill="#f0c35c">KENDAL CALLING</text>
      <text x="610" y="352" text-anchor="middle" font-family="Arial" font-weight="700" font-size="13" fill="#eee6dc">MUD · HATS · REGRET</text>
    </g>

    <!-- BEHBEH SHOP -->
    <g filter="url(#shadow)">
      <rect x="1210" y="624" width="355" height="250" rx="12" fill="#343a42" stroke="#15151a" stroke-width="10"/>
      <rect x="1234" y="650" width="304" height="58" rx="7" fill="#15171d" stroke="#ebcadb" stroke-width="3"/>
      <text x="1386" y="689" text-anchor="middle" font-family="Arial Black" font-size="34" fill="#f5e9ef">BEHBEH SHOP</text>
      <rect x="1242" y="730" width="118" height="136" fill="url(#glass)" stroke="#111318" stroke-width="6"/>
      <rect x="1378" y="730" width="150" height="136" fill="url(#glass)" stroke="#111318" stroke-width="6"/>
      <g fill="#e5bf62"><rect x="1400" y="753" width="28" height="33"/><rect x="1436" y="753" width="28" height="33"/><rect x="1473" y="753" width="28" height="33"/></g>
      <text x="1452" y="824" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#f4f1ec">MILK · CRISPS · VAPES · REGRETS</text>
    </g>

    <!-- TURKISH -->
    <g filter="url(#shadow)">
      <rect x="662" y="684" width="320" height="190" rx="18" fill="#1d3132" stroke="#111318" stroke-width="10"/>
      <rect x="686" y="708" width="270" height="60" rx="9" fill="#11151a" stroke="#dfb85b" stroke-width="4"/>
      <text x="821" y="748" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="38" fill="#e9c56f">THE TURKISH</text>
      <g fill="#d07744"><circle cx="711" cy="810" r="14"/><circle cx="756" cy="810" r="14"/><circle cx="801" cy="810" r="14"/><circle cx="846" cy="810" r="14"/><circle cx="891" cy="810" r="14"/><circle cx="936" cy="810" r="14"/></g>
      <path d="M696 790H947" stroke="#f6d190" stroke-width="5"/>
    </g>

    <!-- CAR -->
    <g transform="translate(254 700)" filter="url(#shadow)">
      <ellipse cx="0" cy="67" rx="130" ry="29" fill="#000" opacity=".35"/>
      <path d="M-131 7 Q-105-58 -48-79 H50 Q102-61 125 3 L133 50 Q103 77 71 76 H-81 Q-118 72-135 49Z" fill="#2d6077" stroke="#111318" stroke-width="8"/>
      <path d="M-72 -60H50Q75-48 93-18H-95Q-87-43-72-60Z" fill="#132b38" stroke="#8db5c3" stroke-width="4"/>
      <rect x="-105" y="8" width="205" height="42" rx="16" fill="#356e86"/>
      <circle cx="-87" cy="58" r="31" fill="#111318"/><circle cx="88" cy="58" r="31" fill="#111318"/>
      <circle cx="-87" cy="58" r="14" fill="#9aa5ae"/><circle cx="88" cy="58" r="14" fill="#9aa5ae"/>
    </g>
    <rect x="84" y="790" width="230" height="56" rx="9" fill="#191b22" opacity=".94"/>
    <text x="199" y="826" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="28" fill="#e5e9ef">LEYLAND ROAD</text>

    <!-- lamps / ambience -->
    <g>
      <circle cx="520" cy="528" r="82" fill="url(#lamp)"/><rect x="512" y="493" width="15" height="105" fill="#16181d"/><rect x="494" y="487" width="51" height="12" rx="6" fill="#16181d"/>
      <circle cx="1096" cy="542" r="82" fill="url(#lamp)"/><rect x="1089" y="505" width="15" height="100" fill="#16181d"/><rect x="1070" y="500" width="53" height="12" rx="6" fill="#16181d"/>
      <circle cx="960" cy="621" r="60" fill="url(#lamp)" opacity=".65"/>
    </g>

    <!-- bunting -->
    <path d="M505 120 Q790 172 1066 114" fill="none" stroke="#f1d6a0" stroke-width="3" opacity=".6"/>
    <g fill="#cf5d72"><path d="M570 136l18 28 18-23z"/><path d="M688 151l18 28 18-24z"/></g>
    <g fill="#d8b653"><path d="M628 145l18 28 18-24z"/><path d="M866 149l18 28 18-24z"/></g>
    <g fill="#5da4a5"><path d="M805 153l18 28 18-24z"/><path d="M955 137l18 28 18-23z"/></g>

    <text x="800" y="610" text-anchor="middle" font-family="Arial Black" font-size="17" fill="#d8dbc8" opacity=".7">WEIRD FRIENDS GREEN</text>
  </svg>`;

  const tap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
    ${common}
    <rect width="1200" height="700" fill="#211a22"/>
    <rect y="0" width="1200" height="285" fill="url(#brick)"/>
    <rect y="0" width="1200" height="285" fill="url(#brickPattern)"/>
    <rect x="345" y="48" width="510" height="92" rx="12" fill="#101217" stroke="#c69b59" stroke-width="4"/>
    <text x="600" y="109" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="51" fill="#d9af63">TAP &amp; VINE</text>
    <g filter="url(#shadow)">
      <rect x="70" y="230" width="1060" height="222" rx="22" fill="url(#wood)" stroke="#111318" stroke-width="10"/>
      <rect x="52" y="215" width="1096" height="38" rx="14" fill="#b47a48" stroke="#151419" stroke-width="8"/>
      <g stroke="#17171b" stroke-width="11"><path d="M485 215V323"/><path d="M555 215V323"/><path d="M625 215V323"/><path d="M695 215V323"/></g>
      <g fill="#dfb558"><circle cx="485" cy="330" r="16"/><circle cx="555" cy="330" r="16"/><circle cx="625" cy="330" r="16"/><circle cx="695" cy="330" r="16"/></g>
      <g fill="url(#glass)" stroke="#171319" stroke-width="6"><rect x="118" y="282" width="160" height="120"/><rect x="914" y="282" width="160" height="120"/></g>
    </g>
    <g fill="#574032" stroke="#111318" stroke-width="8">
      <ellipse cx="240" cy="560" rx="128" ry="72"/>
      <ellipse cx="600" cy="570" rx="135" ry="76"/>
      <ellipse cx="965" cy="550" rx="128" ry="72"/>
    </g>
    <g fill="#c88b4b"><circle cx="214" cy="536" r="10"/><circle cx="572" cy="545" r="10"/><circle cx="938" cy="526" r="10"/></g>
    <rect x="858" y="88" width="260" height="92" rx="12" fill="#15151c" stroke="#ff4fa3" stroke-width="4"/>
    <text x="988" y="122" text-anchor="middle" font-family="Arial Black" font-size="22" fill="#f2c65e">KENDAL CALLING</text>
    <text x="988" y="151" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#f5efe8">mud was a personality trait</text>
    <rect x="75" y="70" width="245" height="96" rx="12" fill="#15151c" stroke="#5f5568" stroke-width="4"/>
    <text x="197" y="107" text-anchor="middle" font-family="Arial Black" font-size="17" fill="#f5efe8">WILL'S PHILOSOPHY</text>
    <text x="197" y="137" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#b6ff3b">when you're in the Tap,</text>
    <text x="197" y="158" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#b6ff3b">you're a pub</text>
    <rect x="510" y="634" width="180" height="36" rx="18" fill="#0e1016" stroke="#ffffff25" stroke-width="2"/>
    <text x="600" y="658" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#ddd5cd">DOOR → PENWORTHAM</text>
  </svg>`;

  const shop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
    ${common}
    <rect width="1200" height="700" fill="#263033"/>
    <rect x="40" y="35" width="1120" height="630" rx="28" fill="#d8d1c5" stroke="#15151a" stroke-width="12"/>
    <rect x="70" y="62" width="1060" height="80" rx="13" fill="#172225"/>
    <text x="600" y="116" text-anchor="middle" font-family="Arial Black" font-size="40" fill="#f0eee8">BEHBEH SHOP</text>
    <g filter="url(#shadow)">
      <rect x="92" y="180" width="300" height="384" rx="20" fill="#36525a" stroke="#15151a" stroke-width="9"/>
      <g fill="#dcecee" stroke="#718f9a" stroke-width="5"><rect x="126" y="215" width="232" height="95" rx="8"/><rect x="126" y="330" width="232" height="95" rx="8"/><rect x="126" y="445" width="232" height="95" rx="8"/></g>
      <g fill="#eef4f1" stroke="#65a5c4" stroke-width="4"><rect x="164" y="238" width="52" height="70" rx="5"/><rect x="233" y="238" width="52" height="70" rx="5"/><rect x="201" y="352" width="52" height="70" rx="5"/></g>
      <text x="242" y="594" text-anchor="middle" font-family="Arial Black" font-size="19" fill="#20333a">MILK FRIDGE</text>
    </g>
    <g filter="url(#shadow)">
      <rect x="470" y="190" width="295" height="360" rx="18" fill="#705844" stroke="#15151a" stroke-width="9"/>
      <path d="M495 285H740M495 382H740M495 480H740" stroke="#a68b6d" stroke-width="8"/>
      <g fill="#d66b62"><rect x="520" y="224" width="48" height="38"/><rect x="594" y="224" width="62" height="38"/><rect x="677" y="224" width="40" height="38"/></g>
      <g fill="#d7ae4c"><rect x="520" y="321" width="52" height="38"/><rect x="596" y="321" width="52" height="38"/><rect x="674" y="321" width="44" height="38"/></g>
      <g fill="#659468"><rect x="520" y="419" width="50" height="38"/><rect x="595" y="419" width="58" height="38"/><rect x="678" y="419" width="38" height="38"/></g>
    </g>
    <g filter="url(#shadow)">
      <rect x="824" y="188" width="278" height="178" rx="18" fill="#5e493b" stroke="#15151a" stroke-width="9"/>
      <rect x="858" y="230" width="210" height="62" rx="9" fill="#202329"/>
      <text x="963" y="270" text-anchor="middle" font-family="Arial Black" font-size="24" fill="#f5efe8">TILL</text>
    </g>
    <rect x="806" y="426" width="312" height="106" rx="17" fill="#1d2123" stroke="#b6ff3b" stroke-width="3"/>
    <text x="962" y="460" text-anchor="middle" font-family="Arial Black" font-size="18" fill="#b6ff3b">NO, YOU DON'T NEED</text>
    <text x="962" y="486" text-anchor="middle" font-family="Arial Black" font-size="18" fill="#b6ff3b">ANOTHER COFFEE</text>
    <text x="962" y="514" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="#ddd6cc">this sign knows exactly who it means</text>
    <rect x="510" y="618" width="180" height="34" rx="17" fill="#111318"/>
    <text x="600" y="641" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#e9e3da">DOOR → OUT</text>
  </svg>`;

  const turkish = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
    ${common}
    <rect width="1200" height="700" fill="#182d31"/>
    <rect y="0" width="1200" height="205" fill="#23494d"/>
    <g opacity=".5" fill="none" stroke="#6caeb2" stroke-width="3">
      ${Array.from({length:13},(_,i)=>`<circle cx="${45+i*95}" cy="102" r="38"/><path d="M${45+i*95} 64l38 38-38 38-38-38z"/>`).join('')}
    </g>
    <rect x="330" y="52" width="540" height="100" rx="16" fill="#12151a" stroke="#ddb65a" stroke-width="5"/>
    <text x="600" y="112" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="48" fill="#edd08c">THE TURKISH</text>
    <g fill="#714c35" stroke="#141318" stroke-width="8" filter="url(#shadow)">
      <ellipse cx="265" cy="480" rx="170" ry="92"/><ellipse cx="600" cy="520" rx="175" ry="96"/><ellipse cx="940" cy="465" rx="165" ry="90"/>
    </g>
    <g fill="#e7ddca" stroke="#4a352b" stroke-width="4"><ellipse cx="265" cy="458" rx="90" ry="38"/><ellipse cx="600" cy="496" rx="95" ry="40"/><ellipse cx="940" cy="444" rx="88" ry="37"/></g>
    <g fill="#bd5f43"><circle cx="233" cy="456" r="16"/><circle cx="292" cy="450" r="15"/><circle cx="563" cy="496" r="17"/><circle cx="630" cy="490" r="16"/><circle cx="916" cy="444" r="16"/></g>
    <g fill="#709350"><circle cx="319" cy="462" r="13"/><circle cx="668" cy="500" r="13"/><circle cx="968" cy="449" r="13"/></g>
    <g filter="url(#shadow)">
      <rect x="80" y="245" width="305" height="98" rx="16" fill="#17151b" stroke="#675856" stroke-width="4"/>
      <text x="232" y="281" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#e9c66d">ORDERED FOR TWO</text>
      <text x="232" y="311" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#f1ede7">food suitable for a minor wedding</text>
    </g>
    <rect x="510" y="638" width="180" height="34" rx="17" fill="#111318"/>
    <text x="600" y="661" text-anchor="middle" font-family="Arial Black" font-size="14" fill="#e9e3da">DOOR → OUT</text>
  </svg>`;

  const kendal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 800">
    ${common}
    <rect width="1400" height="800" fill="#1e3429"/>
    <rect y="520" width="1400" height="280" fill="#63564a"/>
    <circle cx="1120" cy="126" r="118" fill="#e7b15a" opacity=".23"/>
    <g filter="url(#shadow)">
      <path d="M80 590L285 255 490 590Z" fill="#a95782" stroke="#111318" stroke-width="10"/>
      <path d="M490 600L700 286 910 600Z" fill="#5b82a2" stroke="#111318" stroke-width="10"/>
      <path d="M910 590L1125 248 1340 590Z" fill="#c5a04c" stroke="#111318" stroke-width="10"/>
    </g>
    <rect x="360" y="55" width="680" height="140" rx="22" fill="#12151b" stroke="#e6be63" stroke-width="6"/>
    <text x="700" y="118" text-anchor="middle" font-family="Arial Black" font-size="58" fill="#f4eee6">KENDAL CALLING</text>
    <text x="700" y="159" text-anchor="middle" font-family="Arial Black" font-size="22" fill="#ff4fa3">MUD · BUCKET HATS · SUSPICIOUS DECISIONS</text>
    <g stroke="#d7c6a3" stroke-width="3" opacity=".8"><path d="M60 210Q700 310 1340 205"/></g>
    <g fill="#e9c65d"><path d="M180 231l18 28 18-23z"/><path d="M370 251l18 28 18-23z"/><path d="M840 251l18 28 18-23z"/></g>
    <g fill="#ff4fa3"><path d="M280 243l18 28 18-23z"/><path d="M980 238l18 28 18-23z"/></g>
    <g fill="#6ab0b0"><path d="M530 260l18 28 18-23z"/><path d="M1170 226l18 28 18-23z"/></g>
    <rect x="312" y="670" width="776" height="72" rx="20" fill="#111318" stroke="#62566a" stroke-width="4"/>
    <text x="700" y="714" text-anchor="middle" font-family="Arial Black" font-size="24" fill="#b6ff3b">PARKING: STILL SPIRITUALLY UNRESOLVED</text>
  </svg>`;

  const hero = (who,step=0) => {
    const laura = who === 'laura';
    const swing = step ? 1 : -1;
    const accent = laura ? '#ff4fa3' : '#b6ff3b';

    return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360">
      <defs>
        <linearGradient id="skin2" x1="0" y1="0" x2=".85" y2="1">
          <stop stop-color="#f1c7a9"/><stop offset=".52" stop-color="#d69a79"/><stop offset="1" stop-color="#b96e55"/>
        </linearGradient>
        <linearGradient id="rickTop" x1="0" y1="0" x2=".8" y2="1">
          <stop stop-color="#4b8b69"/><stop offset=".5" stop-color="#2c654b"/><stop offset="1" stop-color="#163b2d"/>
        </linearGradient>
        <linearGradient id="lauraTop" x1="0" y1="0" x2=".8" y2="1">
          <stop stop-color="#343039"/><stop offset=".55" stop-color="#1f1d23"/><stop offset="1" stop-color="#0d0c10"/>
        </linearGradient>
        <linearGradient id="jeans2" x1="0" y1="0" x2=".7" y2="1">
          <stop stop-color="#36404e"/><stop offset=".6" stop-color="#222936"/><stop offset="1" stop-color="#151a24"/>
        </linearGradient>
        <linearGradient id="hairRick" x1="0" y1="0" x2=".7" y2="1">
          <stop stop-color="#59403d"/><stop offset=".5" stop-color="#34272d"/><stop offset="1" stop-color="#1a151a"/>
        </linearGradient>
        <linearGradient id="hairLaura" x1="0" y1="0" x2=".7" y2="1">
          <stop stop-color="#f1d88e"/><stop offset=".55" stop-color="#d8b45f"/><stop offset="1" stop-color="#a97c32"/>
        </linearGradient>
        <filter id="heroShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="11" stdDeviation="7" flood-color="#000" flood-opacity=".38"/>
        </filter>
      </defs>

      <ellipse cx="120" cy="336" rx="55" ry="13" fill="#000" opacity=".22"/>

      <g filter="url(#heroShadow)">
        <!-- legs -->
        <path d="M95 221 C92 251 \${91+swing*5} 286 \${88+swing*4} 318" fill="none" stroke="url(#jeans2)" stroke-width="22" stroke-linecap="round"/>
        <path d="M145 221 C148 250 \${150-swing*5} 286 \${152-swing*4} 318" fill="none" stroke="url(#jeans2)" stroke-width="22" stroke-linecap="round"/>
        <path d="M72 \${315+swing*4} Q88 306 107 318 L105 336 H75 Q66 329 72 \${315+swing*4}Z" fill="\${laura?'#16161b':'#e1e7ec'}" stroke="#151218" stroke-width="5"/>
        <path d="M133 \${318-swing*4} Q153 307 169 321 Q175 329 168 337 H135Z" fill="\${laura?'#101014':'#d4dbe1'}" stroke="#151218" stroke-width="5"/>
        <path d="M80 316 L104 316M137 319 L163 319" stroke="\${laura?'#38343d':'#7ba7c0'}" stroke-width="4" opacity=".7"/>

        <!-- torso -->
        <path d="M78 125 Q119 105 161 126 L154 225 Q120 244 84 225Z" fill="\${laura?'url(#lauraTop)':'url(#rickTop)'}" stroke="#151218" stroke-width="6"/>
        <path d="M88 133 Q119 122 151 135" fill="none" stroke="#ffffff1f" stroke-width="3"/>

        <!-- arms -->
        <path d="M84 145 C64 164 58 190 \${62+swing*4} 222" fill="none" stroke="url(#skin2)" stroke-width="18" stroke-linecap="round"/>
        <path d="M156 145 C176 164 182 191 \${178-swing*4} 222" fill="none" stroke="url(#skin2)" stroke-width="18" stroke-linecap="round"/>
        <path d="M58 211 q-5 17 6 23 q13 3 13-10" fill="url(#skin2)" stroke="#151218" stroke-width="4"/>
        <path d="M182 211 q5 17-6 23 q-13 3-13-10" fill="url(#skin2)" stroke="#151218" stroke-width="4"/>

        \${laura ? \`
          <g stroke-linecap="round">
            <path d="M61 161 l17 11 M59 176 l18 8 M60 191 l17 9 M62 207 l13 7" stroke="#4a91b0" stroke-width="4"/>
            <path d="M69 153 l-9 60" stroke="#bf4e87" stroke-width="4"/>
            <path d="M66 166 l-7 12 M71 183 l-9 14 M70 199 l-8 12" stroke="#7254a0" stroke-width="3"/>
          </g>
        \` : ''}

        <!-- neck -->
        <path d="M102 112 V132 H138 V110" fill="url(#skin2)" stroke="#151218" stroke-width="5"/>

        <!-- head / face, three-quarter so the sprite has identity rather than a blank bean -->
        <ellipse cx="120" cy="82" rx="36" ry="42" fill="url(#skin2)" stroke="#151218" stroke-width="5"/>
        <path d="M111 78 q8-4 16 0" stroke="#5b3d36" stroke-width="3" fill="none" stroke-linecap="round"/>
        <ellipse cx="112" cy="82" rx="3.2" ry="2.7" fill="#291e1e"/>
        <ellipse cx="133" cy="81" rx="3.1" ry="2.6" fill="#291e1e"/>
        <path d="M128 88 q5 4 1 8" stroke="#9a604f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M112 104 Q123 111 134 102" stroke="#8d4a45" stroke-width="3" fill="none" stroke-linecap="round"/>

        \${laura ? \`
          <!-- Laura: long blonde hair + floral festival hat -->
          <path d="M88 72 Q80 109 86 155 L103 133 Q95 106 100 77Z" fill="url(#hairLaura)" stroke="#151218" stroke-width="4"/>
          <path d="M151 70 Q161 112 151 158 L134 134 Q143 105 139 77Z" fill="url(#hairLaura)" stroke="#151218" stroke-width="4"/>
          <path d="M94 96 Q87 131 101 160 M112 94 Q105 133 116 164 M139 94 Q149 129 137 159" stroke="#f3da96" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>
          <ellipse cx="120" cy="51" rx="48" ry="17" fill="#ece5d7" stroke="#151218" stroke-width="5"/>
          <path d="M83 48 Q91 19 120 17 Q149 20 157 49Z" fill="#f3eadb" stroke="#151218" stroke-width="5"/>
          <g>
            <circle cx="96" cy="38" r="9" fill="#d84e78"/><circle cx="120" cy="28" r="9" fill="#e8bd4f"/><circle cx="143" cy="40" r="9" fill="#d84e78"/>
            <circle cx="107" cy="47" r="6" fill="#78a659"/><circle cx="134" cy="30" r="6" fill="#78a659"/>
          </g>
        \` : \`
          <!-- Rick: styled dark hair and beard -->
          <path d="M84 76 Q85 39 116 28 Q151 22 158 63 Q145 50 134 49 Q114 39 95 55Z" fill="url(#hairRick)" stroke="#151218" stroke-width="5"/>
          <path d="M92 43 Q111 23 139 28 M96 51 Q119 32 150 40" stroke="#6f4e49" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
          <path d="M88 91 Q91 121 119 132 Q148 120 151 91 Q146 125 134 138 Q118 151 99 139 Q88 124 88 91Z" fill="#3a2a2e"/>
          <path d="M102 98 Q119 110 137 98 Q131 119 119 122 Q107 118 102 98Z" fill="#d29a7a"/>
        \`}
      </g>
    </svg>\`;
  };
  const npc = (kind) => {
    const c = {
      will:{skin:'#d59b7b', top:'#24242a', pants:'#272b33'},
      denise:{skin:'#dca483', top:'#4b3544', pants:'#30323a'},
      dad:{skin:'#ddb08f', top:'#1b1c20', pants:'#292b31'},
      fats:{skin:'#d19a78', top:'#17191e', pants:'#24262d'}
    }[kind];

    const stocky = kind === 'dad';
    const denise = kind === 'denise';
    const will = kind === 'will';
    const fats = kind === 'fats';

    return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360">
      <defs>
        <linearGradient id="nSkin" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#efc3a4"/><stop offset="1" stop-color="\${c.skin}"/></linearGradient>
        <linearGradient id="nTop" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="\${denise?'#67465d':will?'#3a3a42':stocky?'#313238':'#30333b'}"/><stop offset="1" stop-color="\${c.top}"/></linearGradient>
        <linearGradient id="nPants" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#3a4049"/><stop offset="1" stop-color="\${c.pants}"/></linearGradient>
        <filter id="ns"><feDropShadow dx="0" dy="10" stdDeviation="6" flood-color="#000" flood-opacity=".34"/></filter>
      </defs>
      <ellipse cx="120" cy="337" rx="\${stocky?59:51}" ry="13" fill="#000" opacity=".22"/>
      <g filter="url(#ns)">
        <!-- legs, Dad is visibly shorter and stockier -->
        <path d="M99 \${stocky?235:226} L96 316" stroke="url(#nPants)" stroke-width="\${stocky?25:20}" stroke-linecap="round"/>
        <path d="M141 \${stocky?235:226} L144 316" stroke="url(#nPants)" stroke-width="\${stocky?25:20}" stroke-linecap="round"/>
        <path d="M80 314 Q98 306 113 318 L110 336 H82 Q73 329 80 314Z" fill="#d9dce0" stroke="#151218" stroke-width="5"/>
        <path d="M128 318 Q147 307 164 321 Q171 329 163 337 H130Z" fill="#d3d6da" stroke="#151218" stroke-width="5"/>

        <!-- body -->
        <path d="M\${stocky?72:82} 146 Q120 129 \${stocky?168:158} 146 L\${stocky?160:153} \${stocky?238:228} Q120 \${stocky?252:241} \${stocky?80:87} \${stocky?238:228}Z" fill="url(#nTop)" stroke="#151218" stroke-width="6"/>
        <path d="M\${stocky?81:88} 156 C\${stocky?58:67} 179 \${stocky?59:68} 214 \${stocky?64:70} 230" fill="none" stroke="url(#nSkin)" stroke-width="\${stocky?18:16}" stroke-linecap="round"/>
        <path d="M\${stocky?159:152} 156 C\${stocky?182:173} 179 \${stocky?181:172} 214 \${stocky?176:170} 230" fill="none" stroke="url(#nSkin)" stroke-width="\${stocky?18:16}" stroke-linecap="round"/>

        <!-- neck -->
        <path d="M103 116 V148 H137 V115" fill="url(#nSkin)" stroke="#151218" stroke-width="5"/>

        <!-- head -->
        <ellipse cx="120" cy="\${stocky?91:88}" rx="\${stocky?39:35}" ry="\${stocky?42:39}" fill="url(#nSkin)" stroke="#151218" stroke-width="5"/>

        \${will ? \`
          <path d="M86 83 Q88 47 120 40 Q154 43 157 83 Q145 67 132 65 Q112 56 94 68Z" fill="#33262a" stroke="#151218" stroke-width="5"/>
          <path d="M151 82 Q181 88 177 132 Q160 115 148 110Z" fill="#33262a" stroke="#151218" stroke-width="5"/>
          <path d="M96 55 Q117 43 143 49" stroke="#594047" stroke-width="5" fill="none" stroke-linecap="round"/>
          <g fill="none" stroke="#333943" stroke-width="5"><circle cx="106" cy="89" r="13"/><circle cx="135" cy="89" r="13"/><path d="M119 89h4"/></g>
          <path d="M97 111 Q120 127 144 109 Q139 133 120 138 Q103 133 97 111Z" fill="#4a3131" opacity=".9"/>
          <path d="M96 178 L145 178 L151 228 L88 228Z" fill="#17181c" opacity=".75"/>
          <path d="M101 188h39" stroke="#f0eee7" stroke-width="2" opacity=".45"/>
        \` : ''}

        \${denise ? \`
          <path d="M84 81 Q87 47 120 41 Q157 43 160 84 Q147 67 133 66 Q112 57 93 71Z" fill="#4b2e31" stroke="#151218" stroke-width="5"/>
          <path d="M87 74 Q72 115 84 158 L101 130 Q91 104 96 79Z" fill="#4b2e31" stroke="#151218" stroke-width="4"/>
          <path d="M155 75 Q169 116 156 158 L139 130 Q149 105 144 79Z" fill="#4b2e31" stroke="#151218" stroke-width="4"/>
          <g>
            <circle cx="95" cy="52" r="10" fill="#e9c352"/><circle cx="116" cy="42" r="11" fill="#d65377"/><circle cx="138" cy="47" r="10" fill="#e9c352"/>
            <circle cx="106" cy="57" r="6" fill="#65a05e"/><circle cx="148" cy="58" r="6" fill="#65a05e"/>
          </g>
          <circle cx="81" cy="110" r="5" fill="#d8a54c"/><circle cx="159" cy="110" r="5" fill="#d8a54c"/>
          <path d="M89 178 H151 V232 H89Z" fill="#222329" opacity=".76"/>
          <path d="M110 201 q10 9 20 0" fill="none" stroke="#f0d1a0" stroke-width="3"/>
        \` : ''}

        \${stocky ? \`
          <path d="M85 84 Q91 54 120 50 Q151 53 156 86 Q142 71 132 69 Q112 63 94 72Z" fill="#d4cfc9"/>
          <path d="M86 82 L86 109 M155 82 L155 109" stroke="#bbb5ae" stroke-width="10"/>
          <g fill="none" stroke="#9a4147" stroke-width="6"><circle cx="105" cy="92" r="14"/><circle cx="135" cy="92" r="14"/><path d="M119 92h3"/></g>
          <g transform="translate(181 194)">
            <path d="M-17-43h34v47q0 22-17 22t-17-22z" fill="#c58a3e" stroke="#efe4c9" stroke-width="4"/>
            <path d="M-18-40h36" stroke="#fff7df" stroke-width="6"/>
            <path d="M17-24 q18 2 13 19 q-4 11-15 10" fill="none" stroke="#efe4c9" stroke-width="4"/>
          </g>
        \` : ''}

        \${fats ? \`
          <path d="M86 81 Q89 45 121 39 Q155 40 160 80 Q145 65 132 65 Q111 55 94 69Z" fill="#202026" stroke="#151218" stroke-width="5"/>
          <path d="M98 55 Q119 40 145 48" stroke="#45434a" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M92 153 L148 153 L159 228 L81 228Z" fill="#111319" stroke="#151218" stroke-width="4"/>
          <path d="M95 159 l-10 59 M145 159 l10 59" stroke="#40444d" stroke-width="4"/>
          <path d="M104 109 Q120 98 138 110" fill="none" stroke="#81394c" stroke-width="5" stroke-linecap="round"/>
          <path d="M108 105 Q120 111 132 105" fill="none" stroke="#3a292b" stroke-width="2"/>
        \` : ''}

        <!-- facial features -->
        <ellipse cx="108" cy="\${stocky?92:89}" rx="3.2" ry="2.6" fill="#22191b"/>
        <ellipse cx="134" cy="\${stocky?92:89}" rx="3.2" ry="2.6" fill="#22191b"/>
        \${!fats ? \`<path d="M106 111 Q120 121 136 110" fill="none" stroke="#7e4940" stroke-width="3" stroke-linecap="round"/>\` : ''}
      </g>
    </svg>\`;
  };
  window.PAD_ART={
    town:data(town),
    tap:data(tap),
    shop:data(shop),
    turkish:data(turkish),
    kendal:data(kendal),
    hero:{
      rick:[data(hero('rick',0)),data(hero('rick',1))],
      laura:[data(hero('laura',0)),data(hero('laura',1))]
    },
    npc:{
      will:data(npc('will')),
      denise:data(npc('denise')),
      dad:data(npc('dad')),
      fats:data(npc('fats'))
    }
  };
})();