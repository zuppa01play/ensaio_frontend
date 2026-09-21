import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeMission.css";

gsap.registerPlugin(ScrollTrigger);

/* Mobile-la address-bar show/hide aagum bodhu ScrollTrigger
   unnecessary-a recalculate aagi jank varaadhu */
ScrollTrigger.config({ ignoreMobileResize: true });

const CARDS_DATA = [
  {
    badge: "Real-World Scenarios",
    desc: "Environments built to rehearse the real mission",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630359/b4b884d4-94e6-4df1-85d7-f09ab1fc7361_v0xluu.png",
  },
  {
    badge: "Dynamic Environments",
    desc: "Snowfields, coastlines, and low-visibility terrain to rehearse the conditions your mission will actually face.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630638/54b186e5-d3cd-4af1-a641-ae12c47444c3_rvl2xs.png",
  },
  {
    badge: "Precision FPV Courses",
    desc: "Tight structures and targeting reticles for FPV racing and precision-approach practice.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789631893/203608d9-9629-49cb-9824-e750d25a0813_m1pser.png",
  },
];

/* Words-la split panni, appuram chars — ithu mobile-la line break sariya varum */
const splitWords = (text, keyPrefix) =>
  text.split(" ").map((word, w) => (
    <span className="ensai_mission_ho_word" key={`${keyPrefix}-w${w}`}>
      {word.split("").map((char, c) => (
        <span className="ensai_mission_ho_char" key={`${keyPrefix}-w${w}c${c}`}>
          {char}
        </span>
      ))}
      <span className="ensai_mission_ho_char">{"\u00A0"}</span>
    </span>
  ));

const HomeMission = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const hasFinePointer =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      /* ---------------------------------------------------------------
         MOTION-OK — desktop, tablet, mobile ellame idhu la varum,
         aana intensity device-ku device vera vera irukkum
      --------------------------------------------------------------- */
      mm.add(
        {
          isDesktop: "(min-width: 1025px)",
          isTablet: "(min-width: 641px) and (max-width: 1024px)",
          isMobile: "(max-width: 640px)",
          reduceMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions;
          if (!reduceMotion) return;

          const depthOk = isDesktop || isTablet; // 3D depth mobile-la off
          const ampScale = isMobile ? 0.35 : 1; // mobile-la parallax konjam mattum

          gsap.utils.toArray(".ensai_mission_ho_cluster").forEach((cluster, index) => {
            const tilt = cluster.querySelector(".ensai_mission_ho_tilt");
            const dots = cluster.querySelector(".ensai_mission_ho_dots");
            const glow = cluster.querySelector(".ensai_mission_ho_glow");
            const card = cluster.querySelector(".ensai_mission_ho_card");
            const frame = cluster.querySelector(".ensai_mission_ho_frame");
            const caption = cluster.querySelector(".ensai_mission_ho_caption");
            const dir = index % 2 === 0 ? 1 : -1; // alternate-a rotate panna

            if (depthOk) {
              gsap.set(dots, { z: -110 });
              gsap.set(glow, { z: -280 });
              gsap.set(card, { z: 80 });
              gsap.set(caption, { z: 120 });
            }

            /* --- Entrance: fade + depth-la irundhu munnadi varum --- */
            gsap.from(cluster, {
              opacity: 0,
              z: depthOk ? -520 : 0,
              y: depthOk ? 0 : 60,
              scale: depthOk ? 1 : 0.95,
              filter: "blur(12px)",
              duration: 1.1,
              ease: "power2.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: cluster,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            });

            /* --- Scroll-la rotate aagum (3D turn) — desktop/tablet mattum,
                 mouse/trackpad-oda irukkura devices-ku mattum full tilt --- */
            if (depthOk && isDesktop && hasFinePointer) {
              gsap.fromTo(
                tilt,
                { rotateY: 18 * dir, rotateX: 8 },
                {
                  rotateY: -8 * dir,
                  rotateX: -5,
                  ease: "none",
                  overwrite: "auto",
                  scrollTrigger: {
                    trigger: cluster,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.3,
                  },
                }
              );

              /* Pointer tilt — genuine mouse devices mattum */
              const rotY = gsap.quickTo(cluster, "rotateY", { duration: 0.6, ease: "power3.out" });
              const rotX = gsap.quickTo(cluster, "rotateX", { duration: 0.6, ease: "power3.out" });

              const onMove = (e) => {
                const r = cluster.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                rotY(x * 10);
                rotX(-y * 8);
              };
              const onLeave = () => {
                rotY(0);
                rotX(0);
              };

              cluster.addEventListener("pointermove", onMove);
              cluster.addEventListener("pointerleave", onLeave);
            }

            /* --- Parallax: layers vera vera speed-la nagarum --- */
            const parallax = [
              [dots, 12, -12],
              [glow, -5, 5],
              [card, -16, 16],
              [caption, -4, 20],
            ];

            parallax.forEach(([el, from, to]) => {
              if (!el) return;
              gsap.fromTo(
                el,
                { yPercent: from * ampScale },
                {
                  yPercent: to * ampScale,
                  ease: "none",
                  overwrite: "auto",
                  scrollTrigger: {
                    trigger: cluster,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                  },
                }
              );
            });

            /* --- Image-ku loola-la oru scale breathe --- */
            gsap.fromTo(
              frame,
              { scale: 1.1 },
              {
                scale: 1,
                ease: "none",
                overwrite: "auto",
                scrollTrigger: {
                  trigger: cluster,
                  start: "top bottom",
                  end: "center center",
                  scrub: 1.2,
                },
              }
            );
          });

          /* --- Titles: char-by-char fade + blur reveal --- */
          gsap.utils.toArray(".ensai_mission_ho_title").forEach((title) => {
            gsap.from(title.querySelectorAll(".ensai_mission_ho_char"), {
              opacity: 0,
              yPercent: 100,
              rotateX: depthOk ? -70 : 0,
              filter: "blur(5px)",
              duration: 0.7,
              ease: "power2.out",
              stagger: { each: 0.012, from: "start" },
              overwrite: "auto",
              scrollTrigger: {
                trigger: title,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          });

          /* --- Meta line (number + badge) --- */
          gsap.utils.toArray(".ensai_mission_ho_meta").forEach((meta) => {
            gsap.from(meta, {
              opacity: 0,
              x: -22,
              duration: 0.65,
              ease: "power2.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: meta,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            });
          });
        }
      );

      /* ---------------------------------------------------------------
         REDUCED MOTION — content mattum, animation illa
      --------------------------------------------------------------- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".ensai_mission_ho_cluster",
            ".ensai_mission_ho_char",
            ".ensai_mission_ho_meta",
          ],
          { clearProps: "all", opacity: 1 }
        );
      });

      return () => mm.revert();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ensai_mission_ho_wrapper" ref={wrapperRef}>
      <div className="ensai_mission_ho_grid" aria-hidden="true" />

      {CARDS_DATA.map((card, index) => {
        const isAlt = index % 2 !== 0;
        const num = String(index + 1).padStart(2, "0");

        return (
          <article
            className={
              "ensai_mission_ho_row" + (isAlt ? " ensai_mission_ho_row_alt" : "")
            }
            key={card.badge}
          >
            <header className="ensai_mission_ho_head">
              <p className="ensai_mission_ho_meta">
                <span className="ensai_mission_ho_num">{num}</span>
                <span className="ensai_mission_ho_rule" aria-hidden="true" />
                <span className="ensai_mission_ho_badge">{card.badge}</span>
              </p>
              <h2 className="ensai_mission_ho_title">
                {splitWords(card.desc, `t${index}`)}
              </h2>
            </header>

            <div className="ensai_mission_ho_stage">
              <div className="ensai_mission_ho_cluster">
                <div className="ensai_mission_ho_tilt">
                  <div className="ensai_mission_ho_glow" aria-hidden="true" />

                  <div className="ensai_mission_ho_dots" aria-hidden="true" />

                  <figure className="ensai_mission_ho_card">
                    <div className="ensai_mission_ho_frame">
                      <img src={card.img} alt={card.badge} loading="lazy" />
                      <span className="ensai_mission_ho_sheen" aria-hidden="true" />
                      <span className="ensai_mission_ho_reticle" aria-hidden="true" />
                    </div>
                    <figcaption className="ensai_mission_ho_caption">
                      <span className="ensai_mission_ho_caption_num">/{num}</span>
                      {card.badge}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default HomeMission;