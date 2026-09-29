import {
  W,
  H,
  FPS,
  CH,
  CONFIG,
  T,
  prog,
  lerp,
  clamp,
  easeOut,
  HOP_AT,
} from "./timeline";
import {
  SPRITE_W,
  DEFAULT_ROTORS,
  flightState,
  rangeToPad,
  drawDrone,
  drawDroneVector,
  drawGroundShadow,
  drawDownwash,
  drawApproachTag,
  rotorLoad,
} from "./drone";

const { LAT, LON, ALT } = CONFIG;
export const PLACE = "";
const MONO = (s) => `${s}px "Share Tech Mono", monospace`;
const ORB = (s) => `800 ${s}px Orbitron, sans-serif`;

const TX = W * 0.64;
const TY = H * 0.76;
const PAD_Y = TY + 8;

/* ---------------- BACKDROP: real place, aerial photo ---------------- */
function drawPhoto(ctx, img, t, dp, pad) {
  const areaW = W + pad * 2;
  const areaH = H + pad * 2;
  /* push in and drift toward the landing zone as the drone comes down */
  const zoom = 1.04 + 0.16 * dp + 0.015 * Math.sin(t * 0.35);
  const base = Math.max(areaW / img.naturalWidth, areaH / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * base;
  const dh = img.naturalHeight * base;
  const drift = 120 * dp;
  let dx = -pad + (areaW - dw) / 2 + Math.sin(t * 0.17) * 22 - drift * 0.55;
  let dy = -pad + (areaH - dh) / 2 - dp * 30 + Math.cos(t * 0.13) * 14;
  dx = Math.max(areaW - pad - dw, Math.min(-pad, dx));
  dy = Math.max(areaH - pad - dh, Math.min(-pad, dy));
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawFallbackBG(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#8fc4ec");
  g.addColorStop(0.42, "#f4c78a");
  g.addColorStop(0.55, "#c98d5a");
  g.addColorStop(1, "#5a4a35");
  ctx.fillStyle = g;
  ctx.fillRect(-50, -50, W + 100, H + 100);
  const hz = H * 0.5;
  const hg = ctx.createLinearGradient(0, hz - 70, 0, hz + 70);
  hg.addColorStop(0, "rgba(255,214,150,0)");
  hg.addColorStop(0.5, `rgba(255,214,150,${0.35 + 0.05 * Math.sin(t)})`);
  hg.addColorStop(1, "rgba(255,214,150,0)");
  ctx.fillStyle = hg;
  ctx.fillRect(0, hz - 70, W, 140);
}

function drawBG(ctx, t, dp, assets, pad) {
  if (assets && assets.place) drawPhoto(ctx, assets.place, t, dp, pad);
  else drawFallbackBG(ctx, t);

  const s = ctx.createLinearGradient(0, 0, 0, H);
  s.addColorStop(0, "rgba(2,8,18,.5)");
  s.addColorStop(0.4, "rgba(2,8,18,.14)");
  s.addColorStop(0.72, "rgba(0,6,14,.28)");
  s.addColorStop(1, "rgba(0,6,14,.6)");
  ctx.fillStyle = s;
  ctx.fillRect(-pad, -pad, W + pad * 2, H + pad * 2);
}

/* ---------------- TITLE ---------------- */
function drawTitle(ctx, t) {
  if (t >= T.titleEnd) return;
  const a = Math.min(prog(t, 0.3, 1.3), 1 - prog(t, 3, 4));
  const s = lerp(1.15, 1, easeOut(prog(t, 0, 4)));
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(W / 2, H / 2);
  ctx.scale(s, s);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = ORB(104);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 50;
  ctx.fillText("MISSION: LANDFALL", 0, -20);
  ctx.shadowBlur = 0;
  ctx.font = MONO(28);
  ctx.fillStyle = "#bfefff";
  ctx.fillText("A U T O N O M O U S    D R O N E    N A V I G A T I O N", 0, 70);
  ctx.font = MONO(20);
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(PLACE, 0, 118);
  ctx.restore();
}

/* ---------------- NAV PANEL ---------------- */
export function statusText(t) {
  if (t >= T.run) return { txt: "LANDED · DRONE RUNNING", col: "#00ffa3" };
  if (t >= T.land + HOP_AT) return { txt: "REPOSITIONING", col: "#7fd8ff" };
  if (t >= T.land) return { txt: "TOUCHDOWN CONFIRMED", col: "#ffd54f" };
  if (t >= T.launch) {
    const st = flightState(t, 0, 0);
    const col =
      st.phase === "LZ CHECK" ? "#ffd54f" : st.phase === "FINAL APPROACH" ? "#00ffa3" : "#7fd8ff";
    return { txt: `${st.phase} · AUTO-LAND`, col };
  }
  if (t >= T.lock) return { txt: "LOCKING COORDINATES ...", col: "#ffd54f" };
  return { txt: "AWAITING INPUT", col: "#5fa8c9" };
}

function field(ctx, t, label, val, a, b, x, y, w) {
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = MONO(18);
  ctx.fillStyle = "#7fc2e0";
  ctx.fillText(label, x, y);

  const active = t >= a - 0.3 && t < b + 0.25;
  ctx.fillStyle = "rgba(0,8,18,.86)";
  ctx.fillRect(x, y + 18, w, 62);
  ctx.strokeStyle = active ? "#00e5ff" : "rgba(0,229,255,.32)";
  ctx.lineWidth = 2;
  if (active) {
    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 18;
  }
  ctx.strokeRect(x, y + 18, w, 62);
  ctx.shadowBlur = 0;

  const n = t < a ? 0 : Math.min(val.length, Math.floor((t - a) / CH) + 1);
  const txt = val.slice(0, n);
  ctx.font = MONO(32);
  ctx.fillStyle = "#fff";
  ctx.fillText(txt, x + 18, y + 50);
  if (active && Math.floor(t * 3) % 2 === 0) {
    const tw = ctx.measureText(txt).width;
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(x + 22 + tw, y + 33, 14, 34);
  }
}

function drawPanel(ctx, t) {
  const p = easeOut(prog(t, T.panel, T.panel + 1));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.translate(lerp(-90, 0, p), 0);

  const x = 90,
    y = 160,
    w = 560,
    h = 620,
    c = 40;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - c, y);
  ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.lineTo(x, y + h - c);
  ctx.closePath();
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, "rgba(0,20,42,.9)");
  g.addColorStop(1, "rgba(0,6,16,.94)");
  ctx.fillStyle = g;
  ctx.shadowColor = "rgba(0,229,255,.5)";
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(0,229,255,.7)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = ORB(24);
  ctx.fillStyle = "#00e5ff";
  ctx.fillText("NAV CONSOLE", x + 35, y + 50);

  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = "#00ffa3";
    ctx.beginPath();
    ctx.arc(x + w - 128, y + 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = "right";
    ctx.font = MONO(18);
    ctx.fillText("LIVE", x + w - 60, y + 50);
  }
  ctx.strokeStyle = "rgba(0,229,255,.3)";
  ctx.beginPath();
  ctx.moveTo(x + 35, y + 85);
  ctx.lineTo(x + w - 35, y + 85);
  ctx.stroke();

  field(ctx, t, "LATITUDE", LAT, T.lat, T.latE, x + 35, y + 120, w - 70);
  field(ctx, t, "LONGITUDE", LON, T.lon, T.lonE, x + 35, y + 230, w - 70);
  field(ctx, t, "ALTITUDE (M)", ALT, T.alt, T.altE, x + 35, y + 340, w - 70);

  const pressed = t >= T.press && t < T.press + 0.3;
  const s = pressed ? 0.94 : 1;
  const bx = x + 35,
    by = y + 460,
    bw = w - 70,
    bh = 70;
  ctx.save();
  ctx.translate(bx + bw / 2, by + bh / 2);
  ctx.scale(s, s);
  const bg = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
  bg.addColorStop(0, pressed ? "#ffffff" : "#00e5ff");
  bg.addColorStop(1, pressed ? "#b9ffe6" : "#00ffa3");
  ctx.beginPath();
  ctx.moveTo(-bw / 2 + 25, -bh / 2);
  ctx.lineTo(bw / 2, -bh / 2);
  ctx.lineTo(bw / 2 - 25, bh / 2);
  ctx.lineTo(-bw / 2, bh / 2);
  ctx.closePath();
  ctx.fillStyle = bg;
  if (pressed) {
    ctx.shadowColor = "#00ffa3";
    ctx.shadowBlur = 45;
  }
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#001a12";
  ctx.font = ORB(26);
  ctx.textAlign = "center";
  ctx.fillText("GO LOCATION", 8, 2);
  ctx.beginPath();
  ctx.moveTo(bw / 2 - 68, -11);
  ctx.lineTo(bw / 2 - 44, 0);
  ctx.lineTo(bw / 2 - 68, 11);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#001a12";
  ctx.stroke();
  ctx.restore();

  const st = statusText(t);
  ctx.textAlign = "left";
  ctx.font = MONO(22);
  ctx.fillStyle = st.col;
  ctx.fillText(st.txt, x + 35, y + 575);
  ctx.restore();
}

/* ---------------- MOUSE CURSOR ---------------- */
function drawCursor(ctx, t) {
  const a0 = T.altE + 0.15;
  if (t < a0 || t > T.press + 0.8) return;
  const p = 1 - Math.pow(1 - prog(t, a0, T.press - 0.05), 3);
  const x = lerp(900, 390, p);
  const y = lerp(950, 665, p);
  ctx.save();
  ctx.globalAlpha = 1 - prog(t, T.press + 0.4, T.press + 0.8);
  if (t >= T.press && t < T.press + 0.5) {
    const rp = prog(t, T.press, T.press + 0.5);
    ctx.strokeStyle = `rgba(0,255,163,${1 - rp})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 10 + rp * 55, 0, Math.PI * 2);
    ctx.stroke();
  }
  const cs = t >= T.press && t < T.press + 0.2 ? 0.85 : 1;
  ctx.translate(x, y);
  ctx.scale(cs * 1.6, cs * 1.6);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 22);
  ctx.lineTo(6, 17);
  ctx.lineTo(10, 26);
  ctx.lineTo(14, 24);
  ctx.lineTo(10, 15);
  ctx.lineTo(17, 15);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

/* ---------------- TELEMETRY + RADAR ---------------- */
function drawTele(ctx, t, st) {
  const p = easeOut(prog(t, T.panel + 0.5, T.panel + 1.5));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const x = W - 100;
  let y = 178;
  const rows = [
    ["ALTITUDE", (t < T.altE ? 0 : Math.round(st.agl)) + " M", false],
    ["GROUND SPEED", (t < T.launch ? 0 : st.speed) + " KM/H", false],
    ["VERTICAL", (t < T.launch ? "0.0" : Math.abs(st.vs).toFixed(1)) + " M/S", false],
    ["RANGE", rangeToPad(t).toFixed(0) + " M", false],
    ["BATTERY", "94 %", false],
    ["STATUS", t >= T.run ? "RUNNING" : t >= T.launch ? "FLYING" : "READY", t >= T.run],
  ];
  for (const [k, v, hot] of rows) {
    ctx.font = MONO(17);
    ctx.fillStyle = "#7fe9ff";
    ctx.fillText(k, x, y);
    ctx.font = ORB(30);
    ctx.fillStyle = hot ? "#00ffa3" : "#fff";
    ctx.fillText(v, x, y + 33);
    y += 76;
  }
  const r = 90,
    rx = x - r,
    ry = y + 90;
  ctx.strokeStyle = "rgba(0,229,255,.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(rx, ry, r + 14, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,10,22,.55)";
  ctx.fill();
  for (const rad of [r, r * 0.66, r * 0.33]) {
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(rx - r, ry);
  ctx.lineTo(rx + r, ry);
  ctx.moveTo(rx, ry - r);
  ctx.lineTo(rx, ry + r);
  ctx.stroke();
  const a = t * 2.5;
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(0,229,255,${0.5 * (1 - i / 30)})`;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.arc(rx, ry, r, a - (i + 1) * 0.04, a - i * 0.04);
    ctx.closePath();
    ctx.fill();
  }
  /* blip tracks the drone: closing horizontally while losing altitude */
  if (t > T.lock) {
    const bl = 1 - clamp(st.alt01);
    ctx.fillStyle = "#ff5252";
    ctx.shadowColor = "#ff5252";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(rx - 45 + 70 * bl, ry - 40 + 70 * bl, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

/* ---------------- GPS TARGET RETICLE ---------------- */
function drawTarget(ctx, t, mobile) {
  const p = prog(t, T.lock, T.lock + 0.6);
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p * 0.6;
  ctx.translate(TX, PAD_Y);
  ctx.scale(1, 0.38);
  /* a single quiet dashed ring + corner brackets: a GPS marker on the grass,
     no painted pad, so the landscape stays the hero */
  ctx.setLineDash([16, 14]);
  ctx.lineDashOffset = -t * 30;
  ctx.strokeStyle = "#ff8a80";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 118, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  for (let q = 0; q < 4; q++) {
    ctx.save();
    ctx.rotate((q * Math.PI) / 2);
    ctx.strokeStyle = "#ff5252";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(118, -20);
    ctx.lineTo(142, -20);
    ctx.lineTo(142, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  if (mobile) return; /* label would be cropped off-screen on a phone */
  ctx.save();
  ctx.globalAlpha = p;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = MONO(20);
  ctx.fillStyle = "#ffd0cc";
  ctx.fillText("TARGET :: " + LAT + " / " + LON, TX + 250, PAD_Y - 118);
  ctx.font = MONO(17);
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(PLACE, TX + 250, PAD_Y - 90);
  ctx.restore();
}

/* ---------------- FLIGHT ---------------- */
function drawFlight(ctx, t, assets) {
  const sprite = assets && assets.drone ? assets.drone : null;
  const asp = sprite ? sprite.height / sprite.width : 0.62;
  const w = SPRITE_W;
  const restY = sprite ? TY - (w * asp) / 2 - 6 : TY - 55;
  const st = flightState(t, restY, TX);

  if (t < T.launch) return;

  drawGroundShadow(ctx, st.x, PAD_Y, st);
  /* downwash tracks the airframe, so dust follows the repositioning hop */
  drawDownwash(ctx, t, st.x, PAD_Y, st);
  drawApproachTag(ctx, t, TX, PAD_Y, st);

  if (sprite) drawDrone(ctx, sprite, st, t, (assets && assets.rotors) || DEFAULT_ROTORS);
  else drawDroneVector(ctx, st, t);
}

/* ---------------- BANNER ---------------- */
function drawBanner(ctx, t, cx) {
  const p = easeOut(prog(t, T.run + 0.5, T.run + 1.7));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(cx == null ? 1180 : cx, 215 + (1 - p) * 40);
  ctx.font = ORB(46);
  ctx.fillStyle = "#00ffa3";
  ctx.shadowColor = "#00ffa3";
  ctx.shadowBlur = 40;
  if (cx == null) {
    ctx.fillText("START REHEARSAL GPS LOCATION", 0, -32);
    ctx.fillText("BEFORE FLYING", 0, 18);
  } else {
    /* narrow screen: three short lines instead of two long ones */
    ctx.fillText("START REHEARSAL", 0, -62);
    ctx.fillText("GPS LOCATION", 0, -12);
    ctx.fillText("BEFORE FLYING", 0, 38);
  }
  ctx.shadowBlur = 0;
  ctx.font = MONO(24);
  ctx.fillStyle = "#c9ffe9";
  ctx.fillText("DRONE LANDED  ·  SYSTEMS RUNNING", 0, cx == null ? 66 : 92);
  ctx.restore();
}

/* ---------------- OVERLAYS ---------------- */
function tc(t) {
  const m = Math.floor(t / 60),
    s = Math.floor(t % 60),
    f = Math.floor((t % 1) * FPS);
  return [m, s, f].map((v) => String(v).padStart(2, "0")).join(":");
}

function drawOverlays(ctx, t, mobile) {
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,.8)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(0,0,0,.1)";
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);

  const fp = prog(t, T.land, T.land + 0.8);
  if (fp > 0 && fp < 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - fp)})`;
    ctx.fillRect(0, 0, W, H);
  }
  const f = Math.max(1 - prog(t, 0, 0.8), prog(t, T.end - 1.2, T.end));
  if (f > 0) {
    ctx.fillStyle = `rgba(0,0,0,${f})`;
    ctx.fillRect(0, 0, W, H);
  }

  if (mobile) return; /* no letterbox bars / corner marks on a phone */

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, 90);
  ctx.fillRect(0, H - 90, W, 90);

  ctx.font = MONO(18);
  ctx.fillStyle = "rgba(140,240,255,.75)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("    ", 40, 45);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,213,79,.8)";
  ctx.fillText(PLACE, W - 40, 45);

  const m = 120,
    L = 42;
  ctx.strokeStyle = "rgba(0,229,255,.35)";
  ctx.lineWidth = 2.5;
  const corners = [
    [m, m, 1, 1],
    [W - m, m, -1, 1],
    [m, H - m, 1, -1],
    [W - m, H - m, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + L * sx, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + L * sy);
    ctx.stroke();
  }
}

/* ---------------- MAIN RENDER ---------------- */
export function renderScene(ctx, t, assets, opts = {}) {
  /* opts.mobile: portrait phone layout (camera crop is handled by the caller) */
  const mobile = !!opts.mobile;
  const sprite = assets && assets.drone ? assets.drone : null;
  const asp = sprite ? sprite.height / sprite.width : 0.62;
  const restY = sprite ? TY - (SPRITE_W * asp) / 2 - 6 : TY - 55;
  const st = flightState(t, restY, TX);
  /* HUD-only view: reads zero until the altitude is typed in, then holds at
     cruise. Copied rather than mutated, because flightState memoises the state
     it returns and drawFlight reads the same object. */
  const hud = { ...st };
  if (t < T.altE) hud.agl = 0;
  else if (t < T.launch) {
    hud.agl = 120;
    hud.vs = 0;
    hud.speed = 0;
  }
  /* camera pushes in as the aircraft commits to the descent */
  const dp = clamp(prog(t, T.launch, T.land) * 1.15);

  /* Tracking shot: the lens leads the aircraft while it is still closing on
     the pad, then eases onto the landing zone and holds for the touchdown.
     The aim point is lagged and blended so gust noise on the airframe is not
     copied straight into the camera — the shot stays steady and the drone is
     what appears to move. */
  const follow = 0.1 * (1 - prog(t, T.launch, T.land + 1.5));
  /* clamped so the lag sample never reaches back before launch, which would
     pop the camera on the first frame of the shot */
  const lag = flightState(Math.max(t - 0.45, T.launch), restY, TX);
  const aimX = lerp(lag.x, st.x, 0.35);
  const aimY = lerp(lag.y, st.y, 0.35);
  const camX = (aimX - TX) * follow;
  const camY = (aimY - restY) * follow * 0.5;

  ctx.save();
  const sp = prog(t, T.land, T.land + 0.7);
  if (sp > 0 && sp < 1) {
    /* touchdown bump: damped, low enough frequency to sample cleanly */
    const a = 14 * (1 - sp);
    ctx.translate(Math.sin(t * 28) * a, Math.cos(t * 22) * a * 0.55);
  }
  const z = 1 + 0.05 * prog(t, T.lock, T.end);
  ctx.translate(W / 2, H / 2);
  ctx.scale(z, z);
  ctx.translate(-W / 2, -H / 2);
  ctx.translate(-camX, -camY);

  /* During the long running hold the shot is otherwise locked off, so let the
     lens breathe — a very slow arc around the parked aircraft. Kept well inside
     the overscan pad so no edge is ever revealed. */
  const hold = prog(t, T.run, T.end);
  if (hold > 0) {
    ctx.translate(-Math.sin(hold * 1.1) * 34 * hold, -(Math.cos(hold * 0.8) * 16 - 12) * hold);
  }

  /* the hold arc adds its own travel, so include it in the overscan */
  const arcX = hold > 0 ? Math.abs(Math.sin(hold * 1.1)) * 34 * hold : 0;
  const arcY = hold > 0 ? Math.abs(Math.cos(hold * 0.8) * 16 - 12) * hold : 0;
  const pad = 80 + Math.abs(camX) + arcX + Math.abs(camY) + arcY;
  drawBG(ctx, t, dp, assets, pad);
  if (t < T.titleEnd) {
    ctx.fillStyle = `rgba(0,0,0,${0.55 * (1 - prog(t, 3, 4))})`;
    ctx.fillRect(-pad, -pad, W + pad * 2, H + pad * 2);
  }
  drawTarget(ctx, t, mobile);
  drawFlight(ctx, t, assets);
  ctx.restore();

  /* ---- HUD stays locked to the lens, so it never wobbles with the shot ---- */
  drawPanel(ctx, t);
  drawCursor(ctx, t);
  if (!mobile) drawTele(ctx, t, hud); /* phones get a compact HUD instead */
  drawBanner(ctx, t, mobile ? opts.cx : null);
  drawTitle(ctx, t);

  drawOverlays(ctx, t, mobile);
}

/* ---------------- Playback helpers ---------------- */
export function typedCounts(t) {
  const c = (a, len) => (t < a ? 0 : Math.min(len, Math.floor((t - a) / CH) + 1));
  return {
    lat: c(T.lat, LAT.length),
    lon: c(T.lon, LON.length),
    alt: c(T.alt, ALT.length),
  };
}

export function flightSpeed01(t) {
  return rotorLoad(t);
}

/** Numbers for the compact phone HUD (same values the desktop side panel shows). */
export function telemetry(t) {
  const st = flightState(t, 0, 0);
  let agl = st.agl;
  let vs = st.vs;
  let speed = st.speed;
  if (t < T.altE) agl = 0;
  else if (t < T.launch) {
    agl = 120;
    vs = 0;
    speed = 0;
  }
  return {
    alt: t < T.altE ? 0 : Math.round(agl),
    speed: t < T.launch ? 0 : speed,
    vs: t < T.launch ? "0.0" : Math.abs(vs).toFixed(1),
    range: Math.round(rangeToPad(t)),
  };
}