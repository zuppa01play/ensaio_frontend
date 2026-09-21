import React, { useState, useEffect, useRef } from "react";

import "./HomeCase.css";

const books = [
  {
    title: "Rehearse Before You Fly",
    coverUrl:
      "https://res.cloudinary.com/dk50cmtps/image/upload/v1789631893/203608d9-9629-49cb-9824-e750d25a0813_m1pser.png",
    shortText:
      "Autonomous Beyond Visual Line of Sight (BVLOS) Unmanned Aerial Systems (UAS) have become essential for high-precision infrastructure monitoring, utility grid inspections, and defense operations. However, legacy simulation software remains tethered to a legacy, asset-centric paradigm: modeling basic aerodynamic stability, motor RPMs, and synthetic pilot hand-eye coordination in generic virtual environments.",
    nav: "/case_fly",
  },
  {
    title: "NATIVE POSITIONING ARCHITECTURE",
    coverUrl:
      "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630638/54b186e5-d3cd-4af1-a641-ae12c47444c3_rvl2xs.png",
    shortText:
      "De-risk the deal before you sign it.Certainty before contact.Beyond simulation. Into certainty.",
    nav: "/case_native_posting",
  },
  {
    title: "PIPELINE INSPECTION",
    coverUrl:
      "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630359/b4b884d4-94e6-4df1-85d7-f09ab1fc7361_v0xluu.png",
    shortText:
      "To examine the real-world operational and commercial mechanics of enSaio, consider an industrial corridor monitoring operation executed by an aerial geomatics division on behalf of a Tier-1 Interstate Energy Pipeline Operator.",
    nav: "/case_pipeline",
  },
  {
    title: "SOP INTEGRATION",
    coverUrl:
      "https://res.cloudinary.com/dk50cmtps/image/upload/v1784608191/Ajeet_Eagle_drone_banner_lvro83.png",
    shortText:
      "Rather than disrupting established enterprise tooling or introducing friction into field operations, enSaio inserts seamlessly into standard operating procedures (SOPs) as an automated, objective decision gate. The platform operationalizes compliance across ISO 9001 (Quality Management), ISO 19157 (Geospatial Data Quality), and EASA SORA / FAA Part 107 BVLOS risk standards.",
    nav: "/case_sop",
  },
  {
    title: "STRATEGIC VALUE",
    coverUrl:
      "https://res.cloudinary.com/dk50cmtps/image/upload/v1784608191/Ajeet_Eagle_drone_banner_lvro83.png",
    shortText:
      "Deploying enSaio transforms drone operations from an unpredictable, liability-heavy flight activity into a deterministic, auditable enterprise workflow.",
    nav: "/case_strategic",
  },
];

const getVisibleCount = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
};

const HomeCase = () => {

  const [openCards, setOpenCards] = useState(() => books.map(() => false));
  const [visible, setVisible] = useState(getVisibleCount);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const maxIndex = Math.max(0, books.length - visible);

  useEffect(() => {
    const onResize = () => setVisible(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // resize la index overflow aagama irukka
  useEffect(() => {
    setCurrent((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrent((prev) => Math.min(maxIndex, prev + 1));

  const toggleOpen = (index) => {
    setOpenCards((prev) => prev.map((o, i) => (i === index ? !o : o)));
  };

  const handleKeyDown = (index, event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen(index);
    }
  };

const handleReadMore = (event, nav) => {
  event.stopPropagation();
  window.location.assign(nav);
};
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="ensai_home_case_pg_section">
      <div className="ensai_home_case_pg_bg_grid" />
      <div className="ensai_home_case_pg_bg_stars" />
      <div className="ensai_home_case_pg_bg_radar">
        <div className="ensai_home_case_pg_bg_radar_sweep" />
      </div>
      <div className="ensai_home_case_pg_bg_scanline" />
      <div className="ensai_home_case_pg_bg_crt" />

      <div className="ensai_home_case_pg_container">
        <div className="ensai_home_case_pg_title_wrap">
          <span className="ensai_home_case_pg_status">
            <span className="ensai_home_case_pg_status_dot" />
            ARCHIVE ONLINE
          </span>
          <span className="ensai_home_case_pg_kicker">The Field Library</span>
          <h2 className="ensai_home_case_pg_title">Case Studies</h2>
        </div>

        <div className="ensai_home_case_pg_carousel">
          <div
            className="ensai_home_case_pg_carousel_viewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="ensai_home_case_pg_carousel_track"
              style={{
                transform: `translateX(-${current * (100 / visible)}%)`,
              }}
            >
              {books.map((book, index) => {
                const isOpen = openCards[index];
                return (
                  <div
                    key={book.nav}
                    className="ensai_home_case_pg_carousel_slide"
                    style={{ flexBasis: `${100 / visible}%` }}
                  >
                    <div
                      className={
                        isOpen
                          ? "ensai_home_case_pg_moleskine_wrapper ensai_home_case_pg_notebook_open"
                          : "ensai_home_case_pg_moleskine_wrapper"
                      }
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-label={`Open case study: ${book.title.trim()}`}
                      onClick={() => toggleOpen(index)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    >
                      <div className="ensai_home_case_pg_moleskine_notebook">
                        <span className="ensai_home_case_pg_hud_corner ensai_home_case_pg_hud_corner_tl" />
                        <span className="ensai_home_case_pg_hud_corner ensai_home_case_pg_hud_corner_tr" />
                        <span className="ensai_home_case_pg_hud_corner ensai_home_case_pg_hud_corner_bl" />
                        <span className="ensai_home_case_pg_hud_corner ensai_home_case_pg_hud_corner_br" />

                        <div className="ensai_home_case_pg_notebook_page">
                          <div className="ensai_home_case_pg_notebook_quote_container">
                            <div className="ensai_home_case_pg_notebook_quote_scroll">
                              <p className="ensai_home_case_pg_notebook_quote_text">
                                {book.shortText}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="ensai_home_case_pg_read_more_btn"
                              onClick={(e) => handleReadMore(e, book.nav)}
                            >
                              <span>Read More</span>
                              <svg
                                className="ensai_home_case_pg_read_more_icon"
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 12h14" />
                                <path d="M13 6l6 6-6 6" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="ensai_home_case_pg_notebook_cover">
                          <img
                            className="ensai_home_case_pg_notebook_cover_img"
                            src={book.coverUrl}
                            alt={book.title.trim()}
                            loading="lazy"
                          />
                          <span className="ensai_home_case_pg_notebook_shine" />
                          <span className="ensai_home_case_pg_notebook_scanband" />
                          <span className="ensai_home_case_pg_notebook_title">
                            {book.title.trim()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {maxIndex > 0 && (
            <div className="ensai_home_case_pg_carousel_controls">
              <button
                type="button"
                className="ensai_home_case_pg_carousel_btn"
                onClick={goPrev}
                disabled={current === 0}
                aria-label="Previous case studies"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>

              <div className="ensai_home_case_pg_carousel_dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={
                      i === current
                        ? "ensai_home_case_pg_carousel_dot ensai_home_case_pg_carousel_dot_active"
                        : "ensai_home_case_pg_carousel_dot"
                    }
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="ensai_home_case_pg_carousel_btn"
                onClick={goNext}
                disabled={current === maxIndex}
                aria-label="Next case studies"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCase;