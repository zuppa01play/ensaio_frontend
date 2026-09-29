import React, { useEffect } from "react";
import "./CaseMissionPlanning.css";

const METRICS = [
  { label: "Flight Line Overlap", value: "70% – 80% Fwd / 30% – 60% Side" },
  { label: "Terrain Clearance", value: "Constant AGL (Dynamic Terrain Following)" },
  { label: "Safety Power Buffer", value: "30% RTH Fail-Safe Threshold" },
];

const CHECKLIST = [
  "Automated lawnmower & cross-hatch corridor generation with adaptive speed control",
  "Dynamic terrain elevation following preserving GSD across steep slopes, benches, and ridges",
  "Pre-flight geofence compliance verifying NOTAMs, controlled airspace, and radio line-of-sight",
];

const SECTIONS = [
  {
    id: "01",
    title: "Technical Specifications",
    intro:
      "Every mission is planned against the aircraft's real flight logic, so the plan flies exactly as simulated.",
    points: [
      "Trajectory Modes: Parallel Lawnmower, Corridor Swath, 3D Cross-Hatch Grid",
      "Flight Controller Protocols: MAVLink Waypoint Protocol, DJI Waypoint V2/V3, Pixhawk Mission",
      "Camera Shutter Triggering: Distance-Based (GNSS Synchronized) or Time-Interval Triggering",
      "Pre-Flight Validation: 100% Digital Rehearsal Go/No-Go Feasibility Audit",
    ],
  },
  {
    id: "02",
    title: "Standard Mission Planning Deliverables",
    intro:
      "Every planned mission is exported as a verifiable, field-ready package before mobilization.",
    points: [
      "Waypoint file and autonomous mission file for direct flight controller upload",
      "Terrain-following elevation clearance profile for the full flight path",
      "Battery discharge model with a safe Return-To-Home envelope",
    ],
    chipsLabel: "Deliverable formats",
    chips: [
      "Waypoint File .KML / .KMZ",
      "MAVLink Mission .PLAN",
      "Elevation Clearance Profile",
      "Battery & RTH Envelope",
      "Go/No-Go Audit Certificate",
      "Geofence Compliance Record",
    ],
  },
];

const TrajectoryIcon = () => (
  <svg
    className="ensai_case_mission_pg_icon"
    viewBox="0 0 200 200"
    role="img"
    aria-label="UAV flight trajectory over a lawnmower survey grid"
  >
    <g
      stroke="rgba(59,157,255,0.4)"
      strokeWidth="1"
      fill="none"
    >
      <path d="M20 150 L180 150" />
      <path d="M20 150 L60 168" />
      <path d="M60 168 L120 168" />
      <path d="M120 168 L180 150" />
    </g>
    <path
      d="M34 130 L34 60 L74 60 L74 100 L114 100 L114 60 L154 60 L154 130"
      fill="none"
      stroke="#3b9dff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4 5"
      className="ensai_case_mission_pg_path"
    />
    <circle cx="34" cy="130" r="4" fill="#3b9dff" />
    <g transform="translate(154 60)">
      <circle
        r="9"
        fill="rgba(255,138,31,0.14)"
        stroke="#ff8a1f"
        strokeWidth="1.5"
      />
      <path
        d="M-5 0 L5 0 M0 -5 L0 5"
        stroke="#ff8a1f"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>
    <circle
      className="ensai_case_mission_pg_icon_pulse"
      cx="154"
      cy="60"
      r="9"
      fill="none"
      stroke="#ff8a1f"
      strokeWidth="1.2"
    />
  </svg>
);

const CaseMissionPlanning = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign("/");
    }
  };

  useEffect(() => {
    document.querySelector("#root")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="ensai_case_mission_pg_section">
      <div className="ensai_case_mission_pg_bg_grid" />
      <div className="ensai_case_mission_pg_bg_orb" />
      <div className="ensai_case_mission_pg_bg_scanline" />
      <div className="ensai_case_mission_pg_bg_crt" />

      <div className="ensai_case_mission_pg_container">
        {/* ---------------- Header ---------------- */}
        <header className="ensai_case_mission_pg_hero">
          <div className="ensai_case_mission_pg_hero_text">
            <span className="ensai_case_mission_pg_badge">
              <span className="ensai_case_mission_pg_badge_dot" />
              Pre-Flight Flight Dynamics & Hazard Mitigation
            </span>
            <span className="ensai_case_mission_pg_eyebrow">
              Case Study 03
            </span>
            <h1 className="ensai_case_mission_pg_title">Mission Planning</h1>
            <p className="ensai_case_mission_pg_tagline">
              UAV trajectory design, overlap convergence & pre-flight
              rehearsal.
            </p>
            <p className="ensai_case_mission_pg_summary">
              Mission Planning is the operational engineering discipline of
              constructing flight lines, sensor exposure grids,
              terrain-following altitudes, and airspace safety envelopes
              prior to field mobilization. By locking strict forward and
              lateral image overlaps to ground velocity and topography,
              mission planning guarantees continuous Ground Sampling
              Distance (GSD) compliance while eliminating mid-air
              collisions, battery exhaustion, and survey re-flights.
            </p>
          </div>

          <div className="ensai_case_mission_pg_visual">
            <span className="ensai_case_mission_pg_corner ensai_case_mission_pg_corner_tl" />
            <span className="ensai_case_mission_pg_corner ensai_case_mission_pg_corner_tr" />
            <span className="ensai_case_mission_pg_corner ensai_case_mission_pg_corner_bl" />
            <span className="ensai_case_mission_pg_corner ensai_case_mission_pg_corner_br" />
            <TrajectoryIcon />
            <div className="ensai_case_mission_pg_visual_tags">
              <span className="ensai_case_mission_pg_visual_tag">AGL</span>
              <span className="ensai_case_mission_pg_visual_tag">RTH</span>
              <span className="ensai_case_mission_pg_visual_tag">GSD</span>
            </div>
          </div>
        </header>

        {/* ---------------- Brief Overview ---------------- */}
        <div className="ensai_case_mission_pg_panel">
          <h2 className="ensai_case_mission_pg_panel_title">
            Brief Overview
          </h2>

          <div className="ensai_case_mission_pg_metrics">
            {METRICS.map((metric) => (
              <div key={metric.label} className="ensai_case_mission_pg_metric">
                <span className="ensai_case_mission_pg_metric_label">
                  {metric.label}
                </span>
                <span className="ensai_case_mission_pg_metric_value">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <ul className="ensai_case_mission_pg_checklist">
            {CHECKLIST.map((item) => (
              <li key={item} className="ensai_case_mission_pg_check_item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Detailed cards (always visible) ---------------- */}
        <div className="ensai_case_mission_pg_cards">
          {SECTIONS.map((section) => (
            <article key={section.id} className="ensai_case_mission_pg_card">
              <span className="ensai_case_mission_pg_card_num">
                {section.id}
              </span>
              <h3 className="ensai_case_mission_pg_card_title">
                {section.title}
              </h3>
              <p className="ensai_case_mission_pg_card_intro">
                {section.intro}
              </p>

              <ul className="ensai_case_mission_pg_points">
                {section.points.map((point) => (
                  <li key={point} className="ensai_case_mission_pg_point">
                    {point}
                  </li>
                ))}
              </ul>

              {section.chips && (
                <div className="ensai_case_mission_pg_chips_wrap">
                  {section.chipsLabel && (
                    <span className="ensai_case_mission_pg_chips_label">
                      {section.chipsLabel}
                    </span>
                  )}
                  <div className="ensai_case_mission_pg_chips">
                    {section.chips.map((chip) => (
                      <span key={chip} className="ensai_case_mission_pg_chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* ---------------- Back button (bottom) ---------------- */}
        <button
          type="button"
          className="ensai_case_mission_pg_back_btn"
          onClick={handleBack}
        >
          <svg
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
            <path d="M19 12H5" />
            <path d="M11 6l-6 6 6 6" />
          </svg>
          <span>Back</span>
        </button>
      </div>
    </section>
  );
};

export default CaseMissionPlanning;