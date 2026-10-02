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
    const isLaura=who==='laura';
    const hair=isLaura?'#e6bd68':'#39262b';
    const top=isLaura?'#18181d':'#286244';
    const pants='#202631';
    const skin='#d99b79';
    const shoe=isLaura?'#111116':'#dce4ea';
    const swing=step?8:-8;
    const hat=isLaura ? `
      <ellipse cx="108" cy="55" rx="47" ry="18" fill="#efe7d5" stroke="#161318" stroke-width="5"/>
      <path d="M73 49Q81 20 108 18Q136 20 145 50Z" fill="#f0e7d7" stroke="#161318" stroke-width="5"/>
      <g fill="#d64f78"><circle cx="88" cy="38" r="8"/><circle cx="113" cy="30" r="8"/><circle cx="132" cy="42" r="8"/></g>
    `:'';
    const tats=isLaura? `
      <g stroke-linecap="round"><path d="M54 132l15 11M51 145l17 9M56 157l12 8" stroke="#5aa0b8" stroke-width="5"/><path d="M62 125l-8 37" stroke="#bc4f84" stroke-width="4"/></g>
    `:'';
    const beard=!isLaura? `<path d="M73 77Q77 115 108 126Q139 114 145 78Q142 111 131 129Q108 147 85 129Q73 111 73 77Z" fill="#3b2a2d" opacity=".95"/>`:'';
    const longHair=isLaura? `
      <path d="M72 63Q56 103 68 154L89 133Q76 101 83 68Z" fill="${hair}" stroke="#171318" stroke-width="4"/>
      <path d="M145 63Q160 103 148 154L127 133Q140 101 133 68Z" fill="${hair}" stroke="#171318" stroke-width="4"/>
      <path d="M83 84Q79 124 95 153M107 83Q102 130 111 155M130 83Q139 124 128 152" fill="none" stroke="#f5d68c" stroke-width="8" stroke-linecap="round"/>
    `:'';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 320">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#efbea0"/><stop offset="1" stop-color="#bd775b"/></linearGradient>
        <linearGradient id="shirt" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${isLaura?'#39333f':'#438061'}"/><stop offset="1" stop-color="${top}"/></linearGradient>
        <filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#000" flood-opacity=".35"/></filter>
      </defs>
      <ellipse cx="110" cy="295" rx="50" ry="12" fill="#000" opacity=".22"/>
      <g filter="url(#s)">
        <path d="M91 205L${88+swing/4} 276" stroke="${pants}" stroke-width="22" stroke-linecap="round"/>
        <path d="M129 205L${132-swing/4} 276" stroke="${pants}" stroke-width="22" stroke-linecap="round"/>
        <path d="M73 274Q90 266 109 277L106 294H76Q68 286 73 274Z" fill="${shoe}" stroke="#161318" stroke-width="4"/>
        <path d="M117 277Q138 268 153 281Q158 288 151 295H119Z" fill="${shoe}" stroke="#161318" stroke-width="4"/>
        <path d="M74 129Q110 114 146 129L141 211Q111 229 79 210Z" fill="url(#shirt)" stroke="#161318" stroke-width="5"/>
        <path d="M80 145Q58 166 61 ${202+swing}" fill="none" stroke="url(#skin)" stroke-width="16" stroke-linecap="round"/>
        <path d="M140 145Q162 166 159 ${202-swing}" fill="none" stroke="url(#skin)" stroke-width="16" stroke-linecap="round"/>
        ${tats}
        <ellipse cx="110" cy="79" rx="42" ry="46" fill="url(#skin)" stroke="#161318" stroke-width="5"/>
        ${!isLaura? `<path d="M69 77Q73 36 108 29Q145 28 151 70Q136 52 121 53Q102 43 79 61Z" fill="${hair}" stroke="#161318" stroke-width="4"/>`:''}
        ${hat}
        ${longHair}
        ${beard}
        ${!isLaura? `<path d="M88 135Q110 145 135 135" stroke="#ffffff20" stroke-width="3" fill="none"/>`:''}
      </g>
    </svg>`;
  };

  const npc = (kind) => {
    const cfg={
      will:{skin:'#d79b79',hair:'#332629',shirt:'#24242a',pants:'#272933',body:58},
      denise:{skin:'#dca381',hair:'#4a2d2e',shirt:'#503544',pants:'#30313a',body:70},
      dad:{skin:'#ddb08f',hair:'#c9c2bb',shirt:'#1b1b20',pants:'#292a31',body:80},
      fats:{skin:'#d19a78',hair:'#212026',shirt:'#17181d',pants:'#25262d',body:54}
    }[kind];
    const glasses=kind==='will'? `<g fill="none" stroke="#30343c" stroke-width="5"><circle cx="94" cy="91" r="15"/><circle cx="126" cy="91" r="15"/><path d="M109 91h3"/></g>`
      :kind==='dad'? `<g fill="none" stroke="#9c3f46" stroke-width="6"><circle cx="94" cy="91" r="15"/><circle cx="126" cy="91" r="15"/><path d="M109 91h3"/></g>`:'';
    const hair=kind==='dad'
      ?`<path d="M70 85Q76 52 110 49Q145 52 151 87Q137 70 125 69Q105 62 84 72Z" fill="#d5d0ca"/>`
      :kind==='will'
      ?`<path d="M69 82Q73 46 109 42Q146 44 152 85Q139 68 126 67Q104 58 81 72Z" fill="#332629" stroke="#161318" stroke-width="4"/><path d="M146 83Q174 91 171 132Q158 113 144 107Z" fill="#332629" stroke="#161318" stroke-width="4"/>`
      :kind==='denise'
      ?`<path d="M67 82Q72 47 109 43Q148 45 153 86Q140 69 126 68Q106 58 82 73Z" fill="#4a2d2e" stroke="#161318" stroke-width="4"/><path d="M68 78Q58 120 74 157L89 127Q78 101 82 78Z" fill="#4a2d2e" stroke="#161318" stroke-width="3"/><path d="M151 78Q161 120 145 157L130 127Q141 101 137 78Z" fill="#4a2d2e" stroke="#161318" stroke-width="3"/>`
      :`<path d="M69 81Q73 46 108 42Q145 43 152 83Q138 67 124 67Q103 57 81 72Z" fill="#212026" stroke="#161318" stroke-width="4"/>`;
    const extra=kind==='dad'
      ?`<g transform="translate(165 178)"><path d="M-18-45h36v50q0 23-18 23t-18-23z" fill="#c78b3f" stroke="#eee2c7" stroke-width="4"/><path d="M-19-42h38" stroke="#f4efe7" stroke-width="6"/></g>`
      :kind==='denise'
      ?`<g fill="#f2c84c"><circle cx="80" cy="53" r="10"/><circle cx="100" cy="43" r="10"/><circle cx="122" cy="46" r="10"/></g>`
      :kind==='fats'
      ?`<path d="M92 111Q110 98 128 111" fill="none" stroke="#853c50" stroke-width="5" stroke-linecap="round"/>`
      :'';
    const mouth=kind==='fats'?'':`<path d="M93 112Q110 124 127 112" fill="none" stroke="#804c40" stroke-width="3.5" stroke-linecap="round"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 320">
      <defs><filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#000" flood-opacity=".35"/></filter></defs>
      <ellipse cx="110" cy="294" rx="${kind==='dad'?58:48}" ry="12" fill="#000" opacity=".22"/>
      <g filter="url(#s)">
        <path d="M92 219L89 279" stroke="${cfg.pants}" stroke-width="${kind==='dad'?24:19}" stroke-linecap="round"/>
        <path d="M128 219L131 279" stroke="${cfg.pants}" stroke-width="${kind==='dad'?24:19}" stroke-linecap="round"/>
        <path d="M75 277Q92 269 108 279L105 294H78Q70 287 75 277Z" fill="#d8d9de" stroke="#161318" stroke-width="4"/>
        <path d="M119 279Q137 270 152 281Q157 288 151 295H121Z" fill="#d3d5da" stroke="#161318" stroke-width="4"/>
        <path d="M${110-cfg.body/2} 143Q110 129 ${110+cfg.body/2} 143L${110+cfg.body/2-4} 221Q110 232 ${110-cfg.body/2+4} 221Z" fill="${cfg.shirt}" stroke="#161318" stroke-width="5"/>
        <path d="M${110-cfg.body/2+5} 158Q${110-cfg.body/2-18} 180 ${110-cfg.body/2-15} 214" fill="none" stroke="${cfg.skin}" stroke-width="${kind==='dad'?18:15}" stroke-linecap="round"/>
        <path d="M${110+cfg.body/2-5} 158Q${110+cfg.body/2+18} 180 ${110+cfg.body/2+15} 214" fill="none" stroke="${cfg.skin}" stroke-width="${kind==='dad'?18:15}" stroke-linecap="round"/>
        <ellipse cx="110" cy="93" rx="${kind==='dad'?46:41}" ry="${kind==='dad'?49:44}" fill="${cfg.skin}" stroke="#161318" stroke-width="5"/>
        ${hair}${glasses}
        <ellipse cx="95" cy="91" rx="3.2" ry="2.8" fill="#21191b"/><ellipse cx="125" cy="91" rx="3.2" ry="2.8" fill="#21191b"/>
        ${mouth}${extra}
      </g>
    </svg>`;
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