import React, { useRef, useEffect, useState, useCallback } from "react";
import "./HomeCard.css";

const generateStarShadows = (count, max = 2000) => {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * max);
    const y = Math.floor(Math.random() * max);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  return shadows.join(", ");
};

const HomeCard = () => {
  const cards = [
    {
      id: 1,
      title: "Real-world scenarios",
      description:
        "Fly over photogrammetry-accurate terrain, from city landmarks to open desert.",
      img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789530751/68bc6b7d-4eee-4939-93db-6c2c16b04545_nbpzfz.png",
    },
    {
      id: 2,
      title: "Dynamic weather",
      description:
        "Dial in rain, fog, dust, snow, falling leaves, and wind on all three axes.",
      img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789530930/90642242-14d8-4067-bda6-c09664bdaaf6_snrrig.png",
    },
    {
      id: 3,
      title: "Full flight telemetry",
      description:
        "Live speed, altitude, heading, pitch, roll, battery, and collision readouts.",
      img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789531069/ChatGPT_Image_Sep_16_2026_09_27_27_AM_vfzxen.png",
    },
    {
      id: 4,
      title: "10 Ajeet airframes",
      description:
        "Train across the whole Ajeet lineup, from the FPV racer to the Hexa1.",
      img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789531469/17ef25e0-2b00-46b7-b898-d01d028f2e7e_p4ucjk.png",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const boxRefs = useRef([]);

  // star layer wrapper refs (scroll parallax) - separate from the
  // star dot elements themselves so the CSS rotate animation isn't
  // fought over by JS-driven transforms
  const starLayer1Ref = useRef(null);
  const starLayer2Ref = useRef(null);
  const starLayer3Ref = useRef(null);

  // star dot element refs (box-shadow generated once on mount)
  const starsRef = useRef(null);
  const stars2Ref = useRef(null);
  const stars3Ref = useRef(null);

  const cursorRef = useRef(null);
  const cursor2Ref = useRef(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorTrail = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const getZIndex = useCallback((length, index, active) => {
    return length - Math.abs(index - active);
  }, []);

  const render = useCallback(
    (progress) => {
      const length = itemRefs.current.length;
      if (!length) return;

      const clamped = Math.max(0, Math.min(progress, 100));
      const active = Math.floor((clamped / 100) * (length - 1));

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const zIndex = getZIndex(length, index, active);
        const activeFrac = (index - active) / length;

        const x = activeFrac * 800;
        const y = activeFrac * 200;
        const rot = activeFrac * 120;
        const opacity = (zIndex / length) * 3 - 2;

        item.style.zIndex = zIndex;
        item.style.transform = `translate(${x}%, ${y}%) rotate(${rot}deg)`;

        const box = boxRefs.current[index];
        if (box) {
          box.style.opacity = Math.max(0, Math.min(1, opacity));
        }
      });

      // Star layers drift upward at different speeds on scroll = depth
      if (starLayer1Ref.current) {
        starLayer1Ref.current.style.transform = `translateY(${-clamped * 0.15}%)`;
      }
      if (starLayer2Ref.current) {
        starLayer2Ref.current.style.transform = `translateY(${-clamped * 0.28}%)`;
      }
      if (starLayer3Ref.current) {
        starLayer3Ref.current.style.transform = `translateY(${-clamped * 0.42}%)`;
      }
    },
    [getZIndex]
  );

  // Generate the random star fields once (mount / breakpoint change)
  useEffect(() => {
    if (isMobile) return;
    if (starsRef.current) {
      starsRef.current.style.boxShadow = generateStarShadows(700);
    }
    if (stars2Ref.current) {
      stars2Ref.current.style.boxShadow = generateStarShadows(200);
    }
    if (stars3Ref.current) {
      stars3Ref.current.style.boxShadow = generateStarShadows(100);
    }
  }, [isMobile]);

  // Scroll-linked stacking + star parallax
  useEffect(() => {
    if (isMobile) return;

    render(0);

    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const scrolledInto = -rect.top;
      const progress = (scrolledInto / scrollableDistance) * 100;
      render(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, render]);

  // Custom cursor - scoped to this section only
  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const loop = () => {
      cursorTrail.current.x +=
        (cursorPos.current.x - cursorTrail.current.x) * 0.15;
      cursorTrail.current.y +=
        (cursorPos.current.y - cursorTrail.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorTrail.current.x}px, ${cursorTrail.current.y}px)`;
      }
      if (cursor2Ref.current) {
        cursor2Ref.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    const handleMouseMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      section.classList.add("ensai_home_card_pg_cursor_active");
      rafId.current = requestAnimationFrame(loop);
    };

    const handleMouseLeave = () => {
      section.classList.remove("ensai_home_card_pg_cursor_active");
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile]);

  // ===== Mobile: simple stacked cards, no animation, no cursor =====
  if (isMobile) {
    return (
      <section className="ensai_home_card_pg_mobile_section">
        {cards.map((card) => (
          <div key={card.id} className="ensai_home_card_pg_mobile_card">
            <img
              src={card.img}
              alt={card.title}
              className="ensai_home_card_pg_mobile_img"
            />
            <div className="ensai_home_card_pg_mobile_text">
              <span className="ensai_home_card_pg_mobile_number">
                {String(card.id).padStart(2, "0")}
              </span>
              <h3 className="ensai_home_card_pg_mobile_title">
                {card.title}
              </h3>
              <p className="ensai_home_card_pg_mobile_description">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  // ===== Desktop: sticky scroll-linked carousel + dark starfield background + scoped cursor =====
  return (
    <div
      ref={wrapperRef}
      className="ensai_home_card_pg_wrapper"
      style={{ height: `${cards.length * 100}vh` }}
    >
      <section ref={sectionRef} className="ensai_home_card_pg_section">
        <div className="ensai_home_card_pg_bg">
          <div className="ensai_home_card_pg_stars_container">
            <div ref={starLayer3Ref} className="ensai_home_card_pg_star_layer">
              <div
                ref={stars3Ref}
                className="ensai_home_card_pg_stars ensai_home_card_pg_stars3"
              ></div>
            </div>
            <div ref={starLayer2Ref} className="ensai_home_card_pg_star_layer">
              <div
                ref={stars2Ref}
                className="ensai_home_card_pg_stars ensai_home_card_pg_stars2"
              ></div>
            </div>
            <div ref={starLayer1Ref} className="ensai_home_card_pg_star_layer">
              <div
                ref={starsRef}
                className="ensai_home_card_pg_stars ensai_home_card_pg_stars1"
              ></div>
            </div>
          </div>
        </div>

        <div className="ensai_home_card_pg_carousel">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className="ensai_home_card_pg_item"
            >
              <div
                ref={(el) => (boxRefs.current[index] = el)}
                className="ensai_home_card_pg_box"
              >
                <span className="ensai_home_card_pg_number">
                  {String(card.id).padStart(2, "0")}
                </span>
                <img
                  src={card.img}
                  alt={card.title}
                  className="ensai_home_card_pg_img"
                />
                <div className="ensai_home_card_pg_overlay_text">
                  <h3 className="ensai_home_card_pg_title">{card.title}</h3>
                  <p className="ensai_home_card_pg_description">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={cursorRef} className="ensai_home_card_pg_cursor"></div>
        <div
          ref={cursor2Ref}
          className="ensai_home_card_pg_cursor ensai_home_card_pg_cursor2"
        ></div>
      </section>
    </div>
  );
};

export default HomeCard;