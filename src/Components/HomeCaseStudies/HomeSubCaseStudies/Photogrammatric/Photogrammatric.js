import React, { useEffect } from "react";
import "./Photogrammatric.css";

const METRICS = [
  { label: "Forward Overlap", value: "70% - 80%" },
  { label: "Side Overlap", value: "30% - 60%" },
  { label: "Ground Sample Distance", value: "1.2 - 2.5 cm/px" },
];

const CHECKLIST = [
  "SIFT keypoint matching",
  "Bundle Block Adjustment (BBA)",
  "True orthorectification eliminating perspective distortion",
];

const SECTIONS = [
  {
    id: "01",
    title: "Sensor Kinematics & Ground Sampling Distance (GSD)",
    intro:
      "Every pixel on the ground is sized by the sensor and the flight itself, so GSD is calculated before the mission, not after.",
    points: [
      "Pixel pitch of the sensor array",
      "Focal length of the mounted lens",
      "Flight altitude above ground level (AGL)",
    ],
    formula: (
      <div className="ensai_photo_grammatric_pg_formula_box">
        <span className="ensai_photo_grammatric_pg_formula_label">
          Ground Sample Distance
        </span>
        <div className="ensai_photo_grammatric_pg_formula_scroll">
          <p className="ensai_photo_grammatric_pg_formula">
            <i>GSD</i> = (<i>H</i>
            <sub>AGL</sub> × <i>p</i>
            <sub>s</sub>) / <i>f</i>
          </p>
        </div>
        <ul className="ensai_photo_grammatric_pg_legend">
          <li>
            <i>H</i>
            <sub>AGL</sub> : altitude above ground level
          </li>
          <li>
            <i>p</i>
            <sub>s</sub> : sensor pixel pitch
          </li>
          <li>
            <i>f</i> : lens focal length
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "02",
    title: "Collinearity Condition & Bundle Block Adjustment (BBA)",
    intro:
      "Every image ray is traced back through the lens to the exact point it was taken from, then all images are solved together for a single consistent model.",
    points: [
      "Euclidean perspective center ray-tracing",
      "Rotation matrix R(ω, φ, κ) for each exposure",
      "Lens radial and tangential distortion calibration",
    ],
    chips: ["Perspective Center", "R(ω, φ, κ)", "Radial Distortion", "Tangential Distortion"],
  },
  {
    id: "03",
    title: "Stereoscopic Parallax & Differential Elevation Extraction",
    intro:
      "Height differences on the ground show up as a shift between two overlapping images, and that shift is measured directly against the flight geometry.",
    points: [
      "Parallax displacement measured along the airbase B",
      "Differential elevation extracted from stereo pairs",
      "True ground height solved from flight altitude and parallax",
    ],
    formula: (
      <div className="ensai_photo_grammatric_pg_formula_box">
        <span className="ensai_photo_grammatric_pg_formula_label">
          True Height
        </span>
        <div className="ensai_photo_grammatric_pg_formula_scroll">
          <p className="ensai_photo_grammatric_pg_formula">
            <i>h</i> = (<i>H</i>
            <sub>AGL</sub> × Δ<i>p</i>) / (<i>B</i> + Δ<i>p</i>)
          </p>
        </div>
        <ul className="ensai_photo_grammatric_pg_legend">
          <li>
            <i>H</i>
            <sub>AGL</sub> : altitude above ground level
          </li>
          <li>
            <i>B</i> : airbase between exposures
          </li>
          <li>Δ<i>p</i> : parallax displacement</li>
        </ul>
      </div>
    ),
  },
  {
    id: "04",
    title: "8-Stage Photogrammetric Workflow",
    intro:
      "From raw capture to a deliverable model, the pipeline runs through eight controlled stages, each checked against a precision threshold.",
    points: [
      "Mechanical global shutter dynamics",
      "Sub-0.35 px reprojection error tolerance",
      "120 – 480 pts/m² point cloud density",
    ],
    chipsLabel: "Deliverable formats",
    chips: [
      "Dense Point Cloud .LAS",
      "DSM .TIF",
      "DTM",
      "True Orthomosaic",
      "3D Textured OBJ/GLB",
      "Volumetric Reports",
    ],
  },
];

const CameraRayIcon = () => (
  <svg
    className="ensai_photo_grammatric_pg_camera"
    viewBox="0 0 200 200"
    role="img"
    aria-label="Camera raytracing over a surface grid"
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
      <path d="M40 150 L40 160" />
      <path d="M70 150 L75 164" />
      <path d="M100 150 L100 166" />
      <path d="M130 150 L125 164" />
      <path d="M160 150 L160 160" />
    </g>
    <rect
      x="76"
      y="34"
      width="48"
      height="34"
      rx="4"
      fill="rgba(59,157,255,0.08)"
      stroke="#3b9dff"
      strokeWidth="1.6"
    />
    <rect
      x="92"
      y="24"
      width="16"
      height="12"
      rx="2"
      fill="rgba(59,157,255,0.08)"
      stroke="#3b9dff"
      strokeWidth="1.4"
    />
    <circle
      cx="100"
      cy="52"
      r="10"
      fill="rgba(255,138,31,0.12)"
      stroke="#ff8a1f"
      strokeWidth="1.6"
    />
    <circle cx="100" cy="52" r="4" fill="#ff8a1f" />
    <g stroke="rgba(255,138,31,0.55)" strokeWidth="1" strokeDasharray="2 4">
      <line x1="100" y1="60" x2="42" y2="150" />
      <line x1="100" y1="60" x2="100" y2="150" />
      <line x1="100" y1="60" x2="158" y2="150" />
    </g>
    <circle
      className="ensai_photo_grammatric_pg_camera_pulse"
      cx="100"
      cy="52"
      r="10"
      fill="none"
      stroke="#ff8a1f"
      strokeWidth="1.2"
    />
  </svg>
);

const Photogrammatric = () => {
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
    <section className="ensai_photo_grammatric_pg_section">
      <div className="ensai_photo_grammatric_pg_bg_grid" />
      <div className="ensai_photo_grammatric_pg_bg_orb" />
      <div className="ensai_photo_grammatric_pg_bg_scanline" />
      <div className="ensai_photo_grammatric_pg_bg_crt" />

      <div className="ensai_photo_grammatric_pg_container">
        {/* ---------------- Header ---------------- */}
        <header className="ensai_photo_grammatric_pg_hero">
          <div className="ensai_photo_grammatric_pg_hero_text">
            <span className="ensai_photo_grammatric_pg_badge">
              <span className="ensai_photo_grammatric_pg_badge_dot" />
              Optical Metrology & 3D Reconstruction
            </span>
            <span className="ensai_photo_grammatric_pg_eyebrow">
              Case Study 02
            </span>
            <h1 className="ensai_photo_grammatric_pg_title">
              Photogrammetric Surveying
            </h1>
            <p className="ensai_photo_grammatric_pg_summary">
              Airborne imagery is transformed into millimeter-accurate 3D
              measurements and surface models, turning overlapping photos
              into a single measurable digital surface.
            </p>
          </div>

          <div className="ensai_photo_grammatric_pg_visual">
            <span className="ensai_photo_grammatric_pg_corner ensai_photo_grammatric_pg_corner_tl" />
            <span className="ensai_photo_grammatric_pg_corner ensai_photo_grammatric_pg_corner_tr" />
            <span className="ensai_photo_grammatric_pg_corner ensai_photo_grammatric_pg_corner_bl" />
            <span className="ensai_photo_grammatric_pg_corner ensai_photo_grammatric_pg_corner_br" />
            <CameraRayIcon />
            <div className="ensai_photo_grammatric_pg_visual_tags">
              <span className="ensai_photo_grammatric_pg_visual_tag">GSD</span>
              <span className="ensai_photo_grammatric_pg_visual_tag">BBA</span>
              <span className="ensai_photo_grammatric_pg_visual_tag">3D</span>
            </div>
          </div>
        </header>

        {/* ---------------- Brief Overview ---------------- */}
        <div className="ensai_photo_grammatric_pg_panel">
          <h2 className="ensai_photo_grammatric_pg_panel_title">
            Brief Overview
          </h2>

          <div className="ensai_photo_grammatric_pg_metrics">
            {METRICS.map((metric) => (
              <div key={metric.label} className="ensai_photo_grammatric_pg_metric">
                <span className="ensai_photo_grammatric_pg_metric_label">
                  {metric.label}
                </span>
                <span className="ensai_photo_grammatric_pg_metric_value">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <ul className="ensai_photo_grammatric_pg_checklist">
            {CHECKLIST.map((item) => (
              <li key={item} className="ensai_photo_grammatric_pg_check_item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Detailed cards (always visible) ---------------- */}
        <div className="ensai_photo_grammatric_pg_cards">
          {SECTIONS.map((section) => (
            <article key={section.id} className="ensai_photo_grammatric_pg_card">
              <span className="ensai_photo_grammatric_pg_card_num">
                {section.id}
              </span>
              <h3 className="ensai_photo_grammatric_pg_card_title">
                {section.title}
              </h3>
              <p className="ensai_photo_grammatric_pg_card_intro">
                {section.intro}
              </p>

              <ul className="ensai_photo_grammatric_pg_points">
                {section.points.map((point) => (
                  <li key={point} className="ensai_photo_grammatric_pg_point">
                    {point}
                  </li>
                ))}
              </ul>

              {section.formula}

              {section.chips && (
                <div className="ensai_photo_grammatric_pg_chips_wrap">
                  {section.chipsLabel && (
                    <span className="ensai_photo_grammatric_pg_chips_label">
                      {section.chipsLabel}
                    </span>
                  )}
                  <div className="ensai_photo_grammatric_pg_chips">
                    {section.chips.map((chip) => (
                      <span key={chip} className="ensai_photo_grammatric_pg_chip">
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
          className="ensai_photo_grammatric_pg_back_btn"
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

export default Photogrammatric;