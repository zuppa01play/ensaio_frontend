import { useEffect, useRef } from "react";
import { renderScene, telemetry, statusText } from "../engine/scene";
import { flightState } from "../engine/drone";
import { loadAssets } from "../engine/assets";
import { W, H, T, DURATION, prog, lerp, clamp, easeIO } from "../engine/timeline";


const M_VW_TITLE = 1250; // world px visible across the phone during the title
const M_VW = 700; // world px visible across the phone for everything else
const M_CONSOLE_X = 370; // centre of the NAV CONSOLE panel
const M_BASE_X = W * 0.64; // where the drone lands (matches scene.js)

function mobileCamera(t, cw, ch) {
  const zoomIn = easeIO(prog(t, 2.8, 4.6));
  const vw = lerp(M_VW_TITLE, M_VW, zoomIn);
  let cx = lerp(W / 2, M_CONSOLE_X, zoomIn);
  if (t >= T.launch) {
    /* follow the drone (never panning back left of the console) */
    cx = Math.max(M_CONSOLE_X, flightState(t, 0, M_BASE_X).x);
  }
  cx = clamp(cx, vw / 2, W - vw / 2);
  const sc = cw / vw;
  return { sc, cx, ox: cw / 2 - cx * sc, oy: (ch - H * sc) / 2 };
}

function hudBox(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, 8) : ctx.rect(x, y, w, h);
  ctx.fillStyle = "rgba(0,10,22,.78)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0,229,255,.4)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawMobileHud(ctx, t, cw, ch, cam) {
  const a = prog(t, T.panel + 0.3, T.panel + 1.2);
  if (a <= 0) return;
  const d = telemetry(t);
  const cells = [
    ["ALT", `${d.alt} M`],
    ["SPEED", `${d.speed} KM/H`],
    ["V/S", `${d.vs} M/S`],
    ["RANGE", `${d.range} M`],
  ];
  const gap = 6;
  const pad = 10;
  const w = (cw - pad * 2 - gap * 3) / 4;
  const h = 46;
  const top = Math.max(8, cam.oy / 2 - h / 2);

  ctx.save();
  ctx.globalAlpha = a;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  cells.forEach(([k, v], i) => {
    const x = pad + i * (w + gap);
    hudBox(ctx, x, top, w, h);
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillStyle = "#7fe9ff";
    ctx.fillText(k, x + w / 2, top + 14);
    ctx.font = `800 ${w < 84 ? 12 : 14}px Orbitron, sans-serif`;
    ctx.fillStyle = "#fff";
    ctx.fillText(v, x + w / 2, top + 32);
  });

  /* status line under the picture */
  const st = statusText(t);
  const worldBottom = cam.oy + H * cam.sc;
  const by = Math.min(ch - 22, worldBottom + Math.max(22, (ch - worldBottom) / 2));
  ctx.font = '13px "Share Tech Mono", monospace';
  ctx.fillStyle = st.col;
  ctx.fillText(st.txt, cw / 2, by);
  ctx.restore();
}

export default function MissionCanvas({ player, phase, onEnded }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = performance.now();
    let idle = 0;
    let doneFired = false;
    let assets = null;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.floor(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.floor(cv.clientHeight * dpr));
    };
    fit();
    window.addEventListener("resize", fit);

    const loop = (now) => {
      if (!running) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const p = phaseRef.current;

      let t;
      if (p === "menu") {
        /* gentle ping-pong through the title sequence as a living backdrop */
        idle = (idle + dt * 0.5) % (T.titleEnd * 2);
        t = idle < T.titleEnd ? idle : T.titleEnd * 2 - idle;
        doneFired = false;
      } else if (p === "done") {
        t = T.run + 2.2;
      } else {
        t = player.tick(dt);
        if (t >= DURATION) {
          if (!doneFired) {
            doneFired = true;
            endedRef.current();
          }
        } else {
          doneFired = false;
        }
      }

      /* ---- draw ---- */
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = cv.clientWidth;
      const ch = cv.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      if (cw < ch) {
        /* portrait phone: cropped, panning camera + compact HUD */
        const cam = mobileCamera(t, cw, ch);
        ctx.save();
        ctx.translate(cam.ox, cam.oy);
        ctx.scale(cam.sc, cam.sc);
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        ctx.clip();
        renderScene(ctx, t, assets, { mobile: true, cx: cam.cx });
        ctx.restore();
        drawMobileHud(ctx, t, cw, ch, cam);
      } else {
        /* landscape: centered 16:9 stage */
        const sc = Math.min(cw / W, ch / H);
        const ox = (cw - W * sc) / 2;
        const oy = (ch - H * sc) / 2;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(sc, sc);
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        ctx.clip();
        renderScene(ctx, t, assets);
        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    };

    let started = false;
    const begin = () => {
      if (!running || started) return;
      started = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    /* wait for fonts + photographic assets (background plate and keyed drone) */
    Promise.all([document.fonts.ready, loadAssets()])
      .then(([, a]) => {
        assets = a;
        begin();
      })
      .catch(() => begin());
    const bail = setTimeout(begin, 7000);

    return () => {
      running = false;
      clearTimeout(bail);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [player]);

  return (
    <canvas
      ref={canvasRef}
      className={
        "stage" +
        (phase === "menu" ? " stage--menu" : "")
      }
    />
  );
}