import React, { useEffect, useRef } from "react";
import { Fade } from "react-awesome-reveal";
import "./HomeSimulatorVideo.css";

const FLEET_CARDS = [
  {
    id: "01",
    direction: "left",
    speed: 12,
    src: "https://res.cloudinary.com/dk50cmtps/image/upload/v1788858962/ChatGPT_Image_Sep_8_2026_02_45_47_PM_pfn5zp.png",
    alt: "enSaio Ajeet drone shown in the simulator, view one",
  },
  {
    id: "02",
    direction: "right",
    speed: 12,
    src: "https://res.cloudinary.com/dk50cmtps/image/upload/v1788858419/ChatGPT_Image_Sep_8_2026_02_36_05_PM_sam91p.png",
    alt: "enSaio Ajeet drone shown in the simulator, view two",
  },
];

const HomeSimulatorVideo = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const imageRefs = useRef([]);
  const orbOneRef = useRef(null);
  const orbTwoRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return undefined;

    let ticking = false;

    const update = () => {
      const vh = window.innerHeight || 1;

      imageRefs.current.forEach((img, i) => {
        const card = cardRefs.current[i];
        if (!img || !card) return;
        const rect = card.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;
        const progress = Math.max(
          -1,
          Math.min(1, (rect.top + rect.height / 2 - vh / 2) / vh)
        );
        const shift = progress * -FLEET_CARDS[i].speed;
        img.style.transform = `translate3d(0, ${shift}px, 0)`;
      });

      const section = sectionRef.current;
      if (section) {
        const sRect = section.getBoundingClientRect();
        const sProgress = (sRect.top + sRect.height / 2 - vh / 2) / vh;
        if (orbOneRef.current) {
          orbOneRef.current.style.transform = `translate3d(0, ${
            sProgress * -90
          }px, 0)`;
        }
        if (orbTwoRef.current) {
          orbTwoRef.current.style.transform = `translate3d(0, ${
            sProgress * 120
          }px, 0)`;
        }
      }
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
    };
  }, []);

  const handleMove = (e, index) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1100px) rotateX(${
      y * -5
    }deg) rotateY(${x * 7}deg) translateZ(0)`;
    card.style.setProperty("--ensai_glow_x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--ensai_glow_y", `${(y + 0.5) * 100}%`);
  };

  const handleLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    card.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <section className="ensai_simu_home_vid_pg_section" ref={sectionRef}>
      <span
        className="ensai_simu_home_vid_pg_orb ensai_simu_home_vid_pg_orb_one"
        ref={orbOneRef}
        aria-hidden="true"
      />
      <span
        className="ensai_simu_home_vid_pg_orb ensai_simu_home_vid_pg_orb_two"
        ref={orbTwoRef}
        aria-hidden="true"
      />
      <span className="ensai_simu_home_vid_pg_grid" aria-hidden="true" />

      <div className="ensai_simu_home_vid_pg_container">
        <Fade direction="up" triggerOnce duration={900} cascade damping={0.15}>
          <p className="ensai_simu_home_vid_pg_eyebrow">
            <span className="ensai_simu_home_vid_pg_eyebrow_dot" />
            the ajeet fleet
          </p>
          <h2 className="ensai_simu_home_vid_pg_title">
            Multiple Drones, one simulator
          </h2>
          <p className="ensai_simu_home_vid_pg_subtitle">
            Specs shown are pulled straight from the in-sim aircraft cards.
          </p>
        </Fade>

        <div className="ensai_simu_home_vid_pg_cards_row">
          {FLEET_CARDS.map((item, index) => (
            <Fade
              key={item.id}
              direction={item.direction}
              triggerOnce
              duration={900}
              className="ensai_simu_home_vid_pg_fade_wrap"
            >
              <div
                className={`ensai_simu_home_vid_pg_card ensai_simu_home_vid_pg_card_${item.id}`}
                ref={(el) => (cardRefs.current[index] = el)}
                onMouseMove={(e) => handleMove(e, index)}
                onMouseLeave={() => handleLeave(index)}
              >
                <div className="ensai_simu_home_vid_pg_media">
                  <img
                    className="ensai_simu_home_vid_pg_image"
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    draggable="false"
                  />
                </div>
                <div className="ensai_simu_home_vid_pg_card_overlay" />
                <div className="ensai_simu_home_vid_pg_card_glow" />
                <span className="ensai_simu_home_vid_pg_corner ensai_simu_home_vid_pg_corner_tl" />
                <span className="ensai_simu_home_vid_pg_corner ensai_simu_home_vid_pg_corner_br" />
                <span className="ensai_simu_home_vid_pg_index">{item.id}</span>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeSimulatorVideo;