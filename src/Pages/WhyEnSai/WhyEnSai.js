import React, { useEffect, useRef } from "react";
import "./WhyEnSai.css";

/* ---------------------------------------------------------------
   Content sourced from the "Why enSaio" strategic briefing
   (WP-ENSAIO-2026-WHY) — six imperatives, the tri-layer engine,
   stakeholder alignment, competitive positioning and the
   deployment sequence, all pulled from the document.
--------------------------------------------------------------- */

const imperatives = [
  {
    tag: "01",
    title: "Commercial Margin Immunity & SLA Protection",
    text: "Utility and pipeline contracts impose $5,000–$25,000/day in liquidated damages for late data. enSaio calculates the exact timeline impact of a 20-knot headwind before it blows past your delivery cutoff.",
  },
  {
    tag: "02",
    title: "Zero Stranded Mobilization",
    text: "A certified BVLOS crew — RPIC, visual observers, ground control, tracking antennas — costs $5,000–$12,000/day to deploy. enSaio rehearses the flight before anyone leaves the yard.",
  },
  {
    tag: "03",
    title: "Underwriting Compliance & Liability Shield",
    text: "Drone liability underwriters cap gusts at 22 knots (11.3 m/s). enSaio cross-references live microclimates against your policy endorsements so no flight ever voids the $5M coverage behind it.",
  },
  {
    tag: "04",
    title: "Tactical Mission Assurance for Defense",
    text: "Models contested RF horizons, GPS-jammed navigation fallbacks, terrain-masking corridors and 240Hz precision-approach guidance into denied structures. Certainty before contact.",
  },
  {
    tag: "05",
    title: "First-Pass Geospatial Acceptance",
    text: "Pre-computes photogrammetric overlap, LiDAR pulse repetition frequency and ground sampling distance against real 3D terrain meshes — ASPRS Class 1 (<5cm RMSE) validated before takeoff.",
  },
  {
    tag: "06",
    title: "Automated Force Majeure Verification",
    text: "Generates a cryptographically timestamped Pre-Flight Meteorological Due Diligence Audit Pack — an unassailable artifact that triggers weather-delay clauses without litigation.",
  },
];

const engineLayers = [
  {
    tag: "LAYER 01",
    title: "4D Physical & Microclimate Mesh",
    points: [
      "Sub-meter topography from raw LiDAR bare-earth models & DEM rasters",
      "3D Navier-Stokes CFD — mountain lee-wave rotors, canyon Venturi shear",
      "True 6DoF aero-thermal dynamics: drag curves, prop stall, battery electrochemistry",
    ],
  },
  {
    tag: "LAYER 02",
    title: "Payload Optics & Electromagnetic Twin",
    points: [
      "Photogrammetric raytracing — shutter sync, motion blur thresholds",
      "LiDAR geometry verification — beam divergence, PRF, point density",
      "RF / BVLOS horizon — Fresnel zone clearance, GNSS constellation visibility",
    ],
  },
  {
    tag: "LAYER 03",
    title: "Contractual & Governance Ruleset",
    points: [
      "Machine-readable SLAs — delivery cutoffs, liquidated damages rates",
      "Insurance warranty boundaries — gust thresholds, VFR minimums",
      "Cryptographic audit trails aligned to ISO 9001 / ISO 19157",
    ],
  },
];

const stakeholders = [
  {
    role: "CEO & Board",
    text: "Protects capital allocation and guarantees predictable margin across high-risk service contracts.",
  },
  {
    role: "General Counsel & Risk",
    text: "An unbreachable liability firewall — pre-flight due diligence that shields against negligence claims.",
  },
  {
    role: "VP Operations",
    text: "Eliminates wasted mobilization budgets and guarantees 100% adherence to customer SLA milestones.",
  },
  {
    role: "Chief Surveyors",
    text: "Mathematical certainty of first-pass capture — ASPRS precision verified before launch, not after.",
  },
];

const comparisonRows = [
  { dim: "Primary Objective", sim: "Stick skills only", gis: "2D/3D waypoint plotting", ensaio: "Full mission outcome & contract de-risking" },
  { dim: "Atmospheric Engine", sim: "Uniform wind sliders", gis: "Basic METAR feeds", ensaio: "4D CFD non-linear microclimates" },
  { dim: "Contract & SLA", sim: "Blind", gis: "Blind", ensaio: "Machine-readable ingestion & audit gates" },
  { dim: "Insurance Compliance", sim: "None", gis: "None", ensaio: "Real-time gust warranty enforcement" },
  { dim: "Commercial Impact", sim: "No protection", gis: "Frequent aborted flights", ensaio: "+$16,500 capital preserved / flight" },
];

const deploySteps = [
  { tag: "STEP 01", title: "Ingest Contracts & Warranties", text: "Raw PDF client agreements, liquidated-damage milestones and insurance endorsements become enforceable digital boundaries." },
  { tag: "STEP 02", title: "Sync Airframe & Payload", text: "Connect verified aerodynamic polar curves, battery discharge tables and sensor specifications for your fleet." },
  { tag: "STEP 03", title: "Run Pre-Mobilization Rehearsal", text: "At T-minus 90 minutes, a multi-threaded co-simulation evaluates terrain, optics and contract cutoffs together." },
  { tag: "STEP 04", title: "Certified Go / No-Go Gate", text: "Operations directors receive a deterministic pass/fail recommendation and a tamper-proof audit certificate." },
];

const BG_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1790061192/ChatGPT_Image_Sep_22_2026_12_42_59_PM_pw5jcy.png";
const FOUNDER_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1787305095/Sai_uudlzi.png";

const WhyEnSai = () => {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const progressRef = useRef(null);
  const tiltRef = useRef(null);

  /* Top scroll-progress bar (whole page) + a bounded parallax drift
     on the hero image panel, computed off the panel's own position
     so it can never drift the image out of its frame on a long
     page — unlike a raw window.scrollY offset would. */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const docY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (docY / maxScroll) * 100 : 0;
        if (progressRef.current) progressRef.current.style.width = `${pct}%`;

        if (heroRef.current && bgRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          const raw = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const progress = Math.min(1, Math.max(0, raw));
          const drift = (progress - 0.5) * 46;
          bgRef.current.style.transform = `translate3d(0, ${drift}px, 0) scale(1.14)`;
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll for every section/card
  useEffect(() => {
    const targets = document.querySelectorAll(".ensai_why_pg_reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ensai_why_pg_reveal_in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 3D tilt on the founder photo
  const handleTiltMove = (e) => {
    const card = tiltRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const rotateY = (relX - 0.5) * 18;
    const rotateX = (0.5 - relY) * 18;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
  };

  const handleTiltLeave = () => {
    const card = tiltRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };


  useEffect(() => {
    document.querySelector("#root")?.scrollIntoView({ behavior: "smooth" });
  }, []);



  return (
    <div className="ensai_why_pg_wrap">
      <div className="ensai_why_pg_progress_track">
        <div className="ensai_why_pg_progress_bar" ref={progressRef} />
      </div>

      {/* ---------------- HERO — col-lg-6 split ---------------- */}
      <section className="ensai_why_pg_hero" ref={heroRef}>
        <div className="ensai_why_pg_hero_media">
          <div
            className="ensai_why_pg_hero_media_img"
            ref={bgRef}
            style={{ backgroundImage: `url(${BG_IMG})` }}
          />
          <div className="ensai_why_pg_hero_media_grade" />
          <span className="ensai_why_pg_hero_media_badge">LIVE REHEARSAL FEED</span>
          <span className="ensai_why_pg_bracket ensai_why_pg_bracket_tl" aria-hidden="true" />
          <span className="ensai_why_pg_bracket ensai_why_pg_bracket_br" aria-hidden="true" />
        </div>

        <div className="ensai_why_pg_hero_content">
          <span className="ensai_why_pg_hero_ref ensai_why_pg_reveal">WP-ENSAIO-2026-WHY</span>
          <h1 className="ensai_why_pg_hero_title ensai_why_pg_reveal">
            Missions don&apos;t fail aerodynamically.
            <span className="ensai_why_pg_hero_title_accent">
              They fail commercially, contractually, and legally.
            </span>
          </h1>
          <p className="ensai_why_pg_hero_sub ensai_why_pg_reveal">
            enSaio co-simulates flight physics, sensor optics and the contract itself — a
            deterministic Go / No-Go decision, delivered before crews ever mobilize.
          </p>

          <div className="ensai_why_pg_hero_stats ensai_why_pg_reveal">
            <div className="ensai_why_pg_hero_stat">
              <span className="ensai_why_pg_hero_stat_num">$25K</span>
              <span className="ensai_why_pg_hero_stat_label">/ day LD exposure modeled</span>
            </div>
            <div className="ensai_why_pg_hero_stat">
              <span className="ensai_why_pg_hero_stat_num">$5M</span>
              <span className="ensai_why_pg_hero_stat_label">liability policy protected</span>
            </div>
            <div className="ensai_why_pg_hero_stat">
              <span className="ensai_why_pg_hero_stat_num">T-90</span>
              <span className="ensai_why_pg_hero_stat_label">min decision gate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Paradox statement ---------------- */}
      <section className="ensai_why_pg_paradox ensai_why_pg_reveal">
        <p className="ensai_why_pg_paradox_kicker">The Trillion-Dollar Autonomy Paradox</p>
        <p className="ensai_why_pg_paradox_text">
          Airframe reliability has soared — yet commercial and mission default rates remain
          persistently high. A flight can clear every waypoint with zero physical damage and
          still trigger $10,000/day liquidated-damages penalties, void a $5,000,000 liability
          policy, or waste $6,500/day in stranded mobilization overhead.
        </p>
      </section>

      {/* ---------------- Six imperatives ---------------- */}
      <section className="ensai_why_pg_section">
        <h2 className="ensai_why_pg_section_title ensai_why_pg_reveal">
          Six Strategic Imperatives
        </h2>
        <div className="ensai_why_pg_grid">
          {imperatives.map((item, idx) => (
            <div
              className="ensai_why_pg_card ensai_why_pg_reveal"
              key={item.tag}
              style={{ transitionDelay: `${idx * 70}ms` }}
            >
              <span className="ensai_why_pg_card_tag">{item.tag}</span>
              <h3 className="ensai_why_pg_card_title">{item.title}</h3>
              <p className="ensai_why_pg_card_text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Decision gate (dark console panel) ---------------- */}
      <section className="ensai_why_pg_gate ensai_why_pg_reveal">
        <div className="ensai_why_pg_gate_inner">
          <span className="ensai_why_pg_gate_tag">DIGITAL REHEARSAL // DECISION GATE</span>
          <h2 className="ensai_why_pg_gate_title">The Digital Rehearsal Decision Gate</h2>
          <p className="ensai_why_pg_gate_text">
            At T-minus 90 minutes, enSaio runs terrain microclimates, sensor overlap and contract
            cutoffs through one co-simulation loop — and returns a single, auditable pass/fail
            before mobilization.
          </p>
        </div>
      </section>

      {/* ---------------- Tri-layer engine ---------------- */}
      <section className="ensai_why_pg_section">
        <h2 className="ensai_why_pg_section_title ensai_why_pg_reveal">
          The Tri-Layer Rehearsal Engine
        </h2>
        <div className="ensai_why_pg_layers">
          {engineLayers.map((layer, idx) => (
            <div
              className="ensai_why_pg_layer ensai_why_pg_reveal"
              key={layer.tag}
              style={{ transitionDelay: `${idx * 90}ms` }}
            >
              <span className="ensai_why_pg_layer_tag">{layer.tag}</span>
              <h3 className="ensai_why_pg_layer_title">{layer.title}</h3>
              <ul className="ensai_why_pg_layer_list">
                {layer.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Stakeholder alignment ---------------- */}
      <section className="ensai_why_pg_section ensai_why_pg_section_tint">
        <h2 className="ensai_why_pg_section_title ensai_why_pg_reveal">Who Wins With enSaio</h2>
        <div className="ensai_why_pg_stake_grid">
          {stakeholders.map((s, idx) => (
            <div
              className="ensai_why_pg_stake ensai_why_pg_reveal"
              key={s.role}
              style={{ transitionDelay: `${idx * 70}ms` }}
            >
              <h3 className="ensai_why_pg_stake_role">{s.role}</h3>
              <p className="ensai_why_pg_stake_text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Competitive positioning ---------------- */}
      <section className="ensai_why_pg_section">
        <h2 className="ensai_why_pg_section_title ensai_why_pg_reveal">
          Why Nothing Else Solves This
        </h2>
        <div className="ensai_why_pg_table_wrap ensai_why_pg_reveal">
          <table className="ensai_why_pg_table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Standard Simulators</th>
                <th>GIS Flight Planners</th>
                <th className="ensai_why_pg_table_hl">enSaio</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.dim}>
                  <td>{row.dim}</td>
                  <td>{row.sim}</td>
                  <td>{row.gis}</td>
                  <td className="ensai_why_pg_table_hl">{row.ensaio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Deployment sequence ---------------- */}
      <section className="ensai_why_pg_section ensai_why_pg_section_tint">
        <h2 className="ensai_why_pg_section_title ensai_why_pg_reveal">
          Zero-Friction Deployment
        </h2>
        <div className="ensai_why_pg_steps">
          {deploySteps.map((step, idx) => (
            <div
              className="ensai_why_pg_step ensai_why_pg_reveal"
              key={step.tag}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <span className="ensai_why_pg_step_tag">{step.tag}</span>
              <h3 className="ensai_why_pg_step_title">{step.title}</h3>
              <p className="ensai_why_pg_step_text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Founder — col-lg-6 split, 3D hover tilt ---------------- */}
      <section className="ensai_why_pg_founder ensai_why_pg_reveal">
        <div
          className="ensai_why_pg_founder_media"
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
        >
          <div className="ensai_why_pg_founder_glow" />
          <div className="ensai_why_pg_founder_tilt" ref={tiltRef}>
            <img
              className="ensai_why_pg_founder_img"
              src={FOUNDER_IMG}
              alt="Founder and Managing Director, Zuppa Geo Navigation Technologies"
              loading="lazy"
            />
            <span className="ensai_why_pg_bracket ensai_why_pg_bracket_tl" aria-hidden="true" />
            <span className="ensai_why_pg_bracket ensai_why_pg_bracket_tr" aria-hidden="true" />
            <span className="ensai_why_pg_bracket ensai_why_pg_bracket_bl" aria-hidden="true" />
            <span className="ensai_why_pg_bracket ensai_why_pg_bracket_br" aria-hidden="true" />
          </div>
        </div>

        <div className="ensai_why_pg_founder_content">
          <span className="ensai_why_pg_founder_tag">FROM THE FOUNDER</span>
          <p className="ensai_why_pg_founder_name">Founder</p>
          <p className="ensai_why_pg_founder_role">
            Thought leader in the Indian Drone Ecosystem &middot; Founder &middot; MD, Zuppa Geo
            Navigation Technologies Pvt Ltd
          </p>
          <p className="ensai_why_pg_founder_quote">
            &ldquo;A flight plan that ignores the contract behind it isn&apos;t a plan — it&apos;s
            a liability waiting for a weather window. enSaio exists to close that gap before a
            single vehicle leaves the yard.&rdquo;
          </p>
        </div>
      </section>

      {/* ---------------- Closing taglines ---------------- */}
      <section className="ensai_why_pg_close ensai_why_pg_reveal">
        <div className="ensai_why_pg_close_item">
          <h3>Enterprise</h3>
          <p>De-risk the deal before you sign it.</p>
        </div>
        <div className="ensai_why_pg_close_item">
          <h3>Defense</h3>
          <p>Certainty before contact.</p>
        </div>
        <div className="ensai_why_pg_close_item">
          <h3>Geomatics</h3>
          <p>Beyond simulation. Into certainty.</p>
        </div>
      </section>
    </div>
  );
};

export default WhyEnSai;