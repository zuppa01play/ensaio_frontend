/* ================= MISSION CONFIG ================= */
export const CONFIG = {
  LAT: "13.0827° N",
  LON: "80.2707° E",
  ALT: "120",
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const CH = 0.1; // seconds per typed character

/** Seconds from launch to touchdown. A real auto-land from 120 m takes this long. */
export const FLIGHT = 3;

/* ---------------- post-landing reposition ----------------
   After touchdown the aircraft sits for a moment, then makes a short hop to a
   new stance before the rotors shut down. */
export const HOP_AT = 1.4; // seconds after touchdown before the hop begins
export const HOP_LIFT = 0.85; // lift clear of the grass
export const HOP_MOVE = 1.25; // translate sideways
export const HOP_SET = 0.9; // set down again
export const HOP_TOTAL = HOP_LIFT + HOP_MOVE + HOP_SET;
export const SHUTDOWN = 1.7; // rotor spool-down once parked in the new spot

/* ---------------- RUNNING HOLD ----------------
   How long the aircraft sits on station, systems live, before the fade-out.
   This is the long tail of the sequence — raise it to let the shot breathe. */
export const RUN_HOLD = 2;

/* ---------------- TIMELINE (seconds) ---------------- */
export const T = (() => {
  const t = {};
  t.titleEnd = 4;
  t.panel = 4;
  t.lat = 5.2;
  t.latE = t.lat + CONFIG.LAT.length * CH;
  t.lon = t.latE + 0.4;
  t.lonE = t.lon + CONFIG.LON.length * CH;
  t.alt = t.lonE + 0.4;
  t.altE = t.alt + CONFIG.ALT.length * CH;
  t.press = t.altE + 0.9;
  t.lock = t.press + 0.4;
  t.launch = t.lock + 1.6;
  /* a real auto-land from 120 m: 20 s of approach, a settle, a short
     repositioning hop, then shutdown */
  t.land = t.launch + FLIGHT;
  t.run = t.land + HOP_AT + HOP_TOTAL + 0.1;
  /* the running hold, then a 1.2 s fade to black */
  t.end = t.run + RUN_HOLD + 1.0;
  return t;
})();

export const DURATION = T.end;

/* ---------------- Chapters for the scrub bar ---------------- */
export const CHAPTERS = [
  { t: 0, label: "TITLE" },
  { t: T.panel, label: "CONSOLE" },
  { t: T.press, label: "ENGAGE" },
  { t: T.lock, label: "GPS LOCK" },
  { t: T.launch, label: "TRANSIT" },
  { t: T.launch + FLIGHT * 0.34, label: "DESCENT" },
  { t: T.launch + FLIGHT * 0.62, label: "LZ CHECK" },
  { t: T.launch + FLIGHT * 0.76, label: "FINAL" },
  { t: T.land, label: "TOUCHDOWN" },
  { t: T.land + HOP_AT, label: "REPOSITION" },
  { t: T.run, label: "RUNNING" },
];

/* ---------------- Math helpers ---------------- */
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, p) => a + (b - a) * p;
export const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x) => 1 - Math.pow(1 - x, 3);

export const fmtTime = (t) => {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
};
