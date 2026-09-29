import React from "react";
import "./HomeTextPage.css";

const DRONES = [
  "WingtraRAY",
  "Skydio X10",
  "Freefly Alta X",
  "Inspired Flight IF1200A",
  "Parrot ANAFI USA",
];

const STATS = [
  {
    value: "45%",
    text: "of the global drone GIS mapping market is North America — the largest launch opportunity by far",
  },
  {
    value: "2029",
    text: "firmware waiver runs for existing DJI units — new hardware adoption is only accelerating",
  },
  {
    value: "0",
    text: "category leaders that rehearse a mission before flight — the gap enSaio owns",
  },
];

const STEPS = [
  {
    id: "01",
    title: "Load the mission",
    text: "Import the flight plan from your planning tool, on any drone — including the platforms your fleet just switched to.",
  },
  {
    id: "02",
    title: "Rehearse against reality",
    text: "enSaio runs the mission against real terrain, weather and payload for that exact site — not a generic simulation.",
  },
  {
    id: "03",
    title: "Fly with certainty",
    text: "Get a go/no-go report your fleet manager can sign off on — before the crew ever drives to site.",
  },
];

const HomeTextPage = () => {
  return (
    <div className="ensai_home_text_pg_page">
      {/* ================= HERO ================= */}
      <section className="ensai_home_text_pg_hero">
        <div className="ensai_home_text_pg_bg_grid" />
        <div className="ensai_home_text_pg_bg_orb ensai_home_text_pg_bg_orb_one" />
        <div className="ensai_home_text_pg_bg_orb ensai_home_text_pg_bg_orb_two" />

        <div className="ensai_home_text_pg_container">
          <span className="ensai_home_text_pg_eyebrow">
            <span className="ensai_home_text_pg_eyebrow_dot" />
            Digital Rehearsal for GIS Mapping
          </span>

          <h1 className="ensai_home_text_pg_h1">
            Prove the mission before you fly it.
          </h1>

          <div className="ensai_home_text_pg_hero_btns">
            <button type="button" className="ensai_home_text_pg_btn_primary">
              Request a Demo
            </button>
            <button 
              type="button"
              className="ensai_home_text_pg_btn_secondary"
            >
              <span>See it in action</span>
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </button>
          </div>

          <div className="ensai_home_text_pg_compat">
            <p className="ensai_home_text_pg_compat_label">
              Rehearsal profiles ready for
            </p>
            <div className="ensai_home_text_pg_compat_track">
              {DRONES.map((drone) => (
                <span key={drone} className="ensai_home_text_pg_compat_chip">
                  {drone}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY NOW ================= */}
      <section className="ensai_home_text_pg_why">
        <div className="ensai_home_text_pg_container">
          <div className="ensai_home_text_pg_section_head">
            <span className="ensai_home_text_pg_kicker">Why Now</span>
            <h2 className="ensai_home_text_pg_h2">
              Your fleet is flying unfamiliar hardware.
            </h2>
            <p className="ensai_home_text_pg_lead">
              The US FCC Covered List has pushed operators off DJI and onto
              platforms they have little flight history with. Every new
              drone is a new unknown — and a mapping mission still has to
              work on the first attempt.
            </p>
          </div>

          <div className="ensai_home_text_pg_stats">
            {STATS.map((stat) => (
              <div key={stat.value} className="ensai_home_text_pg_stat_card">
                <h3 className="ensai_home_text_pg_stat_value">
                  {stat.value}
                </h3>
                <p className="ensai_home_text_pg_stat_text">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="ensai_home_text_pg_how">
        <div className="ensai_home_text_pg_container">
          <div className="ensai_home_text_pg_section_head">
            <span className="ensai_home_text_pg_kicker">How It Works</span>
            <h2 className="ensai_home_text_pg_h2">
              Three steps between your flight plan and a go/no-go call.
            </h2>
          </div>

          <div className="ensai_home_text_pg_steps">
            {STEPS.map((step, index) => (
              <div key={step.id} className="ensai_home_text_pg_step_card">
                <span className="ensai_home_text_pg_step_num">
                  {step.id}
                </span>
                <h3 className="ensai_home_text_pg_step_title">
                  {step.title}
                </h3>
                <p className="ensai_home_text_pg_step_text">{step.text}</p>
                {index < STEPS.length - 1 && (
                  <span
                    className="ensai_home_text_pg_step_arrow"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeTextPage;