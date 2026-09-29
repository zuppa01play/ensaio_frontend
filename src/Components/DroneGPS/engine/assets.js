/**
 * Photographic assets for the mission.
 * The drone is shot on a flat chroma-key magenta background and keyed out at
 * runtime into a transparent sprite, so a real photographic drone can be
 * composited over the real-place aerial footage on the canvas.
 *
 * Fixes:
 *  - crossOrigin="anonymous" so the canvas is not tainted (getImageData works)
 *  - already-transparent PNGs are trimmed instead of rejected
 *  - longer timeout + console warnings that say exactly why it fell back
 */

function loadImage(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const img = new Image();
    // MUST be set before src, otherwise the canvas gets tainted
    img.crossOrigin = "anonymous";
    let settled = false;
    const done = (v) => {
      if (!settled) {
        settled = true;
        resolve(v);
      }
    };
    const timer = setTimeout(() => {
      console.warn("[assets] image load timed out:", url);
      done(null);
    }, timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      done(img.naturalWidth > 0 ? img : null);
    };
    img.onerror = () => {
      clearTimeout(timer);
      console.warn("[assets] image failed to load (404 / CORS / network):", url);
      done(null);
    };
    img.src = url;
  });
}

/** distance from magenta: large for pure #FF00FF, ~0 for neutral greys/whites */
const magenta = (r, g, b) => Math.min(r, b) - g;

function keyDrone(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;

  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  if (!wctx) return null;
  wctx.drawImage(img, 0, 0);

  let src;
  try {
    src = wctx.getImageData(0, 0, w, h);
  } catch (err) {
    console.warn(
      "[assets] getImageData blocked (canvas tainted). Check CORS / crossOrigin:",
      err
    );
    return null;
  }
  const data = src.data;

  /* Border check: is the frame flat magenta, or already transparent? */
  let magentaPx = 0;
  let transparentPx = 0;
  let sampled = 0;
  const step = Math.max(1, Math.floor(Math.min(w, h) / 160));
  const push = (x, y) => {
    const i = (y * w + x) * 4;
    sampled++;
    if (data[i + 3] < 16) transparentPx++;
    else if (magenta(data[i], data[i + 1], data[i + 2]) > 35) magentaPx++;
  };
  for (let x = 0; x < w; x += step) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += step) {
    push(0, y);
    push(w - 1, y);
  }
  if (!sampled) return null;

  const alreadyTransparent = transparentPx / sampled > 0.9;
  if (!alreadyTransparent && magentaPx / sampled < 0.45) {
    console.warn(
      "[assets] drone border is neither magenta nor transparent — key rejected.",
      { magentaRatio: magentaPx / sampled, transparentRatio: transparentPx / sampled }
    );
    return null;
  }

  /* key + despill, measuring the sprite and its widest row as we go.
     The widest row of a front-on quad is the near propeller span, which is
     exactly where the outer rotors are — so we can place the nav LEDs on the
     real propellers instead of guessing. */
  let minX = w,
    minY = h,
    maxX = -1,
    maxY = -1;
  let bestRow = -1;
  let bestLeft = 0;
  let bestRight = 0;
  let bestWidth = 0;
  for (let y = 0; y < h; y++) {
    let rowMin = -1;
    let rowMax = -1;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let a;
      if (alreadyTransparent) {
        a = data[i + 3];
      } else {
        let r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        const d = magenta(r, g, b);
        a = 255;
        if (d > 74) a = 0;
        else if (d > 22) a = Math.round((255 * (74 - d)) / 52);
        if (a > 0 && d > 14) {
          /* pull magenta spill back toward neutral so edges don't fringe */
          r = Math.min(r, g + 16);
          b = Math.min(b, g + 16);
          data[i] = r;
          data[i + 2] = b;
        }
        data[i + 3] = a;
      }
      if (a > 24) {
        if (rowMin < 0) rowMin = x;
        rowMax = x;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const rw = rowMax - rowMin;
    if (rowMin >= 0 && rw > bestWidth) {
      bestWidth = rw;
      bestRow = y;
      bestLeft = rowMin;
      bestRight = rowMax;
    }
  }
  if (maxX < 0) {
    console.warn("[assets] no opaque pixels left after keying.");
    return null;
  }
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  if (bw * bh < w * h * 0.06 || bw < w * 0.2) {
    console.warn("[assets] keyed sprite too small, rejecting.", { bw, bh, w, h });
    return null;
  }

  wctx.putImageData(src, 0, 0);
  const out = document.createElement("canvas");
  out.width = bw;
  out.height = bh;
  const octx = out.getContext("2d");
  if (!octx) return null;
  octx.drawImage(work, minX, minY, bw, bh, 0, 0, bw, bh);

  /* Rotor anchors, normalised to the trimmed sprite box (0..1).
     BUGFIX: previous version divided by the full image w/h, but the sprite is
     trimmed to (minX,minY,bw,bh), so anchors were offset. Now relative to trim. */
  const nx = (px) => (px - minX) / bw;
  const ny = (py) => (py - minY) / bh;
  const spanX = (bestRight - bestLeft) / bw;
  const inset = Math.max(0.02, spanX * 0.1);
  const nearY = ny(bestRow);
  const farY = Math.max(0.05, nearY * 0.88 - 0.02);
  const rotors = [
    { x: nx(bestLeft) + inset, y: nearY, r: spanX * 0.155 },
    { x: nx(bestRight) - inset, y: nearY, r: spanX * 0.155 },
    { x: 0.5 - spanX * 0.19, y: farY, r: spanX * 0.125 },
    { x: 0.5 + spanX * 0.19, y: farY, r: spanX * 0.125 },
  ];
  return { canvas: out, rotors };
}

export async function loadAssets() {
  const [place, droneImg] = await Promise.all([
    loadImage("https://res.cloudinary.com/dk50cmtps/image/upload/v1790675716/place-chetpet_mf6cj8.jpg"),
    loadImage("https://res.cloudinary.com/dk50cmtps/image/upload/v1790675716/drone-key_vnv93l.png"),
  ]);
  let drone = null;
  let rotors = null;
  if (droneImg) {
    try {
      const keyed = keyDrone(droneImg);
      if (keyed) {
        drone = keyed.canvas;
        rotors = keyed.rotors;
      }
    } catch (err) {
      console.warn("[assets] keyDrone threw:", err);
      drone = null;
    }
  }
  return { place, drone, rotors };
}