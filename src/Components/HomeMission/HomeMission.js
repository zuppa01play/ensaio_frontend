import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeMission.css";

gsap.registerPlugin(ScrollTrigger);

/* Mobile-la address-bar show/hide aagum bodhu ScrollTrigger
   unnecessary-a recalculate aagi jank varaadhu */
ScrollTrigger.config({ ignoreMobileResize: true });

/* Concept: each mission card is a "waypoint" the viewer flies past —
   it banks in from altitude, levels off in frame, then banks away
   again as the next waypoint approaches. A HUD strip on the side
   reads ALT / HDG / SPD off actual scroll progress, and a runway
   grid recedes underneath the whole thing. Everything is scroll-
   driven (scrub), nothing runs on a timer/loop. */

const CARDS_DATA = [
  {
    tag: "WAYPOINT 01",
    badge: "Real-World Scenarios",
    desc: "Environments built to rehearse the real mission",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630359/b4b884d4-94e6-4df1-85d7-f09ab1fc7361_v0xluu.png",
    hdg: "047",
    alt: "1180",
  },
  {
    tag: "WAYPOINT 02",
    badge: "Dynamic Environments",
    desc: "Snowfields, coastlines, and low-visibility terrain to rehearse the conditions your mission will actually face.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630638/54b186e5-d3cd-4af1-a641-ae12c47444c3_rvl2xs.png",
    hdg: "212",
    alt: "860",
  },
  {
    tag: "WAYPOINT 03",
    badge: "Precision FPV Courses",
    desc: "Tight structures and targeting reticles for FPV racing and precision-approach practice.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789631893/203608d9-9629-49cb-9824-e750d25a0813_m1pser.png",
    hdg: "329",
    alt: "540",
  },
];

const HomeMission = () => {
  const wrapperRef = useRef(null);
  const runwayRef = useRef(null);
  const horizonGlowRef = useRef(null);
  const altRef = useRef(null);
  const hdgRef = useRef(null);
  const spdRef = useRef(null);
  const markerRef = useRef(null);
  const bayRefs = useRef([]);
  bayRefs.current = [];
  const addBayRef = (el) => {
    if (el) bayRefs.current.push(el);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* -----------------------------------------------------------
         GROUND / HORIZON — one scrub tied to the whole section.
         The runway grid's backgroundPositionY is tweened directly
         (no custom property), which tiles the repeating-gradient
         pattern to read as continuous forward motion while staying
         entirely a function of scroll position, never of time.
      ----------------------------------------------------------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (runwayRef.current) {
          gsap.fromTo(
            runwayRef.current,
            { backgroundPositionY: "0px" },
            {
              backgroundPositionY: "2400px",
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (horizonGlowRef.current) {
          gsap.fromTo(
            horizonGlowRef.current,
            { opacity: 0.35, scaleX: 0.9 },
            {
              opacity: 0.7,
              scaleX: 1.15,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "center center",
                scrub: 0.6,
              },
            }
          );
        }

        /* HUD readouts — text only, driven straight off progress,
           so this is cheap even while scrubbing on a phone. */
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (altRef.current) altRef.current.textContent = String(Math.round(1400 - p * 1050)).padStart(4, "0");
            if (hdgRef.current) hdgRef.current.textContent = String(Math.round(40 + p * 290) % 360).padStart(3, "0");
            if (spdRef.current) spdRef.current.textContent = String(Math.round(38 + p * 46)).padStart(2, "0");
            if (markerRef.current) markerRef.current.style.top = `${p * 100}%`;
          },
        });

        return () => ScrollTrigger.getAll().forEach((st) => st.trigger === wrapper && st.kill());
      });

      /* -----------------------------------------------------------
         WAYPOINT FLYBY — desktop/tablet: full 3D bank-in, hold
         level, bank-out. Each bay gets one scrubbed timeline spread
         across the time it's near the viewport, so the motion reads
         as one continuous flight rather than N separate triggers.
      ----------------------------------------------------------- */
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: no-preference)",
          depthOk: "(min-width: 641px)",
        },
        (context) => {
          const { reduceMotion, depthOk } = context.conditions;
          if (!reduceMotion || !depthOk) return undefined;

          bayRefs.current.forEach((bay, index) => {
            const card = bay.querySelector(".ensai_flightpath_card");
            const tag = bay.querySelector(".ensai_flightpath_tag");
            const dir = index % 2 === 0 ? 1 : -1;

            const tl = gsap.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: {
                trigger: bay,
                start: "top 92%",
                end: "bottom 8%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });

            tl.fromTo(
              card,
              { z: -900, rotateX: 22, rotateY: 16 * dir, scale: 0.7, opacity: 0, filter: "blur(10px)" },
              { z: 0, rotateX: 0, rotateY: dir * 2, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.42 },
              0
            )
              .to(card, { rotateY: dir * -2, duration: 0.16 }, 0.42)
              .to(
                card,
                { z: -700, rotateX: -18, rotateY: -14 * dir, scale: 0.74, opacity: 0, filter: "blur(9px)", duration: 0.42 },
                0.58
              );

            if (tag) {
              gsap.fromTo(
                tag,
                { opacity: 0, x: -18 * dir },
                {
                  opacity: 1,
                  x: 0,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: bay,
                    start: "top 80%",
                    end: "top 45%",
                    scrub: 0.5,
                  },
                }
              );
            }
          });

          return undefined;
        }
      );

      /* -----------------------------------------------------------
         MOBILE — same waypoint rhythm, no 3D/blur: a vertical swoop
         and scale is cheap, reads as "arriving" and stays smooth on
         phone GPUs. Content is never hidden by default in CSS, so a
         mistimed trigger can't leave a card stuck invisible.
      ----------------------------------------------------------- */
      mm.add(
        { reduceMotion: "(prefers-reduced-motion: no-preference)", isMobile: "(max-width: 640px)" },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions;
          if (!reduceMotion || !isMobile) return undefined;

          bayRefs.current.forEach((bay) => {
            const card = bay.querySelector(".ensai_flightpath_card");
            const tag = bay.querySelector(".ensai_flightpath_tag");

            gsap.fromTo(
              card,
              { y: 70, scale: 0.9, opacity: 0 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: bay, start: "top 86%", end: "top 48%", scrub: 0.6 },
              }
            );

            if (tag) {
              gsap.fromTo(
                tag,
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  ease: "power2.out",
                  scrollTrigger: { trigger: bay, start: "top 90%", end: "top 65%", scrub: 0.5 },
                }
              );
            }
          });

          return undefined;
        }
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".ensai_flightpath_card", ".ensai_flightpath_tag"], { clearProps: "all", opacity: 1 });
      });

      return () => mm.revert();
    }, wrapper);

    /* Image aspect-ratio is reserved in CSS so layout never
       collapses pre-load; this just corrects trigger positions
       once every image has actually settled, and on rotation. */
    const images = Array.from(wrapper.querySelectorAll("img"));
    let pending = images.filter((img) => !img.complete).length;
    const onImgSettle = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", onImgSettle);
        img.addEventListener("error", onImgSettle);
      }
    });
    const handleOrientation = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", handleOrientation);

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onImgSettle);
        img.removeEventListener("error", onImgSettle);
      });
      window.removeEventListener("orientationchange", handleOrientation);
      ctx.revert();
    };
  }, []);

  return (
    <section className="ensai_flightpath_wrapper" ref={wrapperRef}>
      <div className="ensai_flightpath_horizon" aria-hidden="true">
        <div className="ensai_flightpath_sky" />
        <div className="ensai_flightpath_glow" ref={horizonGlowRef} />
        <div className="ensai_flightpath_runway" ref={runwayRef} />
      </div>

      <div className="ensai_flightpath_hud" aria-hidden="true">
        <div className="ensai_flightpath_hud_readout">
          <span className="ensai_flightpath_hud_label">ALT</span>
          <span className="ensai_flightpath_hud_value" ref={altRef}>1400</span>
          <span className="ensai_flightpath_hud_unit">M</span>
        </div>
        <div className="ensai_flightpath_hud_readout">
          <span className="ensai_flightpath_hud_label">HDG</span>
          <span className="ensai_flightpath_hud_value" ref={hdgRef}>040</span>
          <span className="ensai_flightpath_hud_unit">&deg;</span>
        </div>
        <div className="ensai_flightpath_hud_readout">
          <span className="ensai_flightpath_hud_label">SPD</span>
          <span className="ensai_flightpath_hud_value" ref={spdRef}>38</span>
          <span className="ensai_flightpath_hud_unit">KM/H</span>
        </div>
        <div className="ensai_flightpath_hud_track">
          <span className="ensai_flightpath_hud_marker" ref={markerRef} />
        </div>
      </div>

      <header className="ensai_flightpath_intro">
        <p className="ensai_flightpath_kicker">Mission Rehearsal</p>
        <h2 className="ensai_flightpath_headline">
          Every environment your mission will face — flown before you fly it.
        </h2>
      </header>

      <div className="ensai_flightpath_track">
        {CARDS_DATA.map((card, index) => {
          const isAlt = index % 2 !== 0;
          const num = String(index + 1).padStart(2, "0");

          return (
            <article
              className={"ensai_flightpath_bay" + (isAlt ? " ensai_flightpath_bay_alt" : "")}
              key={card.badge}
              ref={addBayRef}
            >
              <p className="ensai_flightpath_tag">
                <span className="ensai_flightpath_tag_index">{card.tag}</span>
                <span className="ensai_flightpath_tag_dot" aria-hidden="true" />
                <span className="ensai_flightpath_tag_name">{card.badge}</span>
              </p>

              <div className="ensai_flightpath_stage">
                <div className="ensai_flightpath_card">
                  <div className="ensai_flightpath_frame">
                    <img src={card.img} alt={card.badge} loading="lazy" width={880} height={605} />
                    <span className="ensai_flightpath_sheen" aria-hidden="true" />
                    <span className="ensai_flightpath_bracket ensai_flightpath_bracket_tl" aria-hidden="true" />
                    <span className="ensai_flightpath_bracket ensai_flightpath_bracket_tr" aria-hidden="true" />
                    <span className="ensai_flightpath_bracket ensai_flightpath_bracket_bl" aria-hidden="true" />
                    <span className="ensai_flightpath_bracket ensai_flightpath_bracket_br" aria-hidden="true" />
                    <span className="ensai_flightpath_telemetry">
                      ALT {card.alt}M &middot; HDG {card.hdg}&deg;
                    </span>
                  </div>

                  <div className="ensai_flightpath_caption">
                    <span className="ensai_flightpath_caption_num">/{num}</span>
                    <p className="ensai_flightpath_desc">{card.desc}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HomeMission;