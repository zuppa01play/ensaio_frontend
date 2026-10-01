import React, { useEffect, useRef } from "react";
import "./HomeMappingPoint.css";

const POINTS = [
  {
    id: "01",
    icon: "wind",
    title: "Flights that “look fine” fail only in post-processing",
    stat: {
      value: "75% → 65–68%",
      label: "planned overlap lost on uneven terrain",
    },
    problems: [
      "Wind gusts of 37–57 km/h cause overlap gaps and inconsistent GSD — only visible after landing.",
      "Constant-altitude flights over uneven terrain silently drop 75% planned overlap to 65–68%.",
      "Batteries below 15°C lose capacity faster than manual estimates account for.",
      "No FAA or industry body tracks re-flight or failure rates — operators fly on anecdote, not benchmarks.",
    ],
    angle:
      "Simulate wind, terrain and battery load against the flight plan before launch — catch infeasible missions at the desk, not after a wasted site visit.",
  },
  {
    id: "02",
    icon: "file",
    title: "Waiver rejections are a paperwork problem, not a risk problem",
    stat: {
      value: "Part 108",
      label: "BVLOS final rule is still pending",
    },
    problems: [
      "LAANC solved routine airspace access, but complex waivers still stall on incomplete risk-mitigation narratives.",
      "BVLOS (Part 108) rulemaking remains pending — final rule timing is still uncertain.",
      "Flight logs and pre-flight records are the key evidence in insurance claims and liability defense.",
   "Until the BVLOS rule is final, operators have to plan around uncertainty and justify each complex flight on its own."
   
    ],
    angle:
      "Auto-generated mission plans (flight path, coverage, obstacle and airspace risk) map directly onto what waiver reviewers and insurers ask for.",
  },
  {
    id: "03",
    icon: "target",
    title: "Invisible planning errors become client rework weeks later",
    stat: {
      value: "Tens of cm",
      label: "of error from poor GCP placement",
    },
    problems: [
      "Poor GCP placement can introduce tens of centimetres of error.",
      "Camera trigger-interval limits are routinely exceeded by planned overlap — discovered only in QA reports.",
      "Missed ASPRS accuracy classes erode client trust and trigger duplicate manual verification.",
    "Errors surface only in QA, so fixing them means a repeat site visit and a delayed delivery."
    ],
    angle:
      "Validate overlap, GSD and trigger feasibility against terrain and camera specs before flying — confirm a mission can hit its contracted accuracy class at the planning desk.",
  },
  {
    id: "04",
    icon: "swap",
    title: "DJI restrictions turned training into a compliance deadline",
    stat: {
      value: "97.1%",
      label: "of contractor drone fleets are still DJI",
    },
    problems: [
      "DJI is on the FCC Covered List (Dec 2025); firmware support sunsets Jan 1, 2027.",
      "97.1% of contractor drone fleets are still DJI — nearly all face a forced transition.",
      "Florida's state DJI ban: 8–14x replacement cost, and mission volumes collapsed from 100+ a month to 5.",
      "New platforms (Wingtra, Skydio, etc.) mean new workflows — PPK vs RTK, tablet monitoring, per-platform planning software.",
    ],
    angle:
      "Let pilots rehearse missions on an unfamiliar Blue UAS platform in simulation first — shorten retraining time without burning live flight risk.",
  },
];

const PointIcon = ({ type }) => {
  const common = {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (type) {
    case "wind":
      return (
        <svg {...common}>
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
          <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
          <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      );
  }
};

const HomeMappingPoint = () => {
  const sectionRef = useRef(null);

  /* Fade-up reveal when each card scrolls into view */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const items = root.querySelectorAll(".ensai_home_mapping_pg_reveal");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) =>
        el.classList.add("ensai_home_mapping_pg_reveal_in")
      );
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${order * 0.12}s`;
            entry.target.classList.add("ensai_home_mapping_pg_reveal_in");
            observer.unobserve(entry.target);
            order += 1;
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ensai_home_mapping_pg_section"
      aria-labelledby="ensai_home_mapping_pg_heading"
      ref={sectionRef}
    >
      <div className="ensai_home_mapping_pg_glow ensai_home_mapping_pg_glow_one" />
      <div className="ensai_home_mapping_pg_glow ensai_home_mapping_pg_glow_two" />

      <div className="ensai_home_mapping_pg_container">
        {/* Heading */}
        <div className="ensai_home_mapping_pg_head">
          <span className="ensai_home_mapping_pg_kicker">
            US Survey &amp; Mapping Pain Points
          </span>
          <h2
            id="ensai_home_mapping_pg_heading"
            className="ensai_home_mapping_pg_title"
          >
            Where mapping missions go wrong — and where enSaio steps in
          </h2>
          <p className="ensai_home_mapping_pg_lead">
            Four problems US survey and mapping companies face today, each
            paired with how enSaio solves it before the drone takes off.
          </p>
        </div>

        {/* Cards */}
        <div className="ensai_home_mapping_pg_grid">
          {POINTS.map((point) => (
            <article
              key={point.id}
              className="ensai_home_mapping_pg_card ensai_home_mapping_pg_reveal"
            >
              <div className="ensai_home_mapping_pg_card_top">
                <span className="ensai_home_mapping_pg_icon">
                  <PointIcon type={point.icon} />
                </span>
                <span className="ensai_home_mapping_pg_num">{point.id}</span>
              </div>

              <h3 className="ensai_home_mapping_pg_card_title">
                {point.title}
              </h3>

              <div className="ensai_home_mapping_pg_stat">
                <span className="ensai_home_mapping_pg_stat_value">
                  {point.stat.value}
                </span>
                <span className="ensai_home_mapping_pg_stat_label">
                  {point.stat.label}
                </span>
              </div>

              <p className="ensai_home_mapping_pg_label">The problem</p>
              <ul className="ensai_home_mapping_pg_list">
                {point.problems.map((text) => (
                  <li key={text} className="ensai_home_mapping_pg_list_item">
                    {text}
                  </li>
                ))}
              </ul>

              <div className="ensai_home_mapping_pg_angle">
                <p className="ensai_home_mapping_pg_angle_label">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  How enSaio helps
                </p>
                <p className="ensai_home_mapping_pg_angle_text">
                  {point.angle}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom line */}
        <div className="ensai_home_mapping_pg_bottom ensai_home_mapping_pg_reveal">
          <span className="ensai_home_mapping_pg_bottom_label">
            Bottom line
          </span>
          <p className="ensai_home_mapping_pg_bottom_text">
            The industry has no benchmark for “normal” failure or rework rates.{" "}
            <strong>
              enSaio's rehearsal-vs-actual data could become the first one.
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeMappingPoint;