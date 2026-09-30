import React, { useEffect, useState } from "react";
import "./GisPage.css";

const METRICS = [
  { label: "Spatial Accuracy", value: "±1.2 cm RMSE" },
  { label: "Data Models", value: "Vector & Raster" },
  { label: "Datum Reference", value: "WGS84 / UTM / EPSG" },
];

const CHECKLIST = [
  "Sub-centimeter GNSS georeferencing",
  "Parcel / TIN integration",
  "Enterprise GIS database connectivity",
];

const SECTIONS = [
  {
    id: "01",
    title: "Coordinate Reference Systems (CRS) & Ellipsoidal Geodesy",
    intro:
      "Every coordinate is anchored to a mathematical model of the Earth, so ground survey data and airborne data always agree.",
    points: [
      "Mathematical reference ellipsoids: ECEF (Earth Centered Earth Fixed) , NED-Z and WGS84",
      "Map projections: UTM and SPCS",
      "Geoid undulation models for converting GNSS heights",
    ],
    formula: (
      <div className="ensai_gis_pg_formula_box">
        <span className="ensai_gis_pg_formula_label">
          Orthometric elevation
        </span>
        <div className="ensai_gis_pg_formula_scroll">
          <p className="ensai_gis_pg_formula">
            <i>H</i> = <i>h</i> − <i>N</i>
          </p>
        </div>
        <ul className="ensai_gis_pg_legend">
          <li>
            <i>H</i> : orthometric height (above the geoid)
          </li>
          <li>
            <i>h</i> : ellipsoidal height (from GNSS)
          </li>
          <li>
            <i>N</i> : geoid undulation
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "02",
    title: "Dual Spatial Engine (Vector vs. Raster)",
    intro:
      "Vector geometries and raster surfaces are handled side by side, with strict rules that keep the data clean and fast to query.",
    points: [
      "Topology validation rules: zero overlap and closed boundaries",
      "Floating-point 32-bit rasters",
      "Spatial indexing: R-Tree, Quadtree and H3",
    ],
    chips: ["Vector", "Raster", "R-Tree", "Quadtree", "H3"],
  },
  {
    id: "03",
    title: "Ground Control Point (GCP) Geometry & RMSE3D Auditing",
    intro:
      "Accuracy is proven, not assumed. Control points are audited against independent reference coordinates.",
    points: [
      "Systematic target placement across the mapped area",
      "Compliance with ASPRS standards",
      "3D root-mean-square error as the audit metric",
    ],
    formula: (
      <div className="ensai_gis_pg_formula_box">
        <span className="ensai_gis_pg_formula_label">3D RMSE</span>
        <div className="ensai_gis_pg_formula_scroll">
          <p className="ensai_gis_pg_formula">
            RMSE<sub>3D</sub> = √ ( (1 / <i>n</i>) · Σ<sub>i=1</sub>
            <sup>n</sup> [ (<i>X</i>
            <sub>i</sub> − <i>X</i>
            <sub>ref</sub>)² + (<i>Y</i>
            <sub>i</sub> − <i>Y</i>
            <sub>ref</sub>)² + (<i>Z</i>
            <sub>i</sub> − <i>Z</i>
            <sub>ref</sub>)² ] )
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "04",
    title: "GIS in enSaio Digital Rehearsal",
    intro:
      "Before any mobilization, site data is ingested into the rehearsal environment so the mission is planned against real constraints.",
    points: [
      "Pre-mobilization ingestion of cadastral boundaries",
      "Airspace geofences",
      "Slope clearances",
    ],
    chipsLabel: "Deliverable formats",
    chips: [
      "GeoTIFF / COG",
      "Shapefile",
      "GeoPackage",
      "PostGIS",
      "LandXML",
      "LAS/LAZ",
    ],
  },
];

const GisPage = () => {
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
    <section className="ensai_gis_pg_section">
      <div className="ensai_gis_pg_bg_grid" />
      <div className="ensai_gis_pg_bg_orb" />
      <div className="ensai_gis_pg_bg_scanline" />
      <div className="ensai_gis_pg_bg_crt" />

      <div className="ensai_gis_pg_container">
        {/* ---------------- Header ---------------- */}
        {/* (unga header code same-ah irukkatum, mela irundha Back button mattum remove pannunga) */}

        {/* ---------------- Brief Overview ---------------- */}
        <div className="ensai_gis_pg_panel">
          <h2 className="ensai_gis_pg_panel_title">Brief Overview</h2>

          <div className="ensai_gis_pg_metrics">
            {METRICS.map((metric) => (
              <div key={metric.label} className="ensai_gis_pg_metric">
                <span className="ensai_gis_pg_metric_label">
                  {metric.label}
                </span>
                <span className="ensai_gis_pg_metric_value">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <ul className="ensai_gis_pg_checklist">
            {CHECKLIST.map((item) => (
              <li key={item} className="ensai_gis_pg_check_item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {/* toggle_wrap + button completely removed */}
        </div>

        {/* ---------------- Detailed cards (always visible) ---------------- */}
        <div className="ensai_gis_pg_cards">
          {SECTIONS.map((section) => (
            <article key={section.id} className="ensai_gis_pg_card">
              <span className="ensai_gis_pg_card_num">{section.id}</span>
              <h3 className="ensai_gis_pg_card_title">{section.title}</h3>
              <p className="ensai_gis_pg_card_intro">{section.intro}</p>

              <ul className="ensai_gis_pg_points">
                {section.points.map((point) => (
                  <li key={point} className="ensai_gis_pg_point">
                    {point}
                  </li>
                ))}
              </ul>

              {section.formula}

              {section.chips && (
                <div className="ensai_gis_pg_chips_wrap">
                  {section.chipsLabel && (
                    <span className="ensai_gis_pg_chips_label">
                      {section.chipsLabel}
                    </span>
                  )}
                  <div className="ensai_gis_pg_chips">
                    {section.chips.map((chip) => (
                      <span key={chip} className="ensai_gis_pg_chip">
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
          className="ensai_gis_pg_back_btn"
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

export default GisPage;
