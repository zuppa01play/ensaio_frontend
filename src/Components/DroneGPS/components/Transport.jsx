import { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
} from "lucide-react";
import { CHAPTERS, DURATION, fmtTime } from "../engine/timeline";

export default function Transport({
  player,
  paused,
  ended,
  onTogglePlay,
  onRestart,
  muted,
  onToggleMute,
  onExit,
}) {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const knobRef = useRef(null);
  const timeRef = useRef(null);
  const chapterRef = useRef(null);
  const seekingRef = useRef(false);

  /* Drive the HUD straight from the player clock — no React re-renders per frame */
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const t = player.time;
      const f = t / DURATION;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${f})`;
      if (knobRef.current) knobRef.current.style.left = `${f * 100}%`;
      if (timeRef.current)
        timeRef.current.textContent = `${fmtTime(t)} / ${fmtTime(DURATION)}`;
      if (chapterRef.current) {
        let label = CHAPTERS[0].label;
        for (const c of CHAPTERS) if (c.t <= t + 0.001) label = c.label;
        chapterRef.current.textContent = label;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [player]);

  const seekFromClientX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    player.seek(f * DURATION);
  };

  return (
    <div className="transport anim-fade-up">
      <div className="transport__panel">
        <button className="t-btn" onClick={onExit} title="Back to briefing (Esc)">
          <ChevronLeft size={18} />
        </button>
        <button className="t-btn" onClick={onRestart} title="Restart (R)">
          <RotateCcw size={16} />
        </button>
        <button onClick={onTogglePlay} title="Play / Pause (Space)" className="t-play">
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>

        <div className="t-phase">
          <span className="t-phase__label">PHASE</span>
          <span ref={chapterRef} className="t-phase__value">
            TITLE
          </span>
        </div>

        {/* scrub track */}
        <div
          ref={trackRef}
          className="track"
          onPointerDown={(e) => {
            if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
            seekingRef.current = true;
            seekFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (seekingRef.current) seekFromClientX(e.clientX);
          }}
          onPointerUp={() => (seekingRef.current = false)}
          onPointerCancel={() => (seekingRef.current = false)}
        >
          <div className="track__rail">
            <div ref={fillRef} className="track__fill" style={{ transform: "scaleX(0)" }} />
          </div>
          {/* chapter markers */}
          {CHAPTERS.slice(1).map((c) => (
            <div
              key={c.label}
              title={`${c.label} · ${fmtTime(c.t)}`}
              className="track__mark"
              style={{ left: `${(c.t / DURATION) * 100}%` }}
            />
          ))}
          <div ref={knobRef} className="track__knob" style={{ left: "0%" }} />
        </div>

        {/* <span ref={timeRef} className="t-time">
          00:00.0 / {fmtTime(DURATION)}
        </span> */}

        {paused && (
          <span className="t-paused anim-blink">{ended ? "ENDED" : "PAUSED"}</span>
        )}

        <button className="t-btn" onClick={onToggleMute} title="Sound (M)">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}