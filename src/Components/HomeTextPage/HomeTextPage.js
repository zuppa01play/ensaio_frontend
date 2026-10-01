import React, { useEffect, useRef } from "react";
import "./HomeTextPage.css";
import { useNavigate } from "react-router-dom";

const DRONES = [
  "WingtraRAY",
  "Skydio X10",
  "Freefly Alta X",
  "Inspired Flight IF1200A",
  "Parrot ANAFI USA",
];

const STATS = [
  {
    value: "45%",
    text: "of the global drone GIS mapping market is North America — the largest launch opportunity by far",
  },
  {
    value: "2029",
    text: "firmware waiver runs for existing DJI units — new hardware adoption is only accelerating",
  },
  {
    value: "0",
    text: "category leaders that rehearse a mission before flight — the gap enSaio owns",
  },
];

const STEPS = [
  {
    id: "01",
    title: "Load the mission",
    text: "Import the flight plan from your planning tool, on any drone — including the platforms your fleet just switched to.",
  },
  {
    id: "02",
    title: "Rehearse against reality",
    text: "enSaio runs the mission against real terrain, weather and payload for that exact site — not a generic simulation.",
  },
  {
    id: "03",
    title: "Fly with certainty",
    text: "Get a go/no-go report your fleet manager can sign off on — before the crew ever drives to site.",
  },
];

/* ------------------------------------------------------------------
   PARALLAX SPEEDS
   Each item moves at its own speed while you scroll, which creates
   the layered depth effect. Bigger number = bigger shift.
   Keep chip speeds small so neighbouring chips never touch.
------------------------------------------------------------------- */
const DRONE_SPEEDS = [0.03, 0.06, 0.02, 0.07, 0.04];
const STAT_SPEEDS = [0.04, 0.09, 0.14];
const STEP_SPEEDS = [0.04, 0.09, 0.14];

const MAX_SHIFT_DISTANCE = 350; /* clamp so items never drift too far */

const HomeTextPage = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const handleRequestDemo = () => {
    navigate("/demo");
  };

  /* Scroll reveal + parallax for DRONES, STATS and STEPS */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* 1. Reveal when an item enters the screen */
    const revealItems = root.querySelectorAll(".ensai_home_text_pg_reveal");
    let observer = null;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) =>
        el.classList.add("ensai_home_text_pg_reveal_in")
      );
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          let order = 0;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              /* items that appear together get a small stagger */
              entry.target.style.animationDelay = `${order * 0.12}s`;
              entry.target.classList.add("ensai_home_text_pg_reveal_in");
              observer.unobserve(entry.target);
              order += 1;
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealItems.forEach((el) => observer.observe(el));
    }

    if (reduceMotion) {
      return () => {
        if (observer) observer.disconnect();
      };
    }

    /* 2. Scroll-linked parallax */
    const groups = Array.from(
      root.querySelectorAll("[data-parallax-group]")
    );
    let ticking = false;

    const update = () => {
      const viewportHeight = window.innerHeight;
      /* softer movement on tablet / mobile, where cards are stacked */
      const factor = window.innerWidth < 992 ? 0.35 : 1;

      groups.forEach((group) => {
        const rect = group.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewportHeight + 200) return;

        const delta = Math.max(
          -MAX_SHIFT_DISTANCE,
          Math.min(
            MAX_SHIFT_DISTANCE,
            rect.top + rect.height / 2 - viewportHeight / 2
          )
        );

        group
          .querySelectorAll("[data-parallax-speed]")
          .forEach((item) => {
            const speed = parseFloat(item.getAttribute("data-parallax-speed"));
            item.style.translate = `0 ${(delta * speed * factor).toFixed(1)}px`;
          });
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (observer) observer.disconnect();
      groups.forEach((group) =>
        group
          .querySelectorAll("[data-parallax-speed]")
          .forEach((item) => {
            item.style.translate = "";
          })
      );
    };
  }, []);

  return (
    <div className="ensai_home_text_pg_page" ref={pageRef}>

      {/* Fixed background: stays still while the content scrolls over it */}
      <div className="ensai_home_text_pg_bg_fixed" aria-hidden="true">
        <div className="ensai_home_text_pg_bg_grid" />
        <div className="ensai_home_text_pg_bg_overlay" />
      </div>

      <section className="ensai_home_text_pg_hero">
        <div className="ensai_home_text_pg_container">
          <span className="ensai_home_text_pg_eyebrow">
            <span className="ensai_home_text_pg_eyebrow_dot" />
            Digital Rehearsal for GIS Mapping
          </span>

          <h1 className="ensai_home_text_pg_h1">
            Prove the mission before you fly it.
          </h1>

          <div className="ensai_home_text_pg_hero_btns">
            <button
              type="button"
              className="ensai_home_text_pg_btn_primary"
              onClick={handleRequestDemo}
            >
              Request a Demo
            </button>
            <button
              type="button"
              className="ensai_home_text_pg_btn_secondary"
            >
              <span>See it in action</span>
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </button>
          </div>

          <div className="ensai_home_text_pg_compat">
            <p className="ensai_home_text_pg_compat_label">
              Rehearsal profiles ready for
            </p>
            <br />
            <div
              className="ensai_home_text_pg_compat_track"
              data-parallax-group
            >
              {DRONES.map((drone, index) => (
                <span
                  key={drone}
                  className="ensai_home_text_pg_compat_chip ensai_home_text_pg_reveal"
                  data-parallax-speed={DRONE_SPEEDS[index % DRONE_SPEEDS.length]}
                >
                  {drone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY NOW ================= */}
      <section className="ensai_home_text_pg_why">
        <div className="ensai_home_text_pg_container">
          <div className="ensai_home_text_pg_section_head">
            <span className="ensai_home_text_pg_kicker">Why Now</span>
            <h2 className="ensai_home_text_pg_h2">
              Your fleet is flying unfamiliar hardware.
            </h2>
            <p className="ensai_home_text_pg_lead">
              The US FCC Covered List has pushed operators off DJI and onto
              platforms they have little flight history with. Every new
              drone is a new unknown — and a mapping mission still has to
              work on the first attempt.
            </p>
          </div>

          <div className="ensai_home_text_pg_stats" data-parallax-group>
            {STATS.map((stat, index) => (
              <div
                key={stat.value}
                className="ensai_home_text_pg_stat_card ensai_home_text_pg_reveal"
                data-parallax-speed={STAT_SPEEDS[index % STAT_SPEEDS.length]}
              >
                <h3 className="ensai_home_text_pg_stat_value">
                  {stat.value}
                </h3>
                <p className="ensai_home_text_pg_stat_text">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="ensai_home_text_pg_how">
        <div className="ensai_home_text_pg_container">
          <div className="ensai_home_text_pg_section_head">
            <span className="ensai_home_text_pg_kicker">How It Works</span>
            <h2 className="ensai_home_text_pg_h2">
              Three steps between your flight plan and a go/no-go call.
            </h2>
          </div>

          <div className="ensai_home_text_pg_steps" data-parallax-group>
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="ensai_home_text_pg_step_card ensai_home_text_pg_reveal"
                data-parallax-speed={STEP_SPEEDS[index % STEP_SPEEDS.length]}
              >
                <span className="ensai_home_text_pg_step_num">
                  {step.id}
                </span>
                <h3 className="ensai_home_text_pg_step_title">
                  {step.title}
                </h3>
                <p className="ensai_home_text_pg_step_text">{step.text}</p>
                {index < STEPS.length - 1 && (
                  <span
                    className="ensai_home_text_pg_step_arrow"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeTextPage;