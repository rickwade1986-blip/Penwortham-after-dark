import fs from 'node:fs';
import path from 'node:path';

const outRoot = path.join(process.cwd(), 'v3', 'art-src');
fs.mkdirSync(path.join(outRoot,'characters'), {recursive:true});
fs.mkdirSync(path.join(outRoot,'rooms'), {recursive:true});

const write=(rel,txt)=>{
  const p=path.join(outRoot,rel);
  fs.mkdirSync(path.dirname(p),{recursive:true});
  fs.writeFileSync(p,txt);
};

const defs=(w,h)=>`
<defs>
  <linearGradient id="skin" x1="0" y1="0" x2=".85" y2="1">
    <stop stop-color="#f0c5aa"/><stop offset="1" stop-color="#c98464"/>
  </linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2=".8" y2="1">
    <stop stop-color="#3f7e5e"/><stop offset=".55" stop-color="#245841"/><stop offset="1" stop-color="#16382d"/>
  </linearGradient>
  <linearGradient id="blacktop" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#48414d"/><stop offset=".48" stop-color="#232027"/><stop offset="1" stop-color="#0d0c10"/>
  </linearGradient>
  <linearGradient id="denim" x1="0" y1="0" x2=".8" y2="1">
    <stop stop-color="#38404b"/><stop offset="1" stop-color="#171b22"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#d6eff6" stop-opacity=".88"/><stop offset="1" stop-color="#6da6b7" stop-opacity=".75"/>
  </linearGradient>
  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="5"/>
  </filter>
  <filter id="drop" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity=".3"/>
  </filter>
</defs>`;

const wrap=(body,w=220,h=320)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs(w,h)}${body}</svg>`;

const eyes=(x1,x2,y)=>`
  <ellipse cx="${x1}" cy="${y}" rx="3.2" ry="2.8" fill="#241a1b"/><circle cx="${x1+1}" cy="${y-1}" r=".8" fill="#fff"/>
  <ellipse cx="${x2}" cy="${y}" rx="3.2" ry="2.8" fill="#241a1b"/><circle cx="${x2+1}" cy="${y-1}" r=".8" fill="#fff"/>
`;

function rick(dir='down',step=0){
  const s=step?1:-1;
  if(dir==='up'){
    return wrap(`
      <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
      <path d="M91 206 L${88+s*3} 279" stroke="#242a34" stroke-width="20" stroke-linecap="round"/>
      <path d="M129 206 L${132-s*3} 279" stroke="#171c24" stroke-width="20" stroke-linecap="round"/>
      <path d="M76 276 Q92 269 108 278 L106 292 H78 Q71 286 76 276Z" fill="#dde2e8" stroke="#17131b" stroke-width="4"/>
      <path d="M120 278 Q136 271 150 280 Q155 287 150 293 H121Z" fill="#cfd5dc" stroke="#17131b" stroke-width="4"/>
      <path d="M76 136 Q110 121 144 136 L140 213 Q110 229 80 213Z" fill="url(#green)" stroke="#17131b" stroke-width="5"/>
      <path d="M82 151 Q63 173 68 ${205+s*5}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
      <path d="M138 151 Q157 173 152 ${205-s*5}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="110" cy="88" rx="40" ry="44" fill="#30232a" stroke="#17131b" stroke-width="5"/>
      <path d="M72 84 Q76 45 108 36 Q144 31 149 75 Q136 61 124 59 Q102 51 78 69Z" fill="#3b2930"/>
      <path d="M88 127 Q110 137 132 127" fill="none" stroke="#6b513e" stroke-width="3"/>
      <path d="M88 142 Q110 150 133 142" fill="none" stroke="#ffffff22" stroke-width="2"/>
    `);
  }
  if(dir==='right'){
    return wrap(`
      <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
      <path d="M94 206 L${90+s*3} 279" stroke="#242a34" stroke-width="20" stroke-linecap="round"/>
      <path d="M126 206 L${132-s*3} 279" stroke="#171c24" stroke-width="20" stroke-linecap="round"/>
      <path d="M77 276 Q92 269 108 278 L106 292 H78 Q71 286 77 276Z" fill="#dde2e8" stroke="#17131b" stroke-width="4"/>
      <path d="M120 278 Q136 271 150 280 Q155 287 150 293 H121Z" fill="#cfd5dc" stroke="#17131b" stroke-width="4"/>
      <path d="M82 136 Q110 123 138 137 L136 213 Q112 227 87 213Z" fill="url(#green)" stroke="#17131b" stroke-width="5"/>
      <path d="M88 151 Q70 170 75 ${204+s*6}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
      <path d="M132 151 Q153 168 153 ${199-s*5}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="112" cy="89" rx="38" ry="43" fill="url(#skin)" stroke="#17131b" stroke-width="5"/>
      <path d="M78 81 Q77 43 109 35 Q144 33 151 68 Q137 54 124 54 Q105 46 87 62Z" fill="#30232a" stroke="#17131b" stroke-width="4"/>
      <path d="M83 92 Q88 121 111 129 Q134 121 143 94 Q140 118 131 132 Q111 147 92 131 Q80 116 83 92Z" fill="#34272a"/>
      <path d="M94 94 Q111 108 128 94 Q124 114 111 117 Q98 113 94 94Z" fill="#d49a78"/>
      <ellipse cx="119" cy="88" rx="3.2" ry="2.8" fill="#241a1b"/><circle cx="120" cy="87" r=".8" fill="#fff"/>
      <path d="M125 105 Q133 111 139 106" fill="none" stroke="#7d463b" stroke-width="3" stroke-linecap="round"/>
      <path d="M98 140 Q112 147 128 141" fill="none" stroke="#ffffff25" stroke-width="2"/>
    `);
  }
  return wrap(`
    <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
    <path d="M91 207 L${88+s*3} 279" stroke="#242a34" stroke-width="20" stroke-linecap="round"/>
    <path d="M129 207 L${132-s*3} 279" stroke="#171c24" stroke-width="20" stroke-linecap="round"/>
    <path d="M76 276 Q92 269 108 278 L106 292 H78 Q71 286 76 276Z" fill="#dde2e8" stroke="#17131b" stroke-width="4"/>
    <path d="M120 278 Q136 271 150 280 Q155 287 150 293 H121Z" fill="#cfd5dc" stroke="#17131b" stroke-width="4"/>
    <path d="M77 136 Q110 121 143 136 L139 214 Q110 228 81 213Z" fill="url(#green)" stroke="#17131b" stroke-width="5"/>
    <path d="M82 151 Q62 170 67 ${206+s*7}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
    <path d="M138 151 Q158 170 153 ${206-s*7}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
    <ellipse cx="110" cy="89" rx="40" ry="44" fill="url(#skin)" stroke="#17131b" stroke-width="5"/>
    <path d="M72 82 Q74 43 108 34 Q144 31 149 71 Q136 53 122 54 Q104 45 83 62Z" fill="#30232a" stroke="#17131b" stroke-width="4"/>
    <path d="M81 92 Q86 121 110 132 Q136 120 141 93 Q140 118 131 134 Q111 148 90 133 Q80 117 81 92Z" fill="#34272a"/>
    <path d="M92 94 Q110 109 128 94 Q123 115 110 118 Q97 114 92 94Z" fill="#d49a78"/>
    ${eyes(96,124,87)}
    <path d="M95 108 Q110 119 126 108" fill="none" stroke="#7b463b" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M86 142 Q110 150 135 142" fill="none" stroke="#ffffff20" stroke-width="2"/>
  `);
}

function laura(dir='down',step=0){
  const s=step?1:-1;
  const legs=`
    <path d="M91 207 L${88+s*3} 278" stroke="#1d1c22" stroke-width="20" stroke-linecap="round"/>
    <path d="M129 207 L${132-s*3} 278" stroke="#111116" stroke-width="20" stroke-linecap="round"/>
    <path d="M77 276 Q93 268 107 278 L105 293 H78 Q71 287 77 276Z" fill="#15151a" stroke="#17131b" stroke-width="4"/>
    <path d="M120 278 Q137 270 150 280 Q155 287 150 293 H121Z" fill="#101014" stroke="#17131b" stroke-width="4"/>`;
  const arms=`
    <path d="M82 150 Q61 171 66 ${204+s*7}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
    <path d="M138 150 Q159 171 154 ${204-s*7}" fill="none" stroke="url(#skin)" stroke-width="15" stroke-linecap="round"/>
    <g stroke-linecap="round" opacity=".95">
      <path d="M65 173 L74 178 M65 185 L75 190 M68 196 L77 201" stroke="#4c90ad" stroke-width="4"/>
      <path d="M70 166 L66 202" stroke="#bf4d86" stroke-width="3"/>
      <path d="M72 171 L64 182 M75 182 L66 193" stroke="#634f9e" stroke-width="3"/>
    </g>`;
  if(dir==='up'){
    return wrap(`
      <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
      ${legs}
      <path d="M76 136 Q110 121 144 136 L139 214 Q110 226 81 214Z" fill="url(#blacktop)" stroke="#17131b" stroke-width="5"/>
      ${arms}
      <ellipse cx="110" cy="87" rx="41" ry="44" fill="#e8c47b" stroke="#17131b" stroke-width="5"/>
      <path d="M73 79 Q76 38 111 31 Q146 29 151 75 Q135 60 122 58 Q101 50 79 66Z" fill="#f0cf8c"/>
      <path d="M76 80 Q63 116 78 151 L93 123 Q82 102 86 82Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
      <path d="M145 79 Q157 115 142 151 L127 123 Q138 102 134 82Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
    `);
  }
  if(dir==='right'){
    return wrap(`
      <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
      ${legs}
      <path d="M88 136 Q111 124 134 137 L132 212 Q112 224 91 212Z" fill="url(#blacktop)" stroke="#17131b" stroke-width="5"/>
      ${arms}
      <ellipse cx="112" cy="89" rx="39" ry="44" fill="url(#skin)" stroke="#17131b" stroke-width="5"/>
      <path d="M77 78 Q79 39 111 32 Q147 30 154 69 Q138 52 126 53 Q104 45 84 61Z" fill="#e8c47b" stroke="#17131b" stroke-width="4"/>
      <path d="M80 69 Q67 114 79 158 L93 129 Q84 99 89 73Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
      <path d="M150 68 Q161 112 147 158 L132 130 Q142 102 137 73Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
      <ellipse cx="122" cy="88" rx="3.2" ry="2.8" fill="#241a1b"/>
      <path d="M126 107 Q135 113 143 106" fill="none" stroke="#87413b" stroke-width="3" stroke-linecap="round"/>
    `);
  }
  return wrap(`
    <ellipse cx="110" cy="292" rx="48" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
    ${legs}
    <path d="M76 136 Q110 121 144 136 L139 214 Q110 226 81 214Z" fill="url(#blacktop)" stroke="#17131b" stroke-width="5"/>
    ${arms}
    <ellipse cx="110" cy="89" rx="40" ry="44" fill="url(#skin)" stroke="#17131b" stroke-width="5"/>
    <path d="M72 79 Q75 38 110 31 Q146 29 151 72 Q136 53 122 54 Q103 44 80 63Z" fill="#e8c47b" stroke="#17131b" stroke-width="4"/>
    <path d="M76 72 Q61 113 77 159 L94 128 Q82 98 87 74Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
    <path d="M145 72 Q159 113 143 159 L126 128 Q138 98 133 74Z" fill="#e8c47b" stroke="#17131b" stroke-width="3"/>
    ${eyes(96,124,87)}
    <path d="M95 107 Q110 119 126 107" fill="none" stroke="#87413b" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M88 143 Q110 150 134 143" fill="none" stroke="#ffffff20" stroke-width="2"/>
  `);
}

function npc(kind){
  const map={
    dad:{skin:'#dfad8d',top:'#1b1b20',pants:'#292a30',hair:'#c8c3bd',body:78,head:45},
    will:{skin:'#dca487',top:'#222329',pants:'#282a31',hair:'#3b2a28',body:58,head:41},
    denise:{skin:'#dfab8b',top:'#40333e',pants:'#303039',hair:'#4b302e',body:66,head:43},
    fats:{skin:'#d29b79',top:'#15161b',pants:'#24252b',hair:'#222129',body:52,head:40},
    andrew:{skin:'#d39d7d',top:'#5d4380',pants:'#24252c',hair:'#2b2630',body:56,head:40}
  };
  const C=map[kind];
  let extras='';
  if(kind==='dad') extras=`
    <path d="M68 87 Q74 54 110 49 Q146 52 152 87 Q142 72 133 69 Q112 63 86 72Z" fill="#d6d1cb"/>
    <path d="M69 83 L70 107 M151 83 L150 107" stroke="#b8b1a8" stroke-width="10"/>
    <g fill="none" stroke="#8f4342" stroke-width="5"><circle cx="94" cy="91" r="14"/><circle cx="126" cy="91" r="14"/><path d="M108 91H112"/></g>`;
  if(kind==='will') extras=`
    <path d="M68 82 Q74 47 109 43 Q146 46 152 86 Q138 69 126 68 Q105 60 82 72Z" fill="#3b2a28" stroke="#17131b" stroke-width="4"/>
    <path d="M146 87 Q173 93 171 132 Q158 114 144 107Z" fill="#3b2a28" stroke="#17131b" stroke-width="4"/>
    <g fill="none" stroke="#343943" stroke-width="4"><circle cx="95" cy="91" r="13"/><circle cx="125" cy="91" r="13"/><path d="M108 91H112"/></g>
    <path d="M85 153 Q110 163 135 153 L137 218 H83Z" fill="#634539" opacity=".55"/>`;
  if(kind==='denise') extras=`
    <path d="M67 82 Q72 48 109 44 Q147 46 153 86 Q140 69 126 68 Q107 59 82 73Z" fill="#4b302e" stroke="#17131b" stroke-width="4"/>
    <path d="M68 79 Q59 121 74 157 L88 127 Q78 102 82 78Z" fill="#4b302e" stroke="#17131b" stroke-width="3"/>
    <path d="M151 79 Q160 121 145 157 L131 127 Q141 102 137 78Z" fill="#4b302e" stroke="#17131b" stroke-width="3"/>
    <circle cx="68" cy="111" r="5" fill="#d2a651"/><circle cx="152" cy="111" r="5" fill="#d2a651"/>
    <path d="M84 158 Q110 169 136 158" stroke="#c44e78" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if(kind==='fats') extras=`
    <path d="M69 81 Q73 47 108 43 Q145 44 151 83 Q138 68 125 68 Q104 58 82 73Z" fill="#222129" stroke="#17131b" stroke-width="4"/>
    <path d="M91 112 Q110 102 129 112" stroke="#6f3343" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M97 108 Q110 113 123 108" stroke="#3c2a2b" stroke-width="2" fill="none"/>
    <g stroke-linecap="round"><path d="M71 184l11 8 M68 195l12 6" stroke="#4b8dad" stroke-width="4"/><path d="M149 184l-11 8 M152 195l-12 6" stroke="#b34f83" stroke-width="4"/></g>`;
  if(kind==='andrew') extras=`
    <path d="M69 81 Q73 48 108 43 Q145 44 151 84 Q136 69 124 68 Q103 59 82 73Z" fill="#2b2630" stroke="#17131b" stroke-width="4"/>
    <path d="M72 56 Q110 28 150 55 L141 68 Q108 48 78 70Z" fill="#d7b14f" stroke="#17131b" stroke-width="4"/>
    <rect x="82" y="162" width="56" height="18" rx="8" fill="#d7b14f"/><text x="110" y="175" text-anchor="middle" font-family="Arial Black" font-size="10" fill="#2f2440">3000</text>`;
  const mouth=kind==='fats'
    ?'<path d="M93 113 Q110 100 127 113" fill="none" stroke="#81384c" stroke-width="4" stroke-linecap="round"/>'
    :'<path d="M94 111 Q110 123 126 111" fill="none" stroke="#7d493d" stroke-width="3.5" stroke-linecap="round"/>';
  return wrap(`
    <ellipse cx="110" cy="294" rx="${kind==='dad'?56:45}" ry="11" fill="#000" opacity=".18" filter="url(#shadow)"/>
    <path d="M92 219 L89 279" stroke="${C.pants}" stroke-width="${kind==='dad'?23:18}" stroke-linecap="round"/>
    <path d="M128 219 L131 279" stroke="${C.pants}" stroke-width="${kind==='dad'?23:18}" stroke-linecap="round"/>
    <path d="M76 277 Q92 269 107 279 L105 293 H78 Q71 287 76 277Z" fill="#d5d7dc" stroke="#17131b" stroke-width="4"/>
    <path d="M120 279 Q137 270 151 280 Q156 287 151 293 H121Z" fill="#d1d3d9" stroke="#17131b" stroke-width="4"/>
    <path d="M${110-C.body/2} 143 Q110 130 ${110+C.body/2} 143 L${110+C.body/2-4} 221 Q110 231 ${110-C.body/2+4} 221Z" fill="${C.top}" stroke="#17131b" stroke-width="5"/>
    <path d="M${110-C.body/2+5} 159 Q${110-C.body/2-18} 180 ${110-C.body/2-16} 213" fill="none" stroke="${C.skin}" stroke-width="${kind==='dad'?17:14}" stroke-linecap="round"/>
    <path d="M${110+C.body/2-5} 159 Q${110+C.body/2+18} 180 ${110+C.body/2+16} 213" fill="none" stroke="${C.skin}" stroke-width="${kind==='dad'?17:14}" stroke-linecap="round"/>
    <ellipse cx="110" cy="93" rx="${C.head}" ry="${C.head+3}" fill="${C.skin}" stroke="#17131b" stroke-width="5"/>
    ${extras}
    ${eyes(96,124,91)}
    ${mouth}
  `);
}

for(const hero of ['rick','laura']){
  for(const dir of ['down','up','right']){
    for(let f=0;f<2;f++) write(`characters/${hero}-${dir}-${f}.svg`, hero==='rick'?rick(dir,f):laura(dir,f));
  }
}
for(const n of ['dad','will','denise','fats','andrew']) write(`characters/${n}.svg`,npc(n));

const roomDefs=`
<defs>
  <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#243a34"/><stop offset="1" stop-color="#13241d"/></linearGradient>
  <linearGradient id="warmwood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8c6345"/><stop offset=".55" stop-color="#5c3f31"/><stop offset="1" stop-color="#3a2923"/></linearGradient>
  <linearGradient id="amber" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd77d"/><stop offset="1" stop-color="#c67b3b"/></linearGradient>
  <linearGradient id="plum" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4c3b57"/><stop offset="1" stop-color="#241c2c"/></linearGradient>
  <linearGradient id="greenGlass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b8d7b"/><stop offset="1" stop-color="#264d41"/></linearGradient>
  <filter id="roomshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000" flood-opacity=".35"/></filter>
</defs>`;

const roomWrap=(body,w=2200,h=1400)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${roomDefs}${body}</svg>`;

const street=roomWrap(`
  <rect width="2200" height="1400" fill="url(#night)"/>
  <rect y="900" width="2200" height="500" fill="#8c745f"/>
  <rect y="870" width="2200" height="30" fill="#c4ac8d"/>
  <path d="M0 1120H2200" stroke="#5f5045" stroke-width="12" stroke-dasharray="105 78" opacity=".42"/>
  <path d="M1100 900V1400" stroke="#5f5045" stroke-width="12" stroke-dasharray="85 65" opacity=".35"/>

  <g filter="url(#roomshadow)">
    <path d="M85 720L360 430 635 720Z" fill="#493b50" stroke="#17131b" stroke-width="14"/>
    <rect x="120" y="710" width="490" height="290" rx="12" fill="#2e2630" stroke="#17131b" stroke-width="14"/>
    <rect x="185" y="815" width="115" height="185" rx="8" fill="#17141b"/>
    <rect x="352" y="760" width="190" height="92" rx="10" fill="#e9e1d3"/>
    <text x="447" y="816" text-anchor="middle" font-family="Arial Black" font-size="34" fill="#261f29">4AM COFFEE</text>
    <g opacity=".85"><circle cx="398" cy="919" r="18" fill="#f2cf7c"/><path d="M389 919h21" stroke="#5c4032" stroke-width="6"/><circle cx="479" cy="919" r="18" fill="#f2cf7c"/></g>
  </g>

  <g filter="url(#roomshadow)">
    <path d="M1570 680L1865 370 2160 680Z" fill="#34414a" stroke="#17131b" stroke-width="14"/>
    <rect x="1610" y="670" width="515" height="330" rx="12" fill="#28343b" stroke="#17131b" stroke-width="14"/>
    <rect x="1685" y="806" width="120" height="194" rx="8" fill="#15141a"/>
    <rect x="1835" y="755" width="210" height="95" rx="11" fill="#e1e4de"/>
    <text x="1940" y="814" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="39" fill="#233027">TAP &amp; VINE</text>
    <g fill="#d9bd77"><circle cx="1880" cy="920" r="13"/><circle cx="1940" cy="920" r="13"/><circle cx="2000" cy="920" r="13"/></g>
  </g>

  <g filter="url(#roomshadow)">
    <rect x="700" y="360" width="800" height="450" rx="80" fill="#2f6b4c" stroke="#214a37" stroke-width="14"/>
    <path d="M760 455C920 380 1280 380 1440 455" stroke="#5d976f" stroke-width="12" fill="none"/>
    <ellipse cx="875" cy="650" rx="130" ry="70" fill="#25583f"/>
    <ellipse cx="1320" cy="635" rx="150" ry="76" fill="#25583f"/>
    <rect x="980" y="590" width="250" height="38" rx="10" fill="#6a4d38"/>
    <rect x="1018" y="628" width="20" height="70" fill="#513b2d"/>
    <rect x="1172" y="628" width="20" height="70" fill="#513b2d"/>
    <rect x="930" y="415" width="340" height="70" rx="16" fill="#15161b" opacity=".88"/>
    <text x="1100" y="458" text-anchor="middle" font-family="Arial Black" font-size="27" fill="#f5efe7">WEIRD FRIENDS GREEN</text>
  </g>

  <g transform="translate(420 1160)" filter="url(#roomshadow)">
    <ellipse cx="0" cy="46" rx="150" ry="34" fill="#000" opacity=".18"/>
    <rect x="-150" y="-52" width="300" height="112" rx="32" fill="#315f6f" stroke="#17131b" stroke-width="11"/>
    <path d="M-84 -52L-36 -115H72L112 -52Z" fill="url(#glass)" stroke="#17131b" stroke-width="9"/>
    <circle cx="-92" cy="60" r="33" fill="#17191d"/><circle cx="96" cy="60" r="33" fill="#17191d"/>
    <circle cx="-92" cy="60" r="16" fill="#8f969f"/><circle cx="96" cy="60" r="16" fill="#8f969f"/>
  </g>

  <g filter="url(#roomshadow)">
    <rect x="40" y="1180" width="420" height="100" rx="22" fill="#17151b" opacity=".92"/>
    <text x="250" y="1240" text-anchor="middle" font-family="Arial Black" font-size="27" fill="#f4efe8">LEYLAND ROAD STORES</text>
  </g>

  <g filter="url(#roomshadow)">
    <rect x="1680" y="1160" width="430" height="110" rx="22" fill="#17151b" opacity=".92"/>
    <text x="1895" y="1218" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="36" fill="#f0c56a">THE TURKISH</text>
  </g>

  <g transform="translate(1040 790)" opacity=".95">
    <rect x="-125" y="-38" width="250" height="76" rx="15" fill="#292132" stroke="#ff4fa3" stroke-width="5"/>
    <text x="0" y="-2" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#f3d96c">KENDAL CALLING</text>
    <text x="0" y="24" text-anchor="middle" font-family="Arial" font-weight="700" font-size="14" fill="#efe9df">2027 · probably muddy</text>
  </g>
`,2200,1400);

const shop=roomWrap(`
  <rect width="1800" height="1100" fill="#20292b"/>
  <rect x="70" y="65" width="1660" height="970" rx="44" fill="#d7d0c2" stroke="#17131b" stroke-width="18"/>
  <rect x="110" y="95" width="1580" height="110" rx="18" fill="#1c2728"/>
  <text x="900" y="163" text-anchor="middle" font-family="Arial Black" font-size="46" fill="#dce7df">LEYLAND ROAD STORES</text>

  <g filter="url(#roomshadow)">
    <rect x="130" y="250" width="410" height="590" rx="24" fill="#3b5c64" stroke="#17131b" stroke-width="12"/>
    <g fill="#bcd8d9"><rect x="175" y="300" width="320" height="118" rx="10"/><rect x="175" y="450" width="320" height="118" rx="10"/><rect x="175" y="600" width="320" height="118" rx="10"/></g>
    <g fill="#f1f6ef" stroke="#6caed1" stroke-width="7"><rect x="245" y="335" width="70" height="96" rx="8"/><rect x="335" y="335" width="70" height="96" rx="8"/><rect x="290" y="487" width="70" height="96" rx="8"/></g>
    <text x="335" y="785" text-anchor="middle" font-family="Arial Black" font-size="26" fill="#f4efe8">MILK FRIDGE</text>
  </g>

  <g filter="url(#roomshadow)">
    <rect x="665" y="270" width="440" height="520" rx="25" fill="#6b5847" stroke="#17131b" stroke-width="12"/>
    <g stroke="#a28c73" stroke-width="10"><path d="M705 385H1065"/><path d="M705 515H1065"/><path d="M705 645H1065"/></g>
    <g fill="#c75f63"><rect x="730" y="320" width="58" height="42"/><rect x="835" y="320" width="72" height="42"/><rect x="960" y="320" width="62" height="42"/></g>
    <g fill="#d6a849"><rect x="735" y="452" width="64" height="39"/><rect x="842" y="452" width="68" height="39"/><rect x="962" y="452" width="56" height="39"/></g>
    <g fill="#648f63"><rect x="735" y="582" width="61" height="39"/><rect x="840" y="582" width="72" height="39"/><rect x="960" y="582" width="55" height="39"/></g>
  </g>

  <g filter="url(#roomshadow)">
    <rect x="1190" y="270" width="440" height="235" rx="24" fill="#5f4a3a" stroke="#17131b" stroke-width="12"/>
    <rect x="1240" y="320" width="340" height="72" rx="13" fill="#272229"/>
    <text x="1410" y="366" text-anchor="middle" font-family="Arial Black" font-size="27" fill="#f5efe7">TILL</text>
  </g>

  <g transform="translate(1385 665)" filter="url(#roomshadow)">
    <rect x="-170" y="-70" width="340" height="145" rx="22" fill="#2d3532" stroke="#17131b" stroke-width="10"/>
    <text x="0" y="-15" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#b7ff39">NO, YOU DON'T NEED</text>
    <text x="0" y="18" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#b7ff39">ANOTHER COFFEE</text>
    <text x="0" y="52" text-anchor="middle" font-family="Arial" font-size="15" fill="#d8d0c6">This message is legally aimed at Rick.</text>
  </g>

  <rect x="770" y="930" width="260" height="105" rx="22" fill="#202228" opacity=".85"/>
`,1800,1100);

const tap=roomWrap(`
  <rect width="1800" height="1100" fill="#211a24"/>
  <rect width="1800" height="255" fill="#4d342e"/>
  <g opacity=".32" stroke="#7b5448" stroke-width="4">
    ${Array.from({length:12},(_,i)=>`<path d="M0 ${20+i*22}H1800"/>`).join('')}
  </g>
  <rect y="255" width="1800" height="845" fill="url(#plum)"/>

  <g filter="url(#roomshadow)">
    <rect x="150" y="285" width="1500" height="260" rx="28" fill="url(#warmwood)" stroke="#17131b" stroke-width="14"/>
    <rect x="120" y="264" width="1560" height="52" rx="16" fill="#bf8b52" stroke="#17131b" stroke-width="11"/>
    <g stroke="#222" stroke-width="12" stroke-linecap="round"><path d="M755 285V390"/><path d="M835 285V390"/><path d="M915 285V390"/><path d="M995 285V390"/></g>
    <g fill="#d6a34c"><circle cx="755" cy="392" r="16"/><circle cx="835" cy="392" r="16"/><circle cx="915" cy="392" r="16"/><circle cx="995" cy="392" r="16"/></g>
    <g fill="#d6c198"><rect x="245" y="365" width="115" height="105" rx="10"/><rect x="410" y="365" width="115" height="105" rx="10"/><rect x="1270" y="365" width="115" height="105" rx="10"/></g>
  </g>

  <rect x="650" y="72" width="500" height="115" rx="22" fill="#111318" stroke="#ded8c9" stroke-width="5"/>
  <text x="900" y="143" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="54" fill="#e9e4d9">Tap &amp; Vine</text>

  <g fill="#664a38" stroke="#17131b" stroke-width="10" filter="url(#roomshadow)">
    <ellipse cx="345" cy="750" rx="145" ry="92"/>
    <ellipse cx="900" cy="790" rx="150" ry="95"/>
    <ellipse cx="1450" cy="730" rx="145" ry="92"/>
  </g>
  <g fill="#2a212d" stroke="#17131b" stroke-width="9"><rect x="190" y="880" width="310" height="78" rx="28"/><rect x="1295" y="860" width="310" height="78" rx="28"/></g>

  <g transform="translate(1340 580)" filter="url(#roomshadow)">
    <rect x="-210" y="-70" width="420" height="140" rx="22" fill="#17141d" stroke="#ff4fa3" stroke-width="5"/>
    <text x="0" y="-12" text-anchor="middle" font-family="Arial Black" font-size="30" fill="#f1cb65">KENDAL CALLING</text>
    <text x="0" y="26" text-anchor="middle" font-family="Arial" font-weight="700" font-size="17" fill="#f5efe7">wristbands · mud · absolutely no memory</text>
  </g>

  <g transform="translate(410 600)">
    <rect x="-220" y="-60" width="440" height="120" rx="20" fill="#18151c" stroke="#5a4e65" stroke-width="4"/>
    <text x="0" y="-10" text-anchor="middle" font-family="Arial Black" font-size="20" fill="#efe9df">WILL'S PHILOSOPHY</text>
    <text x="0" y="28" text-anchor="middle" font-family="Arial" font-weight="700" font-size="19" fill="#b7ff39">“When you're in the Tap, you're a pub.”</text>
  </g>

  <g transform="translate(1100 930)" opacity=".9">
    <path d="M0 0 C30 -50 60 -50 90 0 C60 25 30 25 0 0Z" fill="#f0e8df" stroke="#17131b" stroke-width="5"/>
    <path d="M27 0 C38 -26 53 -26 64 0" fill="none" stroke="#a6d5d0" stroke-width="5"/>
  </g>
`,1800,1100);

const turkish=roomWrap(`
  <rect width="1800" height="1100" fill="#16242a"/>
  <rect y="0" width="1800" height="300" fill="#24444a"/>
  <g opacity=".55" stroke="#6cb1b5" stroke-width="4" fill="none">
    ${Array.from({length:18},(_,i)=>`<circle cx="${60+i*105}" cy="150" r="44"/><path d="M${60+i*105} 106L${104+i*105} 150L${60+i*105} 194L${16+i*105} 150Z"/>`).join('')}
  </g>
  <rect y="300" width="1800" height="800" fill="#372b28"/>

  <rect x="125" y="85" width="620" height="125" rx="18" fill="#111319" stroke="#d3a051" stroke-width="6"/>
  <text x="435" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="55" font-weight="700" fill="#f0e7d7">THE TURKISH</text>
  <text x="435" y="184" text-anchor="middle" font-family="Arial" font-size="17" font-weight="700" fill="#d8b36f">charcoal · bread · accidental banquet</text>

  <g filter="url(#roomshadow)">
    <rect x="1120" y="95" width="510" height="285" rx="24" fill="#2c3033" stroke="#17131b" stroke-width="13"/>
    <rect x="1180" y="160" width="390" height="115" rx="14" fill="#15171a"/>
    <g stroke="#e17c43" stroke-width="8"><path d="M1220 238h310"/><path d="M1245 207h260"/></g>
    <g fill="#efc46b"><circle cx="1260" cy="200" r="14"/><circle cx="1330" cy="225" r="17"/><circle cx="1430" cy="200" r="14"/><circle cx="1510" cy="224" r="16"/></g>
  </g>

  <g filter="url(#roomshadow)" stroke="#17131b" stroke-width="10">
    <ellipse cx="410" cy="665" rx="210" ry="110" fill="#76513a"/>
    <ellipse cx="900" cy="770" rx="230" ry="120" fill="#76513a"/>
    <ellipse cx="1400" cy="660" rx="205" ry="108" fill="#76513a"/>
  </g>
  <g fill="#e9dfce" stroke="#4d382d" stroke-width="5">
    <ellipse cx="410" cy="635" rx="112" ry="48"/><ellipse cx="900" cy="740" rx="120" ry="50"/><ellipse cx="1400" cy="635" rx="108" ry="46"/>
  </g>
  <g fill="#b8613e"><circle cx="370" cy="632" r="20"/><circle cx="432" cy="625" r="18"/><circle cx="860" cy="740" r="22"/><circle cx="928" cy="731" r="20"/><circle cx="1370" cy="633" r="20"/></g>
  <g fill="#688f4f"><circle cx="465" cy="642" r="16"/><circle cx="968" cy="747" r="16"/><circle cx="1435" cy="640" r="16"/></g>

  <g transform="translate(455 960)" filter="url(#roomshadow)">
    <rect x="-300" y="-52" width="600" height="104" rx="20" fill="#18151a" stroke="#6b5550" stroke-width="4"/>
    <text x="0" y="-4" text-anchor="middle" font-family="Arial Black" font-size="22" fill="#f0c66d">ORDERED FOR TWO</text>
    <text x="0" y="28" text-anchor="middle" font-family="Arial" font-weight="700" font-size="16" fill="#f4efe8">food currently sufficient for a minor wedding</text>
  </g>
`,1800,1100);

const kendal=roomWrap(`
  <rect width="1800" height="1100" fill="#2b3b33"/>
  <rect y="700" width="1800" height="400" fill="#6a5c4e"/>
  <circle cx="1450" cy="170" r="120" fill="#d9a85a" opacity=".28"/>
  <g filter="url(#roomshadow)">
    <path d="M90 720L320 360 550 720Z" fill="#a85880" stroke="#17131b" stroke-width="12"/>
    <path d="M590 735L820 390 1050 735Z" fill="#5e83a2" stroke="#17131b" stroke-width="12"/>
    <path d="M1110 720L1360 340 1610 720Z" fill="#c6a14d" stroke="#17131b" stroke-width="12"/>
  </g>
  <rect x="475" y="115" width="850" height="175" rx="28" fill="#17141d" stroke="#f0c66d" stroke-width="7"/>
  <text x="900" y="190" text-anchor="middle" font-family="Arial Black" font-size="68" fill="#f5efe7">KENDAL CALLING</text>
  <text x="900" y="245" text-anchor="middle" font-family="Arial Black" font-size="26" fill="#ff4fa3">MUD · BUCKET HATS · BAD LOGISTICS</text>
  <g transform="translate(250 875)">
    <rect width="1300" height="98" rx="26" fill="#15151a" stroke="#5d5265" stroke-width="5"/>
    <text x="650" y="60" text-anchor="middle" font-family="Arial Black" font-size="28" fill="#b7ff39">PARKING: STILL SPIRITUALLY UNRESOLVED</text>
  </g>
  <g opacity=".9">
    <circle cx="265" cy="835" r="22" fill="#f1cf64"/><circle cx="315" cy="835" r="22" fill="#ff4fa3"/><circle cx="365" cy="835" r="22" fill="#73b6be"/>
  </g>
`,1800,1100);

const fats=roomWrap(`
  <rect width="1800" height="1100" fill="#171219"/>
  <circle cx="900" cy="560" r="430" fill="#251927" stroke="#4d2f47" stroke-width="22"/>
  <circle cx="900" cy="560" r="315" fill="#171219" stroke="#ff5e67" stroke-width="9" stroke-dasharray="30 24"/>
  <rect x="610" y="80" width="580" height="120" rx="24" fill="#101116" stroke="#ff5e67" stroke-width="6"/>
  <text x="900" y="152" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="54" fill="#f5efe7">PAD THAI PALACE</text>

  <g transform="translate(360 390)" filter="url(#roomshadow)">
    <ellipse cx="0" cy="0" rx="190" ry="82" fill="#e6dccb" stroke="#4c3528" stroke-width="10"/>
    <ellipse cx="-40" cy="0" rx="62" ry="40" fill="#92563c"/><circle cx="74" cy="-10" r="30" fill="#6f994d"/><circle cx="98" cy="26" r="25" fill="#d69b46"/>
  </g>

  <g transform="translate(1500 410)">
    <rect x="-110" y="-70" width="220" height="140" rx="20" fill="#f2eee6" stroke="#c43a3a" stroke-width="10"/>
    <text x="0" y="20" text-anchor="middle" font-family="Arial Black" font-size="58" fill="#c43a3a">KFC</text>
  </g>

  <text x="900" y="925" text-anchor="middle" font-family="Arial Black" font-size="31" fill="#ff8c94">SUNDAY ROAST INCIDENT RESPONSE CENTRE</text>
  <text x="900" y="970" text-anchor="middle" font-family="Arial" font-weight="700" font-size="20" fill="#d9c8d6">first pub: no roast · second pub: 20 minutes</text>
`,1800,1100);

write('rooms/street.svg',street);
write('rooms/shop.svg',shop);
write('rooms/tap.svg',tap);
write('rooms/turkish.svg',turkish);
write('rooms/kendal.svg',kendal);
write('rooms/fats.svg',fats);

console.log('Generated V3 art source');
