import { useState, useRef } from "react";

// ─── Palette: deep pitch-black with electric blue signature ──────────────────
const C = {
  bg:        "#050810",
  surface:   "#090e1a",
  card:      "#0d1320",
  cardHov:   "#111827",
  border:    "#151f30",
  borderLit: "#1e2f48",
  accent:    "#2d7fff",
  accentGlo: "#2d7fff18",
  gold:      "#f0b429",
  goldGlo:   "#f0b42918",
  red:       "#f03e3e",
  redGlo:    "#f03e3e18",
  green:     "#00c97a",
  greenGlo:  "#00c97a18",
  purple:    "#8b5cf6",
  purpleGlo: "#8b5cf618",
  orange:    "#fb923c",
  orangeGlo: "#fb923c18",
  teal:      "#14b8a6",
  tealGlo:   "#14b8a618",
  text:      "#e1eaff",
  sub:       "#3d5278",
  dim:       "#1b2840",
};

export default function App() {
  return <div style={{background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif'}}>
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 48, marginBottom: 16}}>⚽🏇🎰</div>
      <h1 style={{fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px'}}>Sports<span style={{color: C.accent}}>IQ</span></h1>
      <p style={{color: C.sub, marginTop: 8}}>Loading full app...</p>
    </div>
  </div>;
}
