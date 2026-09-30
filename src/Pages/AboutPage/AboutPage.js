import React, { useEffect, useRef } from "react";
import "./AboutPage.css";

// Replace with your own About-page hero image any time
const HERO_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1790750756/ChatGPT_Image_Sep_30_2026_12_15_21_PM_g1de50.png";

const PILLARS = [
  {

   
    title: "Exact Datums & Spatial Tolerances",
   points: [
      "Define Coordinate Reference Systems (CRS), horizontal datums (WGS84, ITRF, UTM, State Plane) and vertical height references.",
      "Model geoid undulation separation (N) between ellipsoidal heights (h) and orthometric elevations (H) using EGM2008 and GEOID18.",
      "Establish rigorous ASPRS Class 1 / Class 2 vertical and horizontal RMSE tolerances.",
    ],
  },
  {

   
    title: "Multi-Constellation Validation",
    points: [
      "Forecast orbital ephemeris across GPS (USA), Galileo (EU), GLONASS (RU) and BeiDou (CN) for the exact mission time window.",
      "Pre-calculate 3D Positional Dilution of Precision (PDOP), Horizontal DOP (HDOP) and Vertical DOP (VDOP) envelopes.",
      "Identify satellite signal occlusion, mountain ridge shadowing and vegetation canopy cycle slip risks.",
   ],
  },
  {

    name: "SUB-CENTIMETER CERTAINTY",
    title: "Certified Geodetic Ground Truth",
   points: [
      "Eliminate multipath reflections and guarantee fixed carrier-phase integer ambiguity resolution.",
      "Verify shutter-synchronized GNSS geotagging against camera Antenna Phase Center (APC) lever-arm offsets.",
      "Issue an auditable Geodetic Rehearsal Certificate certifying zero field re-measurements.",
    ],
  },
];

const AUDIENCE = [
  {
    title: "Licensed Geodetic & Cadastral Surveyors",
    text: "Ensuring legal boundary surveys, control network monuments and basemaps meet statutory geodetic accuracy.",
  },
  {
    title: "RTK / PPK Drone & Aerial LiDAR Teams",
    text: "Eliminating aerial geotagging drift, cycle slips and sensor lever-arm offsets before takeoff.",
  },
  {
    title: "GIS Operations & Spatial Database Directors",
    text: "Guaranteeing clean spatial alignment and seamless geodetic ingestion across enterprise GIS layers.",
  },
  {
    title: "Civil Engineering & AEC Survey Crews",
    text: "Eliminating coordinate mismatch and cut-and-fill volumetric errors between site benchmarks and design models.",
  },
  {
    title: "Linear Infrastructure & Corridor Utilities",
    text: "Rehearsing long-range pipeline and powerline BVLOS GPS baselines spanning multiple geodetic zones.",
  },
  {
    title: "Mining & Heavy Earthwork Operations",
    text: "Maintaining continuous GNSS control across deep open pits and moving highwalls.",
  },

];

const TECH = [
  {
    title: "Multi-Constellation Satellite Ephemeris Engine",
    text: "Real-time orbital prediction across 4 major constellations (GPS, Galileo, GLONASS, BeiDou) to maximize visible satellite count and geometric strength.",
  },
  {
    title: "PDOP & HDOP Degradation Forecaster",
    text: "Calculates dilution of precision along the full survey corridor, flagging poor satellite geometry windows before mobilizing.",
  },
  {
    title: "RTK / PPK Baseline Feasibility",
    text: "Simulates dual-frequency (L1/L2/L5) carrier-phase baselines against CORS, VRS and physical base station setups.",
  },
  {
    title: "Terrain Masking & Horizon Multipath Analysis",
    text: "Integrates high-resolution elevation models (DEM/DTM) to expose satellite signal reflections off canyon walls, pit highwalls and urban structures.",
  },
  {
    title: "Datum & Geoid Transformation Verification",
    text: "Pre-computes coordinate shifts between global ellipsoids and local ground control networks to avoid vertical datum errors.",
  },
  {
    title: "ASPRS Class 1 Spatial Compliance Engine",
    text: "Validates that combined GPS, sensor timing and Ground Control Point (GCP) distribution will achieve sub-centimeter (±1.5 cm) geodetic RMSE.",
  },
];

const AboutPage = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const innerRef = useRef(null);

  // Hero parallax (image drifts down slowly) + hero text fades up while scrolling
  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;

    const update = () => {
      const hero = heroRef.current;
      if (!hero) {
        ticking = false;
        return;
      }
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${
          progress * rect.height * 0.28
        }px, 0) scale(1.12)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(0, ${
          -progress * 70
        }px, 0)`;
        innerRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 1.5)
        );
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Fade-up reveal for every section / card
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

  useEffect(() => {
    document.querySelector("#root")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="ensai_about_pg_page" ref={pageRef}>
      {/* ================= HERO ================= */}
      <section className="ensai_about_pg_hero" ref={heroRef}>
        <div
          className="ensai_about_pg_hero_bg"
          ref={bgRef}
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="ensai_about_pg_hero_overlay" />

        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_hero_inner" ref={innerRef}>
            <h1 className="ensai_about_pg_h1 ensai_about_pg_reveal">
              FROM GEOSPATIAL UNCERTAINTY. INTO OPERATIONAL CERTAINTY.
              <span className="ensai_about_pg_h1_accent"> Into Certainty.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_split">
            <div className="ensai_about_pg_reveal">
              <span className="ensai_about_pg_kicker">Executive Overview</span>
              <h2 className="ensai_about_pg_h2">
                The enterprise GNSS Satellite Positioning &amp; Geodetic
                Rehearsal platform for professional surveyors, geodesists, GIS
                mapping teams and high-consequence drone operations.
              </h2>
<br/>
<br/>
              <blockquote className="ensai_about_pg_quote">
                <span className="ensai_about_pg_quote_label">
                  Core Operational Mandate
                </span>
                &ldquo;Centimeter-level GPS accuracy begins before the rover,
                sensor, or aircraft leaves the ground.&rdquo;
              </blockquote>
            </div>

            <div className="ensai_about_pg_copy ensai_about_pg_reveal">
              <p>
                enSaio is not a flight simulator or stick-training game. It is a
                computational geodetic validation engine. Traditional survey
                workflows rely on static planning tools and only discover
                positioning failures — such as loss of satellite lock, severe
                multipath reflection, carrier-phase ambiguity drops and RTK base
                station baseline degradation — after field crews are already
                deployed.
              </p>
              <p>
                enSaio introduces Pre-Mobilization GPS Rehearsal. By modeling
                orbital satellite ephemeris, local terrain horizon obstructions,
                atmospheric ionospheric delays and geodetic datum
                transformations in true 3D, enSaio provides the mathematical
                certainty required to eliminate spatial errors and costly field
                re-surveys.
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
              Eliminating field geodetic uncertainty.
            </h2>
          </div>

          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">Our Vision</span>
              <p className="ensai_about_pg_card_text">
                To make multi-constellation GNSS satellite rehearsal and
                geodetic integrity validation the universal pre-mobilization
                standard across professional surveying and geospatial
                operations worldwide.
              </p>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge">Our Mission</span>
              <p className="ensai_about_pg_card_text">
                Empower surveying and mapping teams to eliminate GPS
                loss-of-lock, RTK baseline collapse and coordinate datum
                distortions before physical mobilization — guaranteeing
                sub-centimeter spatial accuracy on the first pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THREE PILLARS ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Geodetic Pillars</span>
            <h2 className="ensai_about_pg_h2">The three geodetic pillars.</h2>
          </div>

          <div className="ensai_about_pg_pillars">
            {PILLARS.map((p, i) => (
              <article
                key={p.id}
                className="ensai_about_pg_pillar ensai_about_pg_reveal"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <h3 className="ensai_about_pg_h3">{p.title}</h3>
           <br/>
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
              Built for teams where positioning failure and field re-surveys are
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

      {/* ================= TECHNOLOGY ENGINE ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_head ensai_about_pg_reveal">
            <span className="ensai_about_pg_kicker">Technology Engine</span>
            <h2 className="ensai_about_pg_h2">
              The enSaio GPS &amp; Geodetic Technology Engine.
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
              Ready to validate your GPS parameters?
            </h2>
            <br />
            <p className="ensai_about_pg_cta_text">
              Discover how enSaio integrates with your existing GNSS receivers,
              CORS networks and GIS survey pipelines, or evaluate satellite
              geometry, base station baselines and coordinate datums in the
              Digital Rehearsal engine.
            </p>

            <div className="ensai_about_pg_cta_btns">
              <button type="button" className="ensai_about_pg_btn_primary">
                Schedule an Enterprise Technical Briefing
              </button>
              <button type="button" className="ensai_about_pg_btn_secondary">
                Test Your Geodetic Parameters
              </button>
            </div>
            <br />
            <p className="ensai_about_pg_cta_meta">
              ensaio.com &middot; Enterprise GNSS Positioning &amp; Geodetic
              Rehearsal Infrastructure
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;