import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Error.css";

const SVG_NS = "http://www.w3.org/2000/svg";

// Broken front-right motor position (SVG coordinates) - sparks & smoke start here
const MOTOR = { x: 340, y: 106 };

const rand = (min, max) => Math.random() * (max - min) + min;

// Generated once, so the stars don't jump around on re-render
const STARS = Array.from({ length: 70 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  delay: `${Math.random() * 4}s`,
  duration: `${2 + Math.random() * 4}s`,
}));

const Error = () => {
  const navigate = useNavigate();
  const fxRef = useRef(null);
  const droneWrapRef = useRef(null);

  const goHomeHandle = () => {
    navigate("/");
  };

  useEffect(() => {
    const fx = fxRef.current;
    const wrap = droneWrapRef.current;
    if (!fx || !wrap) return undefined;

    // No particles / parallax for reduced-motion users
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let alive = true;
    const timers = new Set();

    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const makeCircle = (r, fill) => {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", MOTOR.x);
      c.setAttribute("cy", MOTOR.y);
      c.setAttribute("r", r);
      c.setAttribute("fill", fill);
      return c;
    };

    const spark = () => {
      const c = makeCircle(
        rand(1.2, 3),
        Math.random() > 0.35 ? "#ffb020" : "#fff3c4"
      );
      fx.appendChild(c);

      const dx = rand(-45, 45);
      const dy = rand(-30, 60); // tends to fall down
      const anim = c.animate(
        [
          { transform: "translate(0px, 0px)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
        ],
        { duration: rand(450, 900), easing: "cubic-bezier(.2,.6,.4,1)" }
      );
      anim.onfinish = () => c.remove();
    };

    const smoke = () => {
      const c = makeCircle(rand(5, 8), "#5b6675");
      c.style.transformBox = "fill-box";
      c.style.transformOrigin = "center";
      fx.appendChild(c);

      const anim = c.animate(
        [
          { transform: "translate(0px, 0px) scale(1)", opacity: 0.5 },
          {
            transform: `translate(${rand(-20, 30)}px, -75px) scale(3.4)`,
            opacity: 0,
          },
        ],
        { duration: rand(1800, 2600), easing: "ease-out" }
      );
      anim.onfinish = () => c.remove();
    };

    const sparkLoop = () => {
      if (!alive) return;
      if (!document.hidden) {
        spark();
        if (Math.random() > 0.7) {
          // occasional burst
          for (let i = 0; i < 4; i += 1) later(spark, i * 40);
        }
      }
      later(sparkLoop, rand(90, 280));
    };

    const smokeLoop = () => {
      if (!alive) return;
      if (!document.hidden) smoke();
      later(smokeLoop, 380);
    };

    sparkLoop();
    smokeLoop();

    // Click the drone = big spark burst
    const handleClick = () => {
      for (let i = 0; i < 16; i += 1) later(spark, i * 25);
    };

    // Pointer parallax
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      wrap.style.transform = `translate(${x * 16}px, ${y * 10}px)`;
    };

    const handleLeave = () => {
      wrap.style.transform = "translate(0, 0)";
    };

    wrap.addEventListener("click", handleClick);
    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      alive = false;
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
      wrap.removeEventListener("click", handleClick);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      while (fx.firstChild) fx.removeChild(fx.firstChild);
    };
  }, []);

  return (
    <main className="ensai_error_pg_stage">
      <div className="ensai_error_pg_stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="ensai_error_pg_star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <section className="ensai_error_pg_hero">
        <div className="ensai_error_pg_code" data-text="404" aria-hidden="true">
          404
        </div>

        <div className="ensai_error_pg_drone_wrap" ref={droneWrapRef}>
          <div className="ensai_error_pg_drone_float">
            <svg
              className="ensai_error_pg_drone_svg"
              viewBox="0 0 400 260"
              role="img"
              aria-label="A damaged drone with a broken propeller, sparking and smoking"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="ensai_error_pg_bodyGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0" stopColor="#465469" />
                  <stop offset="1" stopColor="#1b222d" />
                </linearGradient>
                <radialGradient
                  id="ensai_error_pg_lensGrad"
                  cx="0.35"
                  cy="0.35"
                  r="0.8"
                >
                  <stop offset="0" stopColor="#bfe6ff" />
                  <stop offset="0.45" stopColor="#2f78b5" />
                  <stop offset="1" stopColor="#0b1a2b" />
                </radialGradient>
                <filter
                  id="ensai_error_pg_glow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* The whole drone tilts and wobbles */}
              <g className="ensai_error_pg_drone">
                {/* landing legs */}
                <path
                  d="M165 170 L150 208 M235 170 L250 208"
                  stroke="#2b3542"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M140 208 H162 M238 208 H260"
                  stroke="#4a586b"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* rear arms */}
                <path
                  d="M182 122 L120 92 M218 122 L280 92"
                  stroke="#252d39"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* front arms */}
                <path
                  d="M168 134 L60 112 M232 134 L340 112"
                  stroke="#2f3946"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* rear-left propeller (sputtering) */}
                <g transform="translate(120 74)">
                  <ellipse className="ensai_error_pg_disc" rx="34" ry="5" />
                  <ellipse
                    className="ensai_error_pg_blade ensai_error_pg_blade_rear ensai_error_pg_sputter"
                    rx="30"
                    ry="3"
                  />
                </g>
                <rect
                  x="110"
                  y="80"
                  width="20"
                  height="14"
                  rx="4"
                  fill="#202834"
                  stroke="#4a586b"
                />

                {/* rear-right propeller */}
                <g transform="translate(280 74)">
                  <ellipse className="ensai_error_pg_disc" rx="34" ry="5" />
                  <ellipse
                    className="ensai_error_pg_blade ensai_error_pg_blade_rear"
                    rx="30"
                    ry="3"
                  />
                </g>
                <rect
                  x="270"
                  y="80"
                  width="20"
                  height="14"
                  rx="4"
                  fill="#202834"
                  stroke="#4a586b"
                />

                {/* front-left motor + propeller (healthy) */}
                <rect
                  x="48"
                  y="100"
                  width="24"
                  height="18"
                  rx="5"
                  fill="#232c38"
                  stroke="#4a586b"
                />
                <g transform="translate(60 92)">
                  <ellipse className="ensai_error_pg_disc" rx="46" ry="6" />
                  <ellipse
                    className="ensai_error_pg_blade"
                    rx="42"
                    ry="3.5"
                  />
                </g>

                {/* front-right motor (damaged) */}
                <rect
                  x="328"
                  y="100"
                  width="24"
                  height="18"
                  rx="5"
                  fill="#2a2320"
                  stroke="#7a4a3a"
                />
                {/* bent propeller stub */}
                <path d="M340 98 L326 88 L322 92 L338 102 Z" fill="#8c98a8" />
                <path d="M340 98 L352 92 L355 96 L342 102 Z" fill="#8c98a8" />

                {/* torn-off propeller flying away */}
                <g transform="translate(340 90)">
                  <g className="ensai_error_pg_lost_prop">
                    <ellipse rx="42" ry="3.5" fill="#b8c4d4" />
                    <path d="M-42 0 L-30 -1 L-34 2 Z" fill="#0b0f15" />
                  </g>
                </g>

                {/* body */}
                <path
                  d="M146 128 Q200 102 254 128 L266 156 Q200 190 134 156 Z"
                  fill="url(#ensai_error_pg_bodyGrad)"
                  stroke="#5a6a80"
                  strokeWidth="1.5"
                />
                <path
                  d="M160 132 Q200 116 240 132"
                  fill="none"
                  stroke="#5a6a80"
                  strokeWidth="1"
                  opacity="0.6"
                />
                {/* crack */}
                <polyline
                  className="ensai_error_pg_crack"
                  points="222,120 216,134 226,142 214,156 220,166"
                  fill="none"
                  stroke="#ffb020"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* camera gimbal */}
                <rect
                  x="190"
                  y="164"
                  width="20"
                  height="8"
                  rx="3"
                  fill="#232c38"
                />
                <circle
                  cx="200"
                  cy="180"
                  r="14"
                  fill="#1a212c"
                  stroke="#5a6a80"
                  strokeWidth="1.5"
                />
                <circle
                  cx="200"
                  cy="180"
                  r="8"
                  fill="url(#ensai_error_pg_lensGrad)"
                />
                <circle
                  cx="197"
                  cy="177"
                  r="2"
                  fill="#ffffff"
                  opacity="0.75"
                />

                {/* status LEDs */}
                <circle
                  className="ensai_error_pg_led_red"
                  cx="172"
                  cy="140"
                  r="3.5"
                  fill="#ff4d4d"
                  filter="url(#ensai_error_pg_glow)"
                />
                <circle
                  className="ensai_error_pg_led_dead"
                  cx="228"
                  cy="140"
                  r="3.5"
                  fill="#2a3340"
                />

                {/* sparks + smoke are injected here by useEffect */}
                <g ref={fxRef} />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section className="ensai_error_pg_message">
        <p className="ensai_error_pg_status">
          <span className="ensai_error_pg_dot" aria-hidden="true" />
          Signal lost
        </p>
        <h1 className="ensai_error_pg_title">Page not found</h1>
        <p className="ensai_error_pg_lead">
          This page has gone off course. The link may be broken, or the page
          may have moved.
        </p>
        <button
          type="button"
          className="ensai_error_pg_btn"
          onClick={goHomeHandle}
        >
          Go back to home page
        </button>
      </section>
    </main>
  );
};

export default Error;