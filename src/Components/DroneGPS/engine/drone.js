import {
  T,
  prog,
  lerp,
  clamp,
  FLIGHT,
  HOP_AT,
  HOP_LIFT,
  HOP_MOVE,
  HOP_TOTAL,
  SHUTDOWN,
} from "./timeline";

export const SPRITE_W = 360;

export const DEFAULT_ROTORS = [
  { x: 0.15, y: 0.3, r: 0.15 },
  { x: 0.85, y: 0.3, r: 0.15 },
  { x: 0.345, y: 0.208, r: 0.118 },
  { x: 0.655, y: 0.208, r: 0.118 },
];

const CRUISE = 120; // metres AGL at the top of the descent

/* --- repositioning hop, in scene units --- */
const HOP_DIST = 132; // px travelled along the ground
const HOP_PX = 30; // px the airframe lifts clear of the grass
const HOP_ALT = 1.6; // metres AGL reported while airborne in the hop
const HOP_TILT = 0.05; // rad, tips into the direction of travel
const IDLE = 0.32; // parked rotor effort, held through the hop
const HOP_POWER = 0.62; // rotor effort while translating
const HOP_KMH = 1.2; // peak ground speed while translating

const smoothstep = (x) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};

/**
 * Rotor effort over the whole mission: cruise, settle to a low idle on
 * touchdown, a burst for the repositioning hop, then spool down to silence.
 * Shared by the renderer and the engine hum so the two can never disagree.
 */
export function throttleEnv(t) {
  if (t < T.launch) return 0;
  let th = 0.9 + 0.1 * Math.sin(t * 9.1);

  const settle = prog(t, T.land - 1.2, T.land + 0.9);
  if (settle > 0) th = lerp(th, IDLE, smoothstep(settle));

  const hop = t - (T.land + HOP_AT);
  if (hop >= 0 && hop < HOP_TOTAL) {
    const liftP = smoothstep(prog(hop, 0, HOP_LIFT));
    const setP = smoothstep(prog(hop, HOP_LIFT + HOP_MOVE, HOP_TOTAL));
    th = lerp(IDLE, HOP_POWER, liftP * (1 - setP));
  } else if (hop >= HOP_TOTAL) {
    th = IDLE * clamp(1 - prog(hop, HOP_TOTAL, HOP_TOTAL + SHUTDOWN));
  }

  return th < 0.02 ? 0 : th;
}


const SCREEN_TOP = 130;
const Y_KEYS = [
  [0.0, 0.0],
  [0.34, 0.18],
  [0.62, 0.72],
  [0.76, 0.86],
  [0.88, 0.955],
  [0.95, 0.985],
  [1.0, 1.0],
];

const START_Y = SCREEN_TOP; // screen y before the aircraft enters the shot
const START_X_OFF = -1500; // screen x offset from the pad at cruise

/**
 * Altitude above ground, in metres, keyed against normalised flight progress.
 * Read as a cardinal spline so vertical speed stays continuous and the drone
 * never snaps between phases.
 */
const AGL_KEYS = [
  [0.0, 120], // cruise
  [0.34, 104], // still in transit, beginning to let down
  [0.62, 34], // main descent ~12 m/s
  [0.76, 26], // decelerating, checking the landing zone
  [0.88, 12], // established on final
  [0.95, 3.5], // flare, almost down
  [1.0, 0], // touchdown
];

/** Horizontal progress: eases out so the drone arrives over the pad at rest. */
const LINEUP = 0.76; // fraction of the flight spent closing horizontally

/** Cardinal-spline evaluation through (possibly unevenly spaced) keys. */
function splineEval(keys, u) {
  const n = keys.length;
  if (u <= keys[0][0]) return keys[0][1];
  if (u >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (i < n - 2 && u > keys[i + 1][0]) i++;
  const x0 = keys[i][0],
    y0 = keys[i][1];
  const x1 = keys[i + 1][0],
    y1 = keys[i + 1][1];
  const xm = keys[Math.max(0, i - 1)][0],
    ym = keys[Math.max(0, i - 1)][1];
  const xp = keys[Math.min(n - 1, i + 2)][0],
    yp = keys[Math.min(n - 1, i + 2)][1];
  const h = x1 - x0;
  const s = (u - x0) / h;
  const m0 = ((y1 - ym) / (x1 - xm)) * h;
  const m1 = ((yp - y0) / (xp - x0)) * h;
  const s2 = s * s,
    s3 = s2 * s;
  const v =
    (2 * s3 - 3 * s2 + 1) * y0 +
    (s3 - 2 * s2 + s) * m0 +
    (-2 * s3 + 3 * s2) * y1 +
    (s3 - s2) * m1;
  /* the profile is monotone, so clamp to the segment to kill any overshoot */
  return Math.max(Math.min(y0, y1), Math.min(v, Math.max(y0, y1)));
}

const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);

/**
 * Smooth wind drift. A sum of slow, incommensurate sines — all below ~0.3 Hz —
 * so it reads as gusts rather than vibration and can never alias at 30 or 60
 * fps. Everything that should look like the aircraft drifting uses this.
 */
function gust(t, seed) {
  return (
    Math.sin(t * 0.61 + seed) * 0.55 +
    Math.sin(t * 1.07 + seed * 1.7) * 0.3 +
    Math.sin(t * 1.83 + seed * 2.3) * 0.15
  );
}

/**
 * Settling vibration after touchdown. Amplitude falls with rotor effort and the
 * frequency stays low enough to sample cleanly, so it reads as a machine idling
 * rather than random twitching.
 */
function idleShake(t, throttle) {
  if (throttle <= 0.02) return 0;
  return (Math.sin(t * 4.1) * 0.8 + Math.sin(t * 8.3) * 0.22) * throttle;
}

/**
 * Full flight profile. Pure function of t, so scrubbing the timeline stays
 * frame-accurate and the HUD readouts always match what is on screen.
 */
export function flightState(t, restY, baseX) {
  /* one-entry memo: renderScene and drawFlight both ask for the same instant */
  if (memo && memo.t === t && memo.restY === restY && memo.baseX === baseX) return memo.st;

  const idle = {
    x: baseX,
    y: START_Y,
    scale: 0.45,
    rot: 0,
    throttle: 0,
    onGround: false,
    agl: CRUISE,
    alt01: 1,
    groundEffect: 0,
    speed: 0,
    vs: 0,
    phase: "STANDBY",
  };
  if (t < T.launch) return cache(t, restY, baseX, idle);

  const raw = clamp((t - T.launch) / FLIGHT);

  /* --- altitude: spline through the keyframes --- */
  const agl = splineEval(AGL_KEYS, raw);
  const groundEffect = 1 - clamp(agl / 22);

  /* --- horizontal: decelerating run in, parked over the pad for final --- */
  const hp = easeOutCubic(clamp(raw / LINEUP));
  let x = baseX + START_X_OFF * (1 - hp);

  /* --- screen height: its own projection curve, easing down to the pad --- */
  let y = lerp(SCREEN_TOP, restY, splineEval(Y_KEYS, raw));

  /* perspective: grows steadily as it closes on the camera and loses height */
  const scale = 0.45 + 0.55 * easeOutCubic(raw);

  /* --- velocities, by finite difference (still deterministic) --- */
  const dt = 0.05;
  const rawB = clamp((t - dt - T.launch) / FLIGHT);
  const aglB = splineEval(AGL_KEYS, rawB);
  const xB = baseX + START_X_OFF * (1 - easeOutCubic(clamp(rawB / LINEUP)));
  const vx = (x - xB) / dt; // px/s
  const vs = (aglB - agl) / dt; // m/s, positive while descending
  /* ground speed from a plausible cruise of ~52 km/h at peak closure */
  const hvMs = (clamp(Math.abs(vx) / 225) * 52) / 3.6;
  const speed = Math.round(Math.hypot(hvMs, Math.abs(vs)) * 3.6);

  /* --- attitude: bank into the direction of travel, nose up in the flare --- */
  let rot = clamp(vx / 900, -1, 1) * 0.1 * (1 - clamp(raw / LINEUP));
  rot -= prog(raw, 0.88, 0.99) * 0.045; // flare

  const throttle = throttleEnv(t);
  let onGround = false;
  let phase = "TRANSIT";

  if (raw < 0.34) phase = "TRANSIT";
  else if (raw < 0.62) phase = "DESCENT";
  else if (raw < LINEUP) phase = "LZ CHECK";
  else phase = "FINAL APPROACH";

  /* --- airborne turbulence: gentle gusts, a little stronger near the ground --- */
  const buffet = 0.5 + 0.9 * groundEffect + 0.35 * clamp(Math.abs(vx) / 500);
  x += gust(t, 0.0) * 3.0 * buffet;
  y += gust(t, 1.1) * 2.4 * buffet;
  rot += gust(t, 2.7) * 0.007 * buffet;

  /* --- touchdown: a settle, not a bump ---
     The flight path already arrives exactly at restY at T.land, so rather than
     snapping to a new oscillator we crossfade the airborne gust into the ground
     idle across the last 1.2 s and the first 0.9 s after contact. Nothing is
     discontinuous, so the last metre reads as a cushioned settle. */
  const settle = prog(t, T.land - 1.2, T.land + 0.9);
  let hopAGL = 0;
  let hopTravel = 0;

  if (settle > 0) {
    const ease = settle * settle * (3 - 2 * settle);
    const over = prog(t, T.land, T.land + 1.6);
    const cushion = Math.exp(-2.6 * over) * 4.5 * ease;

    const gustX = gust(t, 0.0) * 3.0 * buffet * (1 - ease);
    const gustR = gust(t, 2.7) * 0.007 * buffet * (1 - ease);

    x = baseX + gustX;
    y = lerp(y, restY, ease) - cushion + idleShake(t, throttle) * ease;
    rot = lerp(rot, 0, ease) + gustR + gust(t, 2.7) * 0.003 * throttle;

    if (t >= T.land) {
      onGround = true;
      phase = "TOUCHDOWN";
    }
  }

  /* --- post-landing reposition: a short hop to a new stance ---
     Sit for a moment on the skids, lift just clear of the grass, translate a
     short distance, set down again. Every term is 0 at both ends of its own
     ramp, so the hop picks up smoothly from the idle and hands back to it. */
  const hop = t - (T.land + HOP_AT);
  if (hop >= 0 && hop < HOP_TOTAL) {
    phase = "REPOSITION";
    onGround = false;

    const liftP = smoothstep(prog(hop, 0, HOP_LIFT));
    const moveP = prog(hop, HOP_LIFT, HOP_LIFT + HOP_MOVE);
    const setP = smoothstep(prog(hop, HOP_LIFT + HOP_MOVE, HOP_TOTAL));

    /* height above the skids: rises on the lift ramp, falls on the set ramp */
    const airborne = liftP * (1 - setP);
    hopTravel = HOP_DIST * moveP;
    hopAGL = HOP_ALT * airborne;

    x = baseX + hopTravel + gust(t, 0.0) * 0.7 * throttle;
    y = restY - HOP_PX * airborne + idleShake(t, throttle);
    /* tips slightly into the direction of travel, levels out to set down */
    rot = HOP_TILT * Math.sin(moveP * Math.PI) + gust(t, 2.7) * 0.003 * throttle;
  } else if (hop >= HOP_TOTAL) {
    /* parked in the new spot — hold, then spool down and go quiet */
    x = baseX + HOP_DIST;
    y = restY + idleShake(t, throttle);
    rot = gust(t, 2.7) * 0.003 * throttle;
    onGround = true;
    phase = "TOUCHDOWN";
  }

  /* telemetry follows the hop so the HUD and the picture stay in agreement */
  const hopping = hop >= 0 && hop < HOP_TOTAL;
  const outAGL = hopping ? hopAGL : Math.max(0, agl);
  let outSpeed = speed;
  let outVS = vs;
  if (hopping) {
    const inMove = prog(hop, HOP_LIFT, HOP_LIFT + HOP_MOVE);
    const climbing = prog(hop, 0, HOP_LIFT);
    const settling = prog(hop, HOP_LIFT + HOP_MOVE, HOP_TOTAL);
    outSpeed = Math.round(HOP_KMH * Math.sin(inMove * Math.PI));
    /* negative while climbing, positive while descending, level in transit */
    outVS = ((HOP_ALT / HOP_LIFT) * (settling - climbing));
  } else if (onGround) {
    outSpeed = 0;
    outVS = 0;
  }

  return cache(t, restY, baseX, {
    x,
    y,
    scale,
    rot,
    throttle,
    onGround,
    agl: outAGL,
    alt01: clamp(outAGL / CRUISE),
    groundEffect: 1 - clamp(outAGL / 22),
    speed: outSpeed,
    vs: outVS,
    phase,
  });
}

let memo = null;
function cache(t, restY, baseX, st) {
  memo = { t, restY, baseX, st };
  return st;
}

/** 0..1 rotor-load signal for the engine hum. */
export function rotorLoad(t) {
  return throttleEnv(t);
}

/* ---------------- golden-hour grade, baked once per sprite ---------------- */
let tintCache = null;
let tintedFrom = null;

function tinted(sprite) {
  if (tintCache && tintedFrom === sprite) return tintCache;
  const c = document.createElement("canvas");
  c.width = sprite.width;
  c.height = sprite.height;
  const g = c.getContext("2d");
  if (!g) return sprite;
  g.drawImage(sprite, 0, 0);
  g.globalCompositeOperation = "source-atop";
  /* warm sun on the right, cool sky bounce on the left */
  const lg = g.createLinearGradient(0, 0, c.width, c.height * 0.4);
  lg.addColorStop(0, "rgba(46,72,110,0.26)");
  lg.addColorStop(0.45, "rgba(255,225,190,0.05)");
  lg.addColorStop(1, "rgba(255,168,74,0.26)");
  g.fillStyle = lg;
  g.fillRect(0, 0, c.width, c.height);
  /* faint darkening underneath so it is not floating flat */
  const vg = g.createLinearGradient(0, c.height * 0.35, 0, c.height);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(10,6,2,0.28)");
  g.fillStyle = vg;
  g.fillRect(0, 0, c.width, c.height);
  tintCache = c;
  tintedFrom = sprite;
  return c;
}

/* ---------------- ground shadow ---------------- */
export function drawGroundShadow(ctx, x, groundY, st) {
  const spread = 1 + st.alt01 * 0.85;
  const a = 0.44 * (1 - st.alt01 * 0.72);
  if (a <= 0.01) return;
  const r = 118 * st.scale * spread;
  ctx.save();
  /* low sun from the right throws the shadow left and long */
  ctx.translate(x - 30 * st.scale - st.alt01 * 46, groundY);
  ctx.scale(1.5, 0.42);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, `rgba(12,8,4,${a})`);
  g.addColorStop(0.55, `rgba(12,8,4,${a * 0.5})`);
  g.addColorStop(1, "rgba(12,8,4,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ---------------- the drone ---------------- */
export function drawDrone(ctx, sprite, st, t, rotors) {
  const img = tinted(sprite);
  const w = SPRITE_W * st.scale;
  const h = (sprite.height / sprite.width) * w;

  ctx.save();
  ctx.translate(st.x, st.y);
  ctx.rotate(st.rot);

  /* warm backlight halo so the cutout sits in the plate */
  const halo = ctx.createRadialGradient(0, 0, w * 0.12, 0, 0, w * 0.72);
  halo.addColorStop(0, "rgba(255,196,120,0.16)");
  halo.addColorStop(1, "rgba(255,196,120,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.drawImage(img, -w / 2, -h / 2, w, h);

  /* navigation LEDs only — the spinning rotors are already motion-blurred in
     the plate, and overlaying synthetic blur discs reads as floating rings. */
  for (let i = 0; i < rotors.length; i++) {
    const r = rotors[i];
    const cx = (r.x - 0.5) * w;
    const cy = (r.y - 0.5) * h;
    const cr = r.r * w;
    const led = i < 2 ? (i === 0 ? "#ff3b30" : "#00e676") : null;
    if (!led) continue;
    const on = st.onGround ? Math.floor(t * 2) % 2 === 0 : true;
    ctx.save();
    ctx.globalAlpha = (on ? 0.9 : 0.22) * clamp(st.throttle * 4);
    ctx.fillStyle = led;
    ctx.shadowColor = led;
    ctx.shadowBlur = on ? 14 : 0;
    ctx.beginPath();
    ctx.arc(cx, cy + cr * 0.24, Math.max(2.5, 3.6 * st.scale), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/* Vector fallback if the photographic sprite could not be keyed. */
export function drawDroneVector(ctx, st, t) {
  const s = st.scale;
  ctx.save();
  ctx.translate(st.x, st.y);
  ctx.rotate(st.rot);
  ctx.scale(s, s);
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 170);
  halo.addColorStop(0, "rgba(255,196,120,.20)");
  halo.addColorStop(1, "rgba(255,196,120,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, 170, 0, Math.PI * 2);
  ctx.fill();
  for (const ang of [28, -28]) {
    ctx.save();
    ctx.rotate((ang * Math.PI) / 180);
    const ag = ctx.createLinearGradient(-100, 0, 100, 0);
    ag.addColorStop(0, "#90a4ae");
    ag.addColorStop(0.5, "#37474f");
    ag.addColorStop(1, "#90a4ae");
    ctx.fillStyle = ag;
    ctx.fillRect(-100, -5, 200, 10);
    ctx.restore();
  }
  const pts = [28, -28].flatMap((a) => {
    const r = (a * Math.PI) / 180;
    return [
      [Math.cos(r) * 100, Math.sin(r) * 100],
      [-Math.cos(r) * 100, -Math.sin(r) * 100],
    ];
  });
  for (const [px, py] of pts) {
    ctx.fillStyle = "rgba(200,240,255,.12)";
    ctx.beginPath();
    ctx.arc(px, py, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,229,255,.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (st.throttle > 0.02) {
      ctx.save();
      ctx.globalAlpha = 0.55 * st.throttle;
      ctx.translate(px, py);
      ctx.rotate(t * 40);
      ctx.fillStyle = "rgba(236,239,241,.7)";
      ctx.fillRect(-40, -3, 80, 6);
      ctx.restore();
    }
    ctx.fillStyle = "#263238";
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const bg = ctx.createLinearGradient(0, -22, 0, 22);
  bg.addColorStop(0, "#eceff1");
  bg.addColorStop(1, "#263238");
  ctx.fillStyle = bg;
  ctx.strokeStyle = "#cfd8dc";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-30, -22);
  ctx.arcTo(42, -22, 42, 22, 12);
  ctx.arcTo(42, 22, -42, 22, 12);
  ctx.arcTo(-42, 22, -42, -22, 12);
  ctx.arcTo(-42, -22, 42, -22, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/* ---------------- procedural, scrub-safe downwash dust ---------------- */
const DUST = 52;
const hash = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

export function drawDownwash(ctx, t, cx, cy, st) {
  /* Dust lifts only when the aircraft is genuinely in ground effect. The
     touchdown blast is a short transient that decays, rather than running
     forever — without the decay it kept blowing after shutdown. */
  const burst = prog(t, T.land - 0.25, T.land + 0.35) * (1 - prog(t, T.land, T.land + 2.1));
  const power = Math.max(st.groundEffect * st.throttle, burst * 0.9);
  if (power <= 0.03) return;

  const life = 1.5;
  ctx.save();
  for (let i = 0; i < DUST; i++) {
    const h1 = hash(i + 1);
    const h2 = hash(i + 91.7);
    const h3 = hash(i + 33.3);
    const off = h1 * life;
    const age = (t + off) % life;
    const p = age / life;
    if (p > 0.82) continue;

    /* start under the airframe, blast outward and slightly with the wind */
    const ang = h2 * Math.PI * 2;
    const dist = 90 + p * (300 + h3 * 260);
    const x = cx + Math.cos(ang) * dist * 1.25 + p * 130;
    const y = cy + Math.sin(ang) * dist * 0.42 - p * 26;
    const a = Math.sin(p * Math.PI) * 0.34 * power * (1 - p * 0.4);
    if (a <= 0.01) continue;
    const r = 8 + p * 46 * (0.6 + h3 * 0.8);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(238,218,188,${a})`);
    g.addColorStop(1, "rgba(238,218,188,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- guidance readout during the approach ---------------- */
export function drawApproachTag(ctx, t, cx, cy, st) {
  if (t < T.lock || t > T.land + 1.5) return;
  const a = Math.min(prog(t, T.lock, T.lock + 0.4), 1 - prog(t, T.land + 0.9, T.land + 1.5));
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = '18px "Share Tech Mono", monospace';
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(`LZ-01  ·  AGL ${st.agl.toFixed(1)} M`, cx - 250, cy - 132);
  ctx.font = '16px "Share Tech Mono", monospace';
  ctx.fillStyle = "#7fe9ff";
  ctx.fillText(
    `VS ${st.vs >= 0 ? "-" : "+"}${Math.abs(st.vs).toFixed(1)} M/S  ·  GS ${st.speed} KM/H`,
    cx - 250,
    cy - 106
  );
  ctx.fillStyle = st.phase === "LZ CHECK" ? "#ffd54f" : "#00ffa3";
  ctx.fillText(
    st.onGround ? "CONTACT · SKIDS DOWN" : `${st.phase} · AUTO-LAND ARMED`,
    cx - 250,
    cy - 82
  );
  /* leader line down to the pad */
  ctx.strokeStyle = "rgba(255,213,79,.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 254, cy - 120);
  ctx.lineTo(cx - 288, cy - 34);
  ctx.stroke();
  ctx.restore();
}

/** Distance-to-target readout, shrinking to zero as it closes on the pad. */
export function rangeToPad(t) {
  if (t < T.launch) return 0;
  const raw = clamp((t - T.launch) / FLIGHT);
  const hp = easeOutCubic(clamp(raw / LINEUP));
  return (1 - hp) * 420; // metres, invented but consistent with the closing speed
}
