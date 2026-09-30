import React, { useState, useEffect, useRef } from "react";

import "./HomeCase.css";
import { useNavigate } from "react-router-dom";
import Gis from "./HomeCaseStudiesImages/gis.png";
import photogrammatric from "./HomeCaseStudiesImages/photogrammatric.png";
import missionplaning from "./HomeCaseStudiesImages/missionplaning.png";




const books = [
  {
    title: "Geographic Information Systems (GIS)",
    coverUrl:Gis,

    discipline: "Geographic Information Systems",
    tagline:
      "Binding multi-dimensional spatial geometries with relational databases.",
    metrics: [
      { label: "Spatial Accuracy", value: "±1.2 cm RMSE" },
      { label: "Data Models", value: "Vector & Raster" },
      { label: "Datum Reference", value: "WGS84 / UTM / EPSG" },
    ],
    checklist: [
      "Sub-centimeter GNSS georeferencing",
      "Parcel / TIN integration",
      "Enterprise GIS database connectivity",
    ],
    nav: "/case_fly",
  },
  {
    title: "PHOTOGRAMMETRIC SURVEYING",
    coverUrl:
     photogrammatric,

    discipline: "Photogrammetric Surveying",
    tagline:
      "Airborne imagery transformed into millimeter-accurate 3D measurements and surface models.",
    metrics: [
      { label: "Forward Overlap", value: "70% – 80%" },
      { label: "Side Overlap", value: "30% – 60%" },
      { label: "Ground Sample Distance", value: "1.2 – 2.5 cm/px" },
    ],
    checklist: [
      "SIFT keypoint matching",
      "Bundle Block Adjustment (BBA)",
      "True orthorectification eliminating perspective distortion",
    ],
    nav: "/case_photogrammatric",
  },
  {
    title: " MISSION PLANNING",
    coverUrl:
     missionplaning,

    discipline: "Mission Planning",
    tagline:
      "UAV trajectory design, overlap convergence & pre-flight rehearsal.",
    metrics: [
      { label: "Planning Stage", value: "Pre-Flight" },
      { label: "Focus", value: "Flight Dynamics" },
      { label: "Risk Control", value: "Hazard Mitigation" },
    ],
    checklist: [
      "UAV trajectory design",
      "Overlap convergence planning",
      "Pre-flight rehearsal",
    ],
    nav: "/case_pipeline",
  },
];

const getVisibleCount = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
};

const CheckIcon = () => (
  <svg
    className="ensai_home_case_pg_info_check_icon"
    viewBox="0 0 16 16"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7.2" fill="rgba(77,216,255,0.12)" stroke="rgba(77,216,255,0.45)" strokeWidth="0.8" />
    <path
      d="M4.8 8.3l2.2 2.2 4.2-4.4"
      fill="none"
      stroke="#4dd8ff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeCase = () => {
  const navigate = useNavigate();

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
  navigate(nav);
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
                              <div className="ensai_home_case_pg_info">
                                <h3 className="ensai_home_case_pg_info_title">
                                  {book.discipline}
                                </h3>

                                <p className="ensai_home_case_pg_info_tagline">
                                  {book.tagline}
                                </p>

                                <div className="ensai_home_case_pg_info_metrics">
                                  {book.metrics.map((metric) => (
                                    <div
                                      key={metric.label}
                                      className="ensai_home_case_pg_info_metric"
                                    >
                                      <span className="ensai_home_case_pg_info_metric_label">
                                        {metric.label}
                                      </span>
                                      <span className="ensai_home_case_pg_info_metric_value">
                                        {metric.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <ul className="ensai_home_case_pg_info_checklist">
                                  {book.checklist.map((item) => (
                                    <li
                                      key={item}
                                      className="ensai_home_case_pg_info_check_item"
                                    >
                                      <CheckIcon />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
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