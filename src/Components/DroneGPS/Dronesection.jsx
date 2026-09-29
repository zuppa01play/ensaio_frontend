import { useCallback, useEffect, useRef, useState } from "react";
import MissionCanvas from "./components/MissionCanvas";
import { Player } from "./engine/player";
import { DURATION } from "./engine/timeline";
import "./DroneSection.css";

export default function DroneMission() {
  const playerRef = useRef(null);
  if (!playerRef.current) playerRef.current = new Player(DURATION);
  const player = playerRef.current;

  const [phase, setPhase] = useState("menu"); 
  const rootRef = useRef(null);
  const startedRef = useRef(false);
  const lockRef = useRef(null);
  const timersRef = useRef([]);

  /* ---------------- scroll lock ---------------- */
  const unlockScroll = useCallback(() => {
    if (lockRef.current) {
      lockRef.current();
      lockRef.current = null;
    }
  }, []);

  const lockScroll = useCallback(() => {
    if (lockRef.current) return;
    const de = document.documentElement;
    const body = document.body;
    const prev = {
      deOverflow: de.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPad: body.style.paddingRight,
    };
    /* keep the layout width steady when the scrollbar disappears */
    const sbw = window.innerWidth - de.clientWidth;
    de.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    /* overflow:hidden is not enough on touch devices, so block those too */
    const stop = (e) => e.preventDefault();
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });

    lockRef.current = () => {
      de.style.overflow = prev.deOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPad;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, []);

  /* ---------------- start once, when the section is reached ---------------- */
  const begin = useCallback(() => {
    const node = rootRef.current;
    if (!node || startedRef.current) return;
    startedRef.current = true;

    /* glide the section to the top of the screen */
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    player.restart();
    setPhase("playing");

    /* once it is in place (or after a short wait), snap exactly and lock */
    const t0 = performance.now();
    const settle = setInterval(() => {
      const top = node.getBoundingClientRect().top;
      if (Math.abs(top) < 2 || performance.now() - t0 > 1500) {
        clearInterval(settle);
        node.scrollIntoView({ behavior: "auto", block: "start" });
        lockScroll();
      }
    }, 50);

    /* safety net: never leave the page locked if something goes wrong */
    const failsafe = setTimeout(unlockScroll, (DURATION + 10) * 1000);
    timersRef.current.push(settle, failsafe);
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
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) begin();
      },
      { threshold: [0, 0.3, 0.6] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [begin]);

  /* always release the lock if the component goes away */
  useEffect(
    () => () => {
      timersRef.current.forEach((t) => {
        clearInterval(t);
        clearTimeout(t);
      });
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