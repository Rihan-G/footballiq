import { useState, useRef } from "react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#050810",surface:"#090e1a",card:"#0d1320",border:"#151f30",borderLit:"#1e2f48",
  accent:"#2d7fff",accentGlo:"#2d7fff18",gold:"#f0b429",goldGlo:"#f0b42918",
  red:"#f03e3e",redGlo:"#f03e3e18",green:"#00c97a",greenGlo:"#00c97a18",
  purple:"#8b5cf6",purpleGlo:"#8b5cf618",orange:"#fb923c",orangeGlo:"#fb923c18",
  teal:"#14b8a6",tealGlo:"#14b8a618",text:"#e1eaff",sub:"#3d5278",dim:"#1b2840",
};

// ─── WC Data ──────────────────────────────────────────────────────────────────
const FINISHED_TODAY = [
  {home:"Tunisia",away:"Netherlands",sH:1,sA:3,group:"F"},
  {home:"Japan",away:"Sweden",sH:1,sA:1,group:"F"},
  {home:"Türkiye",away:"USA",sH:3,sA:2,group:"D"},
  {home:"Paraguay",away:"Australia",sH:0,sA:0,group:"D"},
  {home:"Norway",away:"France",sH:1,sA:4,group:"I"},
  {home:"Senegal",away:"Iraq",sH:5,sA:0,group:"I"},
  {home:"Uruguay",away:"Spain",sH:0,sA:1,group:"H"},
  {home:"Cape Verde",away:"Saudi Arabia",sH:0,sA:0,group:"H"},
  {home:"New Zealand",away:"Belgium",sH:1,sA:5,group:"G"},
  {home:"Egypt",away:"IR Iran",sH:1,sA:1,group:"G"},
];

const UPCOMING = [
  {home:"Panama",away:"England",time:"21:00",venue:"MetLife Stadium, NJ",group:"L",pH:0.053,pD:0.107,pA:0.840,xgH:0.62,xgA:2.31,homeForm:"0-0-3",awayForm:"1-1-0",homeStanding:"4th (0pts, eliminated)",awayStanding:"1st (4pts)",stake:"England top group → R32 seeding | Panama out",news:["England drew 0-0 with Ghana in match 2 — Tuchel demands response","Bellingham & Kane both fit and expected to start","Panama already eliminated — free to attack with nothing to lose","England won 4-2 vs Croatia in match 1 — Saka with hat-trick"]},
  {home:"Croatia",away:"Ghana",time:"21:00",venue:"Lincoln Financial Field, Philadelphia",group:"L",pH:0.512,pD:0.298,pA:0.190,xgH:1.55,xgA:1.02,homeForm:"1-0-1",awayForm:"1-1-0",homeStanding:"3rd (3pts)",awayStanding:"2nd (4pts, QF secured)",stake:"Croatia MUST win to advance as best 3rd | Ghana already through",news:["Ghana already qualified (4pts) — likely to rotate key players","Croatia MUST win to have any chance of qualifying as 3rd-placed team","André Ayew training fully — fit for Ghana","Modrić expected to start what may be his final World Cup match"]},
  {home:"Colombia",away:"Portugal",time:"23:30",venue:"Hard Rock Stadium, Miami",group:"K",pH:0.265,pD:0.253,pA:0.482,xgH:1.18,xgA:1.74,homeForm:"2-0-0",awayForm:"1-1-0",homeStanding:"1st (6pts)",awayStanding:"2nd (4pts)",stake:"Draw secures Colombia top spot | Portugal need win for seeding",news:["Colombia lead Group K — draw secures them as group winners","Portugal without Rúben Dias (calf) — major defensive concern","Ronaldo on fire with 4 goals in 2 games — starting up top","Luis Díaz has 3 assists — Colombia's creative engine in top form","Bruno Fernandes pulled off training Thursday — fitness doubt"]},
  {home:"Congo DR",away:"Uzbekistan",time:"23:30",venue:"Mercedes-Benz Stadium, Atlanta",group:"K",pH:0.604,pD:0.230,pA:0.166,xgH:1.72,xgA:0.89,homeForm:"0-1-1",awayForm:"0-1-1",homeStanding:"3rd (1pt)",awayStanding:"4th (1pt, -7 GD)",stake:"Congo DR win likely seals last-32 | Uzbekistan need a miracle",news:["Congo DR can qualify with a win — 3pts likely advances them as 3rd","Uzbekistan need to win by 5+ goals to overcome -7 goal difference","DR Congo lost 0-1 to Colombia after 1-1 draw with Portugal","Uzbekistan lost 0-5 to Portugal — broken confidence but nothing to lose"]},
  {home:"Jordan",away:"Argentina",time:"02:00+",venue:"AT&T Stadium, Arlington TX",group:"J",pH:0.048,pD:0.112,pA:0.840,xgH:0.55,xgA:2.48,homeForm:"0-0-2",awayForm:"2-0-0",homeStanding:"4th (0pts, eliminated)",awayStanding:"1st (6pts, group winner)",stake:"🚨 Argentina already won group — Messi likely RESTED | Jordan out",news:["🚨 Argentina confirmed group winners — Messi expected to be rested","Scaloni hinted at rotating stars — second-string likely tonight","Jordan eliminated (0pts) — lost 1-3 to Austria & 0-2 to Algeria","Argentina beat Algeria 3-0 and Austria 2-0 — dominant but will rotate","⚠️ Messi rest dramatically changes the xG and scoring margin picture"]},
  {home:"Algeria",away:"Austria",time:"02:00+",venue:"Arrowhead Stadium, Kansas City",group:"J",pH:0.228,pD:0.443,pA:0.329,xgH:1.05,xgA:1.18,homeForm:"1-0-1",awayForm:"1-0-1",homeStanding:"2nd (3pts)",awayStanding:"3rd (3pts)",stake:"Winner advances as 2nd | Loser likely out — DO OR DIE",news:["Massive match — Algeria and Austria level on 3 points each","Algeria beat Jordan 2-1 but lost 0-3 to Argentina","Austria beat Jordan 3-1 but lost 0-2 to Argentina","Both need 3pts — a draw could eliminate both if Jordan upsets Argentina","Algeria's Mahrez fit after ankle scare in training","Draw most likely statistically (44%) — both sides may play cautiously"]},
];

const SLIP_LEGS = [
  {match:"Croatia v Ghana",sel:"Croatia Win",odds:1.80,ourP:51.2,type:"1X2",note:"Slight overround but Croatia MUST win to advance — maximum motivation."},
  {match:"Panama v England",sel:"England 3+ goal win",odds:1.90,ourP:38.0,type:"Margin",note:"Hardest leg. England scored 4 vs Croatia but drew 0-0 with Ghana. Inconsistent."},
  {match:"Jordan v Argentina",sel:"Argentina 3+ goal win",odds:2.00,ourP:40.0,type:"Margin",note:"⚠️ Messi likely rested — Argentina fielding second string. Margin collapses."},
  {match:"Colombia v Portugal",sel:"Portugal Win",odds:1.90,ourP:48.2,type:"1X2",note:"Portugal without Rúben Dias. Colombia only need a draw — dangerous setup."},
];

// ─── Simulation ───────────────────────────────────────────────────────────────
function pois(l,k){let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p;}
function runSim(pH,pD,pA,xH,xA,n=50000){
  let wH=0,wD=0,wA=0,o25=0,o15=0;const sc={};
  const pH2=Array.from({length:9},(_,k)=>pois(xH,k));
  const pA2=Array.from({length:9},(_,k)=>pois(xA,k));
  const t=pH+pD+pA,nH=pH/t,nA=pA/t;
  for(let i=0;i<n;i++){
    let rH=Math.random(),gH=0,cH=0;for(let k=0;k<9;k++){cH+=pH2[k];if(rH<cH){gH=k;break;}}
    let rA=Math.random(),gA=0,cA=0;for(let k=0;k<9;k++){cA+=pA2[k];if(rA<cA){gA=k;break;}}
    const r=Math.random();let fH=gH,fA=gA;
    if(gH>gA&&r>nH/(nH+.01)){fH=gH;fA=gH;}
    if(gA>gH&&r>nA/(nA+.01)){fA=gA;fH=gA;}
    const tot=fH+fA;if(tot>2.5)o25++;if(tot>1.5)o15++;
    const k=`${fH}-${fA}`;sc[k]=(sc[k]||0)+1;
    if(fH>fA)wH++;else if(fH===fA)wD++;else wA++;
  }
  const top=Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([s,c])=>({s,p:+((c/n)*100).toFixed(1)}));
  return{wH:+((wH/n)*100).toFixed(1),wD:+((wD/n)*100).toFixed(1),wA:+((wA/n)*100).toFixed(1),o25:+((o25/n)*100).toFixed(1),o15:+((o15/n)*100).toFixed(1),u25:+(100-(o25/n)*100).toFixed(1),top,pred:top[0]?.s??"?",xT:+(xH+xA).toFixed(2)};
}
const SIMS=UPCOMING.map(m=>({...m,sim:runSim(m.pH,m.pD,m.pA,m.xgH,m.xgA)}));

// ─── Horse Racing AI ──────────────────────────────────────────────────────────
async function analyseRace(txt){
  const msgs=[{role:"user",content:txt}];let last="";
  for(let r=0;r<8;r++){
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,
        system:`Expert horse racing analyst. Return ONLY valid JSON — no markdown, no prose:
{"raceName":"str","raceType":"str","distance":"str","going":"str","runners":[{"name":"str","number":null,"jockey":null,"trainer":null,"odds":"str","impliedProb":0,"form":null,"weight":null,"winProb":0,"eachWayValue":"good|fair|poor","notes":"str"}],"topPick":"str","eachWayPick":"str","darkHorse":null,"raceVerdict":"str","goingImpact":"str","valueAlert":null,"confidenceLevel":"high|medium|low"}
winProb values must sum to ~100. JSON only.`,
        messages:msgs})});
    const d=await res.json();if(d.error)throw new Error(d.error.message);
    const ct=d.content||[];const tx=ct.filter(b=>b.type==="text").map(b=>b.text);if(tx.length)last=tx.join("\n");
    const tu=ct.filter(b=>b.type==="tool_use");if(!tu.length||d.stop_reason==="end_turn")break;
    msgs.push({role:"assistant",content:ct},{role:"user",content:tu.map(b=>({type:"tool_result",tool_use_id:b.id,content:JSON.stringify(b.output||"")}))});
  }
  const t=last.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  const s=t.indexOf("{"),e=t.lastIndexOf("}");
  if(s!==-1&&e!==-1){try{return JSON.parse(t.slice(s,e+1));}catch{}}
  throw new Error("Could not parse AI response.");
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Spin({sz=14}){return <span style={{display:"inline-block",width:sz,height:sz,border:`2px solid ${C.border}`,borderTopColor:C.accent,borderRadius:"50%",animation:"spin .65s linear infinite",flexShrink:0}}/>;}
function Pill({t,col,sm}){return <span style={{fontSize:sm?9:10,color:col,background:col+"1a",border:`1px solid ${col}30`,borderRadius:4,padding:sm?"1px 5px":"2px 8px",fontWeight:700,whiteSpace:"nowrap"}}>{t}</span>;}
function Divider({label}){return <div style={{display:"flex",alignItems:"center",gap:8,margin:"16px 0 10px"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:9,color:C.sub,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700}}>{label}</span><div style={{flex:1,height:1,background:C.border}}/></div>;}
function Bar({val,color,h=6}){return <div style={{height:h,background:C.dim,borderRadius:h}}><div style={{height:"100%",width:`${Math.min(parseFloat(val)||0,100)}%`,background:color,borderRadius:h,transition:"width .5s ease"}}/></div>;}
function StatBox({v,l,col}){return <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:col||C.text}}>{v}</div><div style={{fontSize:9,color:C.sub,marginTop:2}}>{l}</div></div>;}

// ─── Slip Analyser ────────────────────────────────────────────────────────────
function SlipAnalyser(){
  const combP=SLIP_LEGS.reduce((a,l)=>a*(l.ourP/100),1);
  const fairO=+(1/combP).toFixed(2);
  const ev=+(combP*13-1).toFixed(3);
  const evPct=+(ev*100).toFixed(1);
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${C.accent}0d,${C.card})`,border:`1px solid ${C.borderLit}`,borderRadius:14,padding:"16px 16px 14px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
          <div><div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1.2,marginBottom:4}}>Stevenhills · Multi Bet</div><div style={{fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-.5px"}}>4-Leg Accumulator</div><div style={{fontSize:11,color:C.sub,marginTop:2}}>World Cup · 28 Jun 2026</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:26,fontWeight:900,color:C.gold}}>@13.00</div><div style={{fontSize:10,color:C.sub}}>book odds</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <StatBox v={`@${fairO}`} l="Fair Odds" col={C.purple}/>
          <StatBox v={`${(combP*100).toFixed(2)}%`} l="Win Prob" col={C.accent}/>
          <StatBox v={`${evPct>0?"+":""}${evPct}%`} l="Exp. Value" col={evPct>=0?C.green:C.red}/>
        </div>
        <div style={{marginTop:12,background:C.redGlo,border:`1px solid ${C.red}30`,borderRadius:9,padding:"9px 12px",fontSize:12,color:C.text,lineHeight:1.65}}>
          <span style={{color:C.red,fontWeight:800}}>⚠️ Poor Value · </span>Fair odds are <strong style={{color:C.purple}}>{fairO}</strong> — book pays only 13.00. Margin legs + likely Messi rotation badly hurt this slip.
        </div>
      </div>
      <Divider label="Leg Breakdown"/>
      {SLIP_LEGS.map((leg,i)=>{
        const imp=+(100/leg.odds).toFixed(1);const fair=+(100/leg.ourP).toFixed(2);const edge=+(leg.ourP-imp).toFixed(1);const good=edge>0;const isM=leg.type==="Margin";const col=good?C.green:C.red;
        return(<div key={i} style={{background:C.card,border:`1px solid ${good?C.green+"30":C.border}`,borderLeft:`3px solid ${good?C.green:C.red}`,borderRadius:11,padding:"13px 14px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
            <div style={{flex:1,paddingRight:12}}>
              <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:3}}>{leg.sel}</div>
              <div style={{fontSize:11,color:C.sub,marginBottom:6}}>{leg.match}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Pill t={leg.type} col={isM?C.orange:C.accent} sm/>{isM&&<Pill t="Hard margin" col={C.orange} sm/>}{good?<Pill t="✓ Edge" col={C.green} sm/>:<Pill t="✗ Overpriced" col={C.red} sm/>}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:22,fontWeight:900,color:C.gold}}>@{leg.odds}</div><div style={{fontSize:10,color:C.sub}}>Fair: {fair}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:9}}>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:C.sub}}>{imp}%</div><div style={{fontSize:9,color:C.dim,marginTop:1}}>Book implied</div></div>
            <div style={{background:col+"0d",border:`1px solid ${col}30`,borderRadius:7,padding:"7px 10px",textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:col}}>{leg.ourP}%</div><div style={{fontSize:9,color:C.dim,marginTop:1}}>Our model</div></div>
          </div>
          <Bar val={leg.ourP} color={col}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:3,marginBottom:8}}><span style={{color:C.sub}}>0%</span><span style={{color:col,fontWeight:700}}>{leg.ourP}% · {good?`+${edge}% edge`:`${edge}% edge (overpriced)`}</span><span style={{color:C.sub}}>100%</span></div>
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,color:C.sub,lineHeight:1.6}}>💡 {leg.note}</div>
        </div>);
      })}
      <Divider label="Probability Waterfall"/>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px",marginBottom:14}}>
        {(()=>{let run=1;return SLIP_LEGS.map((leg,i)=>{run*=leg.ourP/100;const pct=run*100;return(<div key={i} style={{marginBottom:i<3?12:0}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span style={{color:C.text,fontWeight:600}}>Leg {i+1} · {leg.sel.split(" ").slice(0,3).join(" ")}…</span><span style={{color:C.gold,fontWeight:800}}>{pct.toFixed(3)}%</span></div><div style={{height:8,background:C.dim,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct*5,100)}%`,background:`linear-gradient(90deg,${C.accent},${C.purple})`,borderRadius:4}}/></div>{i<3&&<div style={{textAlign:"center",fontSize:12,color:C.border,margin:"3px 0"}}>↓</div>}</div>);});})()}
        <div style={{marginTop:12,background:C.redGlo,border:`1px solid ${C.red}30`,borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:C.sub}}>Final probability</span><span style={{fontSize:16,fontWeight:900,color:C.red}}>{(combP*100).toFixed(3)}%</span></div>
      </div>
      <Divider label="What To Do Instead"/>
      {[{icon:"🗑️",t:"Drop both margin legs",b:`"England 3+" and "Argentina 3+" are weak — ~38-40% each but book pays 1.9-2.0. Croatia Win + Portugal Win would be cleaner.`,col:C.red},{icon:"🚨",t:"Messi likely rested tonight",b:`Argentina already qualified as group winners. Without Messi the Argentina 3+ goal prediction collapses significantly.`,col:C.orange},{icon:"✅",t:"Better version of this slip",b:`Croatia Win + England Win + Argentina Win + Portugal Win ≈ 6.00 odds at ~18% probability vs your 3.75% — far better hit rate.`,col:C.green},{icon:"💰",t:"Best single value",b:`Croatia @ 1.80 has most edge (51.2% win prob, fair value 1.95). They MUST win to qualify — maximum motivation.`,col:C.accent}].map(({icon,t,b,col})=>(
        <div key={t} style={{background:C.card,border:`1px solid ${col}25`,borderLeft:`3px solid ${col}`,borderRadius:10,padding:"11px 13px",marginBottom:8,display:"flex",gap:10}}>
          <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{icon}</span>
          <div><div style={{fontSize:13,fontWeight:700,color:col,marginBottom:3}}>{t}</div><div style={{fontSize:11,color:C.sub,lineHeight:1.65}}>{b}</div></div>
        </div>
      ))}
    </div>
  );
}

// ─── World Cup ────────────────────────────────────────────────────────────────
function SimCard({m,open,onToggle}){
  const{sim:s}=m;const wH=parseFloat(s.wH),wA=parseFloat(s.wA);
  const fav=wH>=wA?m.home:m.away,favP=Math.max(wH,wA);
  return(
    <div onClick={onToggle} style={{background:C.card,border:`1px solid ${open?C.accent+"55":C.border}`,borderLeft:`3px solid ${open?C.accent:C.border}`,borderRadius:12,padding:"13px 14px",marginBottom:8,cursor:"pointer",transition:"border .18s"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><Pill t={`Group ${m.group}`} col={C.accent} sm/><span style={{fontSize:10,color:C.sub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.stake}</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8,marginBottom:10}}>
        <div><div style={{fontSize:14,fontWeight:800,color:C.text}}>{m.home}</div><div style={{fontSize:10,color:C.sub}}>{m.homeForm}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:C.accent}}>{m.time}</div><div style={{fontSize:12,fontWeight:700,color:C.purple}}>{s.pred}</div><div style={{fontSize:9,color:C.sub}}>{m.venue.split(",")[0]}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{m.away}</div><div style={{fontSize:10,color:C.sub}}>{m.awayForm}</div></div>
      </div>
      <div style={{display:"flex",height:5,borderRadius:3,overflow:"hidden",marginBottom:5}}><div style={{width:`${s.wH}%`,background:C.accent}}/><div style={{width:`${s.wD}%`,background:C.gold}}/><div style={{width:`${s.wA}%`,background:C.red}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:9}}><span style={{color:C.accent,fontWeight:700}}>{s.wH}%</span><span style={{color:C.gold}}>{s.wD}% D</span><span style={{color:C.red,fontWeight:700}}>{s.wA}%</span></div>
      <div style={{display:"flex",gap:5}}>
        {[{l:`O2.5 ${s.o25}%`,p:parseFloat(s.o25)},{l:`O1.5 ${s.o15}%`,p:parseFloat(s.o15)},{l:`U2.5 ${s.u25}%`,p:parseFloat(s.u25)}].map(({l,p})=>{const c=p>=65?C.green:p>=45?C.gold:C.red;return <div key={l} style={{flex:1,background:c+"12",border:`1px solid ${c}30`,borderRadius:6,padding:"4px 3px",textAlign:"center",fontSize:10,fontWeight:700,color:c}}>{l}</div>;})}
      </div>
      {open&&(<div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 12px",marginBottom:14}}>
          <div style={{fontSize:9,color:C.accent,textTransform:"uppercase",letterSpacing:1.2,fontWeight:700,marginBottom:7}}>Latest Intel</div>
          {m.news.map((n,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:i<m.news.length-1?5:0,fontSize:11,color:C.sub,lineHeight:1.55}}><span style={{color:C.accent,flexShrink:0,marginTop:1}}>›</span><span>{n}</span></div>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
          {[{l:`${m.home} Win`,v:s.wH,c:C.accent},{l:"Draw",v:s.wD,c:C.gold},{l:`${m.away} Win`,v:s.wA,c:C.red}].map(({l,v,c})=><div key={l}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:C.sub}}>{l}</span><span style={{color:c,fontWeight:800}}>{v}%</span></div><Bar val={v} color={c}/></div>)}
        </div>
        <div style={{marginBottom:12}}><div style={{fontSize:9,color:C.sub,textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Predicted Scorelines · 50k sims</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>{s.top.map(({s:sc,p},i)=><div key={sc} style={{background:i===0?C.accent+"15":C.bg,border:`1px solid ${i===0?C.accent+"55":C.border}`,borderRadius:7,padding:"7px 5px",textAlign:"center"}}><div style={{fontSize:17,fontWeight:900,color:i===0?C.accent:C.text}}>{sc}</div><div style={{fontSize:10,color:i===0?C.accent:C.sub}}>{p}%</div>{i===0&&<div style={{fontSize:8,color:C.accent,fontWeight:700,marginTop:1}}>TOP</div>}</div>)}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
          <StatBox v={m.xgH} l={`${m.home} xG`} col={C.accent}/><StatBox v={m.xgA} l={`${m.away} xG`} col={C.red}/><StatBox v={s.xT} l="Total xG" col={C.gold}/>
        </div>
        <div style={{background:C.accentGlo,border:`1px solid ${C.accent}25`,borderRadius:9,padding:"9px 12px",fontSize:11,color:C.text,lineHeight:1.65}}>
          <span style={{color:C.accent,fontWeight:700}}>AI · </span>{favP>=80?`${fav} dominant at ${favP}%. Predicted ${s.pred}. O2.5 ${s.o25}%.`:favP>=60?`${fav} favoured at ${favP}%. Most likely ${s.pred}. O2.5 ${s.o25}%.`:`Tight. Draw ${s.wD}% live. Predicted ${s.pred}, O2.5 ${s.o25}%.`}
        </div>
      </div>)}
    </div>
  );
}

function FinCard({m}){
  const hw=m.sH>m.sA,aw=m.sA>m.sH,tot=m.sH+m.sA;const gc=tot>2.5?C.green:tot>1.5?C.gold:C.sub;
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",marginBottom:6}}><div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8}}><div style={{fontSize:13,fontWeight:hw?800:500,color:hw?C.text:C.sub}}>{m.home}</div><div style={{textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span style={{fontSize:20,fontWeight:900,color:hw?C.green:C.text}}>{m.sH}</span><span style={{color:C.border}}>:</span><span style={{fontSize:20,fontWeight:900,color:aw?C.green:C.text}}>{m.sA}</span></div><div style={{display:"flex",gap:4,justifyContent:"center",marginTop:4,flexWrap:"wrap"}}><Pill t={`Grp ${m.group}`} col={C.sub} sm/><Pill t={hw?"HW":aw?"AW":"D"} col={hw?C.green:aw?"#f97316":C.gold} sm/><Pill t={tot>2.5?"O2.5 ✓":tot>1.5?"O1.5 ✓":"U1.5"} col={gc} sm/></div></div><div style={{textAlign:"right",fontSize:13,fontWeight:aw?800:500,color:aw?C.text:C.sub}}>{m.away}</div></div></div>);
}

// ─── Horse Racing ─────────────────────────────────────────────────────────────
const HINT=`Race: 3:30 Ascot – King George VI Stakes\nDistance: 1m 4f  |  Going: Good to Firm\n\n1. Kinross – 5/2 – Form: 1-1-2-1 – F Dettori / R Hannon – 9-2\n2. Palace Pier – 7/4f – Form: 1-1-1-1 – O Peslier / J Gosden – 9-4\n3. Baaeed – 3/1 – Form: 2-1-1-2 – J Crowley / W Haggas – 9-0`;
function Racing(){
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);const [res,setRes]=useState(null);const [err,setErr]=useState("");
  const go=async()=>{if(!inp.trim())return;setLoading(true);setErr("");setRes(null);try{setRes(await analyseRace(inp));}catch(e){setErr(e.message);}finally{setLoading(false);}};
  if(res)return(<div>
    <div style={{background:`linear-gradient(135deg,${C.orange}0d,${C.card})`,border:`1px solid ${C.orange}40`,borderRadius:13,padding:"14px 15px",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:5}}>{res.raceName||"Race Analysis"}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{res.raceType&&<Pill t={res.raceType} col={C.orange}/>}{res.distance&&<Pill t={res.distance} col={C.sub}/>}{res.going&&<Pill t={res.going} col={C.teal}/>}</div></div>{res.confidenceLevel&&<Pill t={`${res.confidenceLevel} conf`} col={res.confidenceLevel==="high"?C.green:res.confidenceLevel==="medium"?C.gold:C.red}/>}</div>
      <div style={{display:"grid",gridTemplateColumns:res.darkHorse?"1fr 1fr 1fr":"1fr 1fr",gap:8}}>{[{l:"⭐ Top Pick",v:res.topPick,c:C.gold},{l:"📍 E/W Pick",v:res.eachWayPick,c:C.teal},...(res.darkHorse?[{l:"🌑 Dark Horse",v:res.darkHorse,c:C.purple}]:[])].filter(x=>x.v).map(({l,v,c})=><div key={l} style={{background:c+"10",border:`1px solid ${c}30`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:9,color:c,textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:800,color:C.text}}>{v}</div></div>)}</div>
    </div>
    {res.goingImpact&&<div style={{background:C.tealGlo,border:`1px solid ${C.teal}30`,borderRadius:8,padding:"9px 12px",marginBottom:10,fontSize:11,color:C.sub,lineHeight:1.6}}><span style={{color:C.teal,fontWeight:700}}>Going · </span>{res.goingImpact}</div>}
    <Divider label={`Runners · ${res.runners?.length||0} declared`}/>
    {(res.runners||[]).map((r,i)=>{const isT=r.name===res.topPick,isE=r.name===res.eachWayPick,isD=r.name===res.darkHorse;const hl=isT?C.gold:isE?C.teal:isD?C.purple:null;const edge=r.winProb>(r.impliedProb||0)+3;
      return(<div key={r.name||i} style={{background:hl?hl+"08":C.card,border:`1px solid ${hl?hl+"40":C.border}`,borderLeft:`3px solid ${hl||C.border}`,borderRadius:10,padding:"12px 13px",marginBottom:7}}>
        <div style={{display:"flex",gap:10}}><div style={{width:26,height:26,borderRadius:"50%",background:C.dim,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.sub,flexShrink:0}}>{r.number??i+1}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:5}}><span style={{fontSize:14,fontWeight:800,color:C.text}}>{r.name}</span><span style={{fontSize:14,fontWeight:700,color:C.gold}}>{r.odds}</span>{isT&&<Pill t="⭐ Pick" col={C.gold} sm/>}{isE&&!isT&&<Pill t="E/W" col={C.teal} sm/>}{isD&&<Pill t="🌑 Dark" col={C.purple} sm/>}{edge&&<Pill t="VALUE" col={C.green} sm/>}</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:11,color:C.sub,marginBottom:8}}>{r.jockey&&<span>🏇 {r.jockey}</span>}{r.trainer&&<span>🎯 {r.trainer}</span>}{r.form&&<span style={{fontFamily:"monospace",color:C.text}}>📊 {r.form}</span>}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:7}}>{[{l:`Implied ${r.impliedProb||0}%`,v:r.impliedProb||0,c:C.sub},{l:`AI ${r.winProb||0}%`,v:r.winProb||0,c:hl||C.accent}].map(({l,v,c})=><div key={l}><div style={{fontSize:10,color:C.sub,marginBottom:3}}>{l}</div><Bar val={v} color={c}/></div>)}</div>
          {r.notes&&<div style={{fontSize:11,color:C.sub,lineHeight:1.5,background:C.bg,borderRadius:6,padding:"6px 9px"}}>{r.notes}</div>}
        </div></div>
      </div>);
    })}
    {res.raceVerdict&&<div style={{background:C.orangeGlo,border:`1px solid ${C.orange}30`,borderRadius:10,padding:"11px 13px",marginBottom:10,fontSize:12,color:C.text,lineHeight:1.7}}><div style={{color:C.orange,fontWeight:700,marginBottom:5}}>🏇 Race Verdict</div>{res.raceVerdict}</div>}
    {res.valueAlert&&<div style={{background:C.greenGlo,border:`1px solid ${C.green}30`,borderRadius:9,padding:"10px 13px",marginBottom:10,fontSize:12,color:C.text,lineHeight:1.6}}><span style={{color:C.green,fontWeight:700}}>💰 Value Alert · </span>{res.valueAlert}</div>}
    <button onClick={()=>{setRes(null);setInp("");}} style={{width:"100%",background:C.card,color:C.orange,border:`1px solid ${C.orange}35`,borderRadius:10,padding:12,fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Analyse Another Race</button>
  </div>);
  return(<div>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:10}}>
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center"}}><span style={{fontSize:11,color:C.orange,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}}>Race Card</span><span style={{fontSize:10,color:C.sub,marginLeft:"auto"}}>Any format</span></div>
      <textarea value={inp} onChange={e=>setInp(e.target.value)} placeholder={HINT} style={{width:"100%",minHeight:200,background:"transparent",color:C.text,border:"none",padding:"12px 14px",fontSize:12,fontFamily:"monospace",lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
    </div>
    {err&&<div style={{color:C.red,background:"#1a0808",border:"1px solid #3a1414",borderRadius:8,padding:"10px 13px",fontSize:12,marginBottom:10,lineHeight:1.6}}>⚠️ {err}</div>}
    <button onClick={go} disabled={loading||!inp.trim()} style={{width:"100%",background:loading||!inp.trim()?C.dim:C.orange,color:"#fff",border:"none",borderRadius:10,padding:13,fontWeight:800,fontSize:14,cursor:loading||!inp.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {loading?<><Spin/> Analysing…</>:"🔍 Analyse Race Card"}
    </button>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 13px",marginTop:10}}>
      <div style={{fontSize:9,color:C.orange,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Best results with</div>
      {["Horse name + odds","Form string (1-2-1-3)","Jockey & trainer","Distance + going","Weights + ratings"].map(t=><div key={t} style={{fontSize:11,color:C.sub,marginBottom:4,display:"flex",gap:7}}><span style={{color:C.orange}}>›</span>{t}</div>)}
    </div>
  </div>);
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const TABS=[{k:"slip",ic:"🎰",lb:"Slip Check"},{k:"wc",ic:"🏆",lb:"World Cup"},{k:"racing",ic:"🏇",lb:"Racing"}];
export default function App(){
  const [tab,setTab]=useState("slip");const [wcSub,setWcSub]=useState("upcoming");const [open,setOpen]=useState(null);const [sims,setSims]=useState(SIMS);const [running,setRunning]=useState(false);
  const rerun=()=>{setRunning(true);setTimeout(()=>{setSims(UPCOMING.map(m=>({...m,sim:runSim(m.pH,m.pD,m.pA,m.xgH,m.xgA)})));setRunning(false);},100);};
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px} textarea::placeholder{color:${C.sub};opacity:.5}`}</style>
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"11px 16px",position:"sticky",top:0,zIndex:50,display:"flex",alignItems:"center"}}>
      <span style={{fontSize:17,fontWeight:900,letterSpacing:"-0.6px"}}>Sports<span style={{color:C.accent}}>IQ</span></span>
      <span style={{fontSize:8,color:C.accent,background:C.accentGlo,border:`1px solid ${C.accent}35`,borderRadius:3,padding:"2px 5px",fontWeight:800,letterSpacing:.8,marginLeft:6}}>BETA</span>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"14px 15px 80px"}}>
      {tab==="slip"&&(<><div style={{marginBottom:14}}><div style={{fontSize:11,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Slip Analysis</div><div style={{fontSize:19,fontWeight:900,letterSpacing:"-.5px"}}>Your Stevenhills Bet</div></div><SlipAnalyser/></>)}
      {tab==="wc"&&(<>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div><div style={{fontSize:11,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Group Stage · Day 17</div><div style={{fontSize:19,fontWeight:900,letterSpacing:"-.5px"}}>World Cup 2026</div></div>
          <button onClick={rerun} disabled={running} style={{background:running?C.dim:C.accent,color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:running?"not-allowed":"pointer"}}>{running?"⏳":"⚡ Re-sim"}</button>
        </div>
        <div style={{display:"flex",gap:0,marginBottom:12}}>{[["upcoming","Predictions"],["results","Results"]].map(([k,l])=><button key={k} onClick={()=>setWcSub(k)} style={{padding:"7px 16px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:"transparent",color:wcSub===k?C.accent:C.sub,borderBottom:wcSub===k?`2px solid ${C.accent}`:"2px solid transparent"}}>{l}</button>)}</div>
        {wcSub==="upcoming"&&sims.map((m,i)=><SimCard key={i} m={m} open={open===i} onToggle={()=>setOpen(open===i?null:i)}/>)}
        {wcSub==="results"&&(<>{FINISHED_TODAY.map((m,i)=><FinCard key={i} m={m}/>)}<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:13,marginTop:6}}><Divider label="Goals Summary"/>{(()=>{const o25=FINISHED_TODAY.filter(m=>m.sH+m.sA>2.5).length;const o15=FINISHED_TODAY.filter(m=>m.sH+m.sA>1.5).length;const avg=(FINISHED_TODAY.reduce((s,m)=>s+m.sH+m.sA,0)/10).toFixed(1);return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><StatBox v={`${o25}/10`} l="Over 2.5" col={C.green}/><StatBox v={`${o15}/10`} l="Over 1.5" col={C.gold}/><StatBox v={avg} l="Avg Goals" col={C.accent}/></div>;})()}</div></>)}
      </>)}
      {tab==="racing"&&(<><div style={{marginBottom:14}}><div style={{fontSize:11,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>AI Powered</div><div style={{fontSize:19,fontWeight:900,letterSpacing:"-.5px"}}>Horse Racing</div></div><Racing/></>)}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:50}}>
      {TABS.map(({k,ic,lb})=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 0 7px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:19}}>{ic}</span><span style={{fontSize:10,fontWeight:tab===k?700:400,color:tab===k?C.accent:C.sub}}>{lb}</span>{tab===k&&<span style={{width:18,height:2,background:C.accent,borderRadius:1}}/>}</button>)}
    </div>
  </div>);
}
