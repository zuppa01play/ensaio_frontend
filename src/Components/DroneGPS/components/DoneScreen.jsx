import { useCallback, useEffect, useRef, useState } from "react";
import MissionCanvas from "./components/MissionCanvas";
import { Player } from "./engine/player";
import { DURATION } from "./engine/timeline";
import "./DroneSection.css";


export default function DroneMission() {
  const playerRef = useRef(null);
  if (!playerRef.current) playerRef.current = new Player(DURATION);
  const player = playerRef.current;

  const [phase, setPhase] = useState("menu"); // menu -> playing -> done
  const rootRef = useRef(null);
  const startedRef = useRef(false);
  const unlockRef = useRef(null);
  const rafRef = useRef(0);
  const failsafeRef = useRef(0);

 
  const scrollerRef = useRef(null);
  const getScroller = () => {
    if (scrollerRef.current) return scrollerRef.current;
    let found = null;
    for (let el = rootRef.current && rootRef.current.parentElement; el; el = el.parentElement) {
      if (el === document.documentElement) break;
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
        found = el;
        break;
      }
    }
    scrollerRef.current = found || document.scrollingElement || document.documentElement;
    return scrollerRef.current;
  };
  const isViewport = (sc) =>
    sc === document.scrollingElement || sc === document.documentElement;
  const getY = () => {
    const sc = getScroller();
    return isViewport(sc) ? window.scrollY : sc.scrollTop;
  };
  /* "instant" beats any `scroll-behavior: smooth` set in the site CSS */
  const jumpTo = (y) => {
    const sc = getScroller();
    if (isViewport(sc)) window.scrollTo({ top: y, left: 0, behavior: "instant" });
    else sc.scrollTo({ top: y, left: 0, behavior: "instant" });
  };
  /* exact scroll position that puts the section flush with the top */
  const targetY = () => {
    const node = rootRef.current;
    if (!node) return 0;
    const sc = getScroller();
    const base = isViewport(sc) ? 0 : sc.getBoundingClientRect().top;
    return Math.round(getY() + node.getBoundingClientRect().top - base);
  };

  /* ---------------- scroll lock ---------------- */
  const unlockScroll = useCallback(() => {
    if (unlockRef.current) {
      unlockRef.current();
      unlockRef.current = null;
    }
  }, []);

  const lockScroll = useCallback(() => {
    if (unlockRef.current) return;
    const de = document.documentElement;
    const body = document.body;
    const sc = getScroller();
    const els = Array.from(new Set([de, body, sc]));
    const prev = els.map((el) => el.style.overflow);
    const prevBg = de.style.backgroundColor;
    const prevPad = body.style.paddingRight;

    /* keep the layout width steady when the scrollbar disappears, and paint
       the freed gutter black so it never shows as a white strip */
    const sbw = window.innerWidth - de.clientWidth;
    els.forEach((el) => (el.style.overflow = "hidden"));
    if (sbw > 0) {
      body.style.paddingRight = `${sbw}px`;
      de.style.backgroundColor = "#000";
    }

    const stop = (e) => e.preventDefault();
    /* if anything still manages to move the page, put it straight back */
    const hold = () => {
      if (!rafRef.current && Math.abs(getY() - targetY()) > 1) jumpTo(targetY());
    };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("scroll", hold);
    window.addEventListener("resize", hold);
    sc.addEventListener("scroll", hold);

    unlockRef.current = () => {
      els.forEach((el, i) => (el.style.overflow = prev[i]));
      body.style.paddingRight = prevPad;
      de.style.backgroundColor = prevBg;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("scroll", hold);
      window.removeEventListener("resize", hold);
      sc.removeEventListener("scroll", hold);
    };
  }, []);

  /* ---------------- run once when the section is reached ---------------- */
  const begin = useCallback(() => {
    if (!rootRef.current || startedRef.current) return;
    startedRef.current = true;

    lockScroll(); // nobody can scroll from this moment on

    /* glide the section into exact position (0.55 s, eased) */
    const from = getY();
    const t0 = performance.now();
    const DUR = 550;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const to = targetY();
      jumpTo(from + (to - from) * e);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
        jumpTo(targetY());
        player.restart();
        setPhase("playing");
      }
    };
    rafRef.current = requestAnimationFrame(step);

    /* safety net: never leave the page locked if something goes wrong */
    failsafeRef.current = setTimeout(unlockScroll, (DURATION + 10) * 1000);
  }, [player, lockScroll, unlockScroll]);

  const handleEnded = useCallback(() => {
    setPhase("done");
    unlockScroll();
  }, [unlockScroll]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) begin();
      },
      { threshold: [0, 0.2, 0.5] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [begin]);

  /* always release the lock if the component goes away */
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(failsafeRef.current);
      unlockScroll();
    },
    [unlockScroll]
  );

  return (
    <div className="app" ref={rootRef}>
      <MissionCanvas player={player} phase={phase} onEnded={handleEnded} />
    </div>
  );
}