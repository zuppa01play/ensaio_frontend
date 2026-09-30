import React, { useEffect, useRef } from "react";
import "./AboutPage.css";

const PILLARS = [
  {
    id: "01",
    name: "MISSION",
    title: "Clear Objectives & Rigorous Parameters",
    focus: "Understand exactly what needs to be achieved.",
    points: [
      "Ingest and define deliverables, local geodetic CRS and vertical datums.",
      "Establish strict geodetic tolerances, GSD limits and ASPRS Class 1 accuracy thresholds.",
      "Synchronize client deliverable specifications directly into the flight design.",
    ],
  },
  {
    id: "02",
    name: "REHEARSAL",
    title: "Full 3D Desktop Validation",
    focus: "Validate the exact mission before physical crew deployment.",
    points: [
      "Place the exact flight path into a high-fidelity 3D digital surface twin.",
      "Simulate forward overlap (70%–80%) and side overlap (30%–60%) across steep relief.",
      "Model solar ephemeris to detect terrain shadows and BVLOS radio line-of-sight masking.",
      "Simulate wind, terrain gradients and temperature to calculate battery reserve envelopes.",
    ],
  },
  {
    id: "03",
    name: "CERTAINTY",
    title: "Evidence-Based Decision Governance",
    focus: "Make better-informed, auditable operational decisions.",
    points: [
      "Replace subjective pilot intuition with mathematical certainty.",
      "Generate an auditable Digital Rehearsal Certificate and mission audit log.",
      "Protect crew safety, eliminate re-flights and guarantee first-pass acceptance.",
    ],
  },
];

const AUDIENCE = [
  {
    title: "Survey & Cadastral Mapping",
    text: "Validating boundary surveys, geodetic control networks and high-precision base maps across complex terrain.",
  },
  {
    title: "GIS Operations & Data Centers",
    text: "Ensuring remote sensing datasets meet strict geodetic compliance before multi-terabyte ingestion.",
  },
  {
    title: "UAV / Drone Fleet Operators",
    text: "Moving enterprise operations from VLOS to high-stakes Beyond Visual Line of Sight (BVLOS).",
  },
  {
    title: "Civil Engineering & AEC",
    text: "Pre-verifying cut-and-fill volumetrics, corridor rights-of-way and BIM / digital twin integrations.",
  },
  {
    title: "Energy & Power Utilities",
    text: "Rehearsing transmission line inspections, pipeline rights-of-way and solar farm thermography.",
  },
  {
    title: "Open-Pit Mining & Aggregates",
    text: "Guaranteeing highwall monitoring, bench progression mapping and precise inventory volumetrics.",
  },
  {
    title: "Government, Defense & Public Safety",
    text: "Disaster recovery assessments, flood mitigation modeling, urban zoning and infrastructure security.",
  },
];

const TECH = [
  {
    title: "True 3D Terrain Ingestion",
    text: "Continuous high-resolution DSM/DTM integration with adaptive terrain-following AGL tracking.",
  },
  {
    title: "Computational Photogrammetry Engine",
    text: "Predicts stereoscopic base-to-height ratios (B/H), pixel scale shifts and dense point cloud density before flight.",
  },
  {
    title: "Solar Ephemeris & Lighting Simulator",
    text: "Models sun azimuth and elevation for the exact hour of flight to prevent canyon shadows and radiometric blowout.",
  },
  {
    title: "Aerodynamic & Battery Fatigue Modeling",
    text: "Accounts for climb rates, headwind vectors, payload draw and emergency return-to-home energy budgets.",
  },
  {
    title: "Airspace & Obstacle Intelligence",
    text: "Correlates transmission towers, communication masts, canopy heights and restricted airspace zones.",
  },
];

const AboutPage = () => {
  const pageRef = useRef(null);

  // Reveal-on-scroll
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".ensai_about_pg_reveal");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("ensai_about_pg_reveal_in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ensai_about_pg_reveal_in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ensai_about_pg_page" ref={pageRef}>
      {/* ================= HERO ================= */}
      <section className="ensai_about_pg_hero">
        <div className="ensai_about_pg_bg_grid" />
        <div className="ensai_about_pg_bg_orb ensai_about_pg_bg_orb_one" />
        <div className="ensai_about_pg_bg_orb ensai_about_pg_bg_orb_two" />

        <div className="ensai_about_pg_container">
          <span className="ensai_about_pg_eyebrow ensai_about_pg_reveal">
            <span className="ensai_about_pg_eyebrow_dot" />
            About enSaio
          </span>

          <h1 className="ensai_about_pg_h1 ensai_about_pg_reveal">
            Beyond Simulation.
            <span className="ensai_about_pg_h1_accent"> Into Certainty.</span>
          </h1>

          <p className="ensai_about_pg_motto ensai_about_pg_reveal">
            Prove it before you fly it.
          </p>

          <blockquote className="ensai_about_pg_thesis ensai_about_pg_reveal">
            <span className="ensai_about_pg_thesis_label">
              Core Operational Thesis
            </span>
            &ldquo;The most important time to discover a mission problem is
            before the mission begins.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_split">
            <div className="ensai_about_pg_reveal">
              <span className="ensai_about_pg_kicker">Executive Overview</span>
              <h2 className="ensai_about_pg_h2">
                The enterprise Digital Rehearsal platform for high-consequence
                geospatial missions.
              </h2>
            </div>

            <div className="ensai_about_pg_copy ensai_about_pg_reveal">
              <p>
                enSaio serves GIS surveying, photogrammetric mapping, drone
                operations and high-consequence geospatial missions. In
                conventional workflows, teams plan in abstract 2D tools and only
                discover failures — terrain-induced overlap collapse, shadow
                voids, sensor motion blur and battery exhaustion — after the
                aircraft is already in the air.
              </p>
              <p>
                enSaio introduces Digital Rehearsal as a pre-mobilization
                decision layer. By ingesting true 3D topography, exact camera
                optics, atmospheric factors and aircraft aerodynamics, it gives
                chief pilots, survey managers and project executives the
                verifiable evidence needed for confident go/no-go decisions
                before crews deploy to the field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Strategic Mandate</span>
            <h2 className="ensai_about_pg_h2">
              Bridging planning and execution.
            </h2>
          </div>

          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">Our Vision</span>
              <p className="ensai_about_pg_card_text">
                To make mission rehearsal a standard, non-negotiable decision
                point in professional geospatial and autonomous flight
                operations worldwide.
              </p>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge">Our Mission</span>
              <p className="ensai_about_pg_card_text">
                To empower geospatial teams to identify operational uncertainty,
                aerodynamic boundaries and data-quality risks before they become
                catastrophic field costs, schedule disruptions or client
                re-flights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THREE PILLARS ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Operational Pillars</span>
            <h2 className="ensai_about_pg_h2">
              Three integrated pillars of pre-flight assurance.
            </h2>
          </div>

          <div className="ensai_about_pg_pillars">
            {PILLARS.map((p, i) => (
              <article
                key={p.id}
                className="ensai_about_pg_pillar ensai_about_pg_reveal"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="ensai_about_pg_pillar_num">{p.id}</span>
                <span className="ensai_about_pg_pillar_name">{p.name}</span>
                <h3 className="ensai_about_pg_h3">{p.title}</h3>
                <p className="ensai_about_pg_pillar_focus">{p.focus}</p>
                <ul className="ensai_about_pg_list">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO WE SERVE ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Who We Serve</span>
            <h2 className="ensai_about_pg_h2">
              Built for teams where mapping failure and mobilization losses are
              unacceptable.
            </h2>
          </div>

          <div className="ensai_about_pg_audience">
            {AUDIENCE.map((a, i) => (
              <div
                key={a.title}
                className="ensai_about_pg_audience_card ensai_about_pg_reveal"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <h3 className="ensai_about_pg_h4">{a.title}</h3>
                <p className="ensai_about_pg_card_text">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY CORE ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Technology Core</span>
            <h2 className="ensai_about_pg_h2">
              A proprietary geospatial simulation architecture.
            </h2>
          </div>

          <div className="ensai_about_pg_tech">
            {TECH.map((t, i) => (
              <div
                key={t.title}
                className="ensai_about_pg_tech_item ensai_about_pg_reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="ensai_about_pg_tech_idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="ensai_about_pg_tech_body">
                  <h3 className="ensai_about_pg_h4">{t.title}</h3>
                  <p className="ensai_about_pg_card_text">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="ensai_about_pg_cta">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_cta_box ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Get Started</span>
            <h2 className="ensai_about_pg_h2">
              Ready to rehearse your next mission?
            </h2>
            <p className="ensai_about_pg_cta_text">
              See how enSaio fits into your existing GIS and UAV flight
              workflows, or test your own flight parameters in the cockpit.
            </p>

            <div className="ensai_about_pg_cta_btns">
              <button type="button" className="ensai_about_pg_btn_primary">
                Schedule an Enterprise Briefing
              </button>
              <button type="button" className="ensai_about_pg_btn_secondary">
                Launch the Digital Rehearsal Cockpit
              </button>
            </div>

            <p className="ensai_about_pg_cta_meta">
              ensaio.com &middot; Enterprise Geospatial Solutions &amp; Mission
              Audit Operations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;