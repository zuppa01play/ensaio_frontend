import React, { Fragment, useEffect, useRef } from "react";
import "./AboutPage.css";

// Replace with your own About-page hero image any time
const HERO_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1790750756/ChatGPT_Image_Sep_30_2026_12_15_21_PM_g1de50.png";

const MISSION_ITEMS = [
  "Survey boundaries",
  "Flight lines",
  "Image overlap",
  "Altitude",
  "Payload and sensor configuration",
  "Terrain and elevation",
  "Weather conditions",
  "Airspace constraints",
 
];

const CHALLENGE_FACTORS = [
  "Terrain",
  "Overlap",
  "Weather",
  "Payload",
  "Airspace",
  "Mobilization constraints",
];

const CHALLENGE_IMPACTS = [
  "Re-planning",
  "Re-flight requirements",
  "Schedule disruption",
  "Additional crew utilization",
  "Avoidable cost",
];

const APPROACH_FLOW = ["PLAN", "DIGITAL REHEARSAL", "DECIDE", "FLY"];

const VALIDATION_ITEMS = [
  "Planned flight path",
  "Image capture",
  "Image overlap",
  "Terrain variation",
  "Expected data outcome",
];

const RISK_AREAS = ["Terrain", "Image overlap", "Weather", "Airspace", "Payload"];

const RISK_FINDINGS = [
  "The location or mission element involved",
  "The operational impact",
  "The severity",
  "The recommended action",
];

const GO_AREAS = [
  "Terrain",
  "Flight path",
  "Image overlap",
  "Payload",
  "Operational conditions",
  "Airspace",
];

const DECISIONS = [
  {
    tag: "GO",
    text: "Proceed with the mission.",
    tone: "go",
  },
  {
    tag: "REVISE & REHEARSE AGAIN",
    text: "Modify the plan, repeat the rehearsal, and reassess before mobilization.",
    tone: "revise",
  },
];

const FLOW_WITHOUT = [
  "PLAN",
  "MOBILIZE",
  "FLY",
  "PROCESS",
  "DISCOVER PROBLEM",
  "RE-FLY",
];

const FLOW_WITH = [
  "PLAN",
  "REHEARSE",
  "IDENTIFY",
  "MODIFY",
  "REHEARSE AGAIN",

  "FLY",
];

const COMPARISON = [
  {
    stage: "Planning",
    without: "Mission plan prepared",
    with: "Mission plan prepared",
  },
  {
    stage: "Validation",
    without: "Limited pre-field validation",
    with: "Exact mission rehearsed against relevant conditions",
  },
  {
    stage: "Risk discovery",
    without: "May occur during/after execution",
    with: "Moved before mobilization",
  },
  {
    stage: "Decision",
    without: "Field execution proceeds",
    with: "GO or REVISE & REHEARSE AGAIN",
  },
  {
    stage: "Execution",
    without: "Fly and process",
    with: "Mobilize after rehearsal readiness",
  },
  {
    stage: "Outcome protection",
    without: "Re-flight risk discovered later",
    with: "Earlier identification of mission conflicts",
  },
];

const IMPACTS = [
  "Improved first-pass data quality",
  "Avoided re-flights",
  "Better crew utilization",
  "More efficient mobilization",
  "Schedule protection",
  "Reduced operational risk",
  "Defensible go/no-go decisions",
  "Consistent mission procedures",
];

const RECORD_FLOW = [
  "Mission Requirements",
  "Flight Plan",
  "Digital Rehearsal",
  "Risk Findings",
  "Go/No-Go",
  "As-Flown Mission",
  "QA/QC",
  "Final Deliverable",
];

const TAKE_BEFORE = [
  "Risks may be discovered during or after field execution.",
  "Re-flight and schedule impacts can emerge late.",
  "Mission readiness may depend on fragmented checks.",
];

const TAKE_WITH = [
  "The exact mission is rehearsed before mobilization.",
  "Risks can be identified earlier.",
  "The plan can be modified and rehearsed again.",
  "The go/no-go decision becomes more structured and defensible.",
  "The rehearsal becomes part of the mission record.",
];

const PRINCIPLE_FLOW = [
  "PLAN",
  "REHEARSE",
  "ANALYZE",
  "DECIDE",
  "FLY",
  "DELIVER",
];

// CTA labels are not in the DOCX - change here if MD sir gives final text
const CTA_PRIMARY = "Schedule an Enterprise Technical Briefing";
const CTA_SECONDARY = "Rehearse Your Mission";

/* ================= SMALL REUSABLE PIECES ================= */

// Step flow: vertical on mobile, horizontal on tablet / desktop
const Flow = ({ steps, variant = "neutral", highlight = [] }) => (
  <div
    className={`ensai_about_pg_flow ensai_about_pg_flow_${variant}`}
    role="list"
  >
    {steps.map((s, i) => (
      <Fragment key={`${s}-${i}`}>
        <span
          role="listitem"
          className={`ensai_about_pg_flow_step${
            highlight.includes(s) ? " ensai_about_pg_flow_step_hl" : ""
          }`}
        >
          {s}
        </span>
        {i < steps.length - 1 && (
          <span className="ensai_about_pg_flow_arrow" aria-hidden="true" />
        )}
      </Fragment>
    ))}
  </div>
);

const SectionHead = ({  title, lead }) => (
  <div className="ensai_about_pg_head ensai_about_pg_reveal">

    <h2 className="ensai_about_pg_h2">{title}</h2>
    {lead && <p className="ensai_about_pg_head_lead">{lead}</p>}
  </div>
);

/* ================= PAGE ================= */

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
      { threshold: 0.08 }
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
             FROM GEOSPATIAL UNCERTAINTY
              <span className="ensai_about_pg_h1_accent"> Into Certainty.</span>
            </h1>
            <p className="ensai_about_pg_hero_sub ensai_about_pg_reveal">
              From Flight Planning to Mission Certainty
            </p>
            <p className="ensai_about_pg_hero_note ensai_about_pg_reveal">
              How Digital Rehearsal Helps De-Risk a High-Consequence
              Infrastructure Mapping Mission
            </p>
          </div>
        </div>
      </section>


      {/* ================= 01 EXECUTIVE OVERVIEW ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_split">
            <div className="ensai_about_pg_reveal">
           
              <h2 className="ensai_about_pg_h2">Executive Overview</h2>

              <blockquote className="ensai_about_pg_quote">
                The key operational question is therefore not only whether the
                aircraft can fly the planned route, but whether the planned
                mission is executable under the actual conditions and capable
                of producing the required data outcome.
              </blockquote>
            </div>

            <div className="ensai_about_pg_copy ensai_about_pg_reveal">
              <p>
                A high-consequence infrastructure mapping mission must account
                for terrain, flight geometry, image overlap, payload, weather,
                airspace, and operational conditions before the crew is
                mobilized.
              </p>
              <p>
                The objective is simple: capture reliable, deliverable-grade
                geospatial data on the first mission attempt.
              </p>
              <p>
                enSaio introduces a Digital Rehearsal checkpoint between mission
                planning and field execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 02 THE MISSION ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
        
            title="The Mission"
            lead="The mission is a UAV mapping operation over a high-consequence infrastructure corridor, with outputs intended for GIS and engineering workflows."
          />

          <p className="ensai_about_pg_lead ensai_about_pg_reveal">
            The mission must account for:
          </p>

          <div className="ensai_about_pg_chips">
            {MISSION_ITEMS.map((m, i) => (
              <div
                key={m}
                className="ensai_about_pg_chip ensai_about_pg_reveal"
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              >
                {m}
              </div>
            ))}
          </div>
<br/>
          <blockquote className="ensai_about_pg_quote ensai_about_pg_quote_wide ensai_about_pg_reveal">
            <span className="ensai_about_pg_quote_label">
              The central question is:
            </span>
            Will the planned flight produce usable data under the actual
            mission conditions?
          </blockquote>
        </div>
      </section>

      {/* ================= 03 OPERATIONAL CHALLENGE ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <SectionHead  title="The Operational Challenge" />

          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">Traditional planning</span>
              <p className="ensai_about_pg_card_text">
                Traditional planning can validate flight geometry without fully
                exposing how terrain, overlap, weather, payload, airspace, and
                mobilization constraints interact.
              </p>
              <ul className="ensai_about_pg_pills">
                {CHALLENGE_FACTORS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge">After mobilization</span>
              <p className="ensai_about_pg_card_text">
                For a high-consequence corridor mission, discovering a problem
                after mobilization can lead to:
              </p>
              <ul className="ensai_about_pg_list ensai_about_pg_list_bad">
                {CHALLENGE_IMPACTS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ensai_about_pg_banner ensai_about_pg_reveal">
            <p className="ensai_about_pg_banner_text">
              The operational need is to identify mission risks before field
              execution.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 04 THE ENSAIO APPROACH ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
      
            title="The enSaio Approach"
            lead="enSaio inserts a Digital Rehearsal checkpoint into the existing mission workflow:"
          />

          <div className="ensai_about_pg_panel ensai_about_pg_reveal">
            <Flow
              steps={APPROACH_FLOW}
              variant="good"
              highlight={["DIGITAL REHEARSAL"]}
            />
            <p className="ensai_about_pg_panel_text">
              The rehearsal uses mission requirements, flight planning,
              terrain, overlap, payload, weather, airspace, and readiness
              conditions to evaluate whether the mission is ready for
              execution.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 05 + 06 REHEARSAL & VALIDATION ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge"> Digital Rehearsal</span>
              <p className="ensai_about_pg_card_text">
                The exact mission is loaded into the rehearsal environment.
              </p>
              <p className="ensai_about_pg_card_text">
                The team establishes the survey area, flight lines, altitude,
                GSD, image overlap, payload, and operational constraints. The
                planned mission is then represented against the relevant
                terrain and conditions.
              </p>
              <blockquote className="ensai_about_pg_quote ensai_about_pg_quote_flat">
                The purpose is not simply to simulate drone flight. The purpose
                is to determine whether the mission can produce the intended
                project result.
              </blockquote>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge">
                 Photogrammetric Mission Validation
              </span>
              <p className="ensai_about_pg_card_text">
                For mapping missions, flight execution and data quality are
                closely connected. The Digital Rehearsal evaluates the
                relationship between:
              </p>
              <ul className="ensai_about_pg_list">
                {VALIDATION_ITEMS.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <p className="ensai_about_pg_card_text">
                This creates a pre-flight validation step focused on the
                quality and usability of the resulting geospatial data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 07 RISK IDENTIFICATION ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
      
            title="Risk Identification"
            lead="Potential mission conflicts and risks are reviewed before mobilization."
          />

          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">Typical risk areas include:</span>
              <ul className="ensai_about_pg_pills">
                {RISK_AREAS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge">Findings should identify:</span>
              <ul className="ensai_about_pg_list">
                {RISK_FINDINGS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 08 GO / NO-GO ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <SectionHead
   
            title="Go / No-Go Decision"
            lead="The rehearsal supports a structured mission readiness decision."
          />

          <div className="ensai_about_pg_card ensai_about_pg_card_wide ensai_about_pg_reveal">
            <span className="ensai_about_pg_badge">Review areas include:</span>
            <ul className="ensai_about_pg_pills">
              {GO_AREAS.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p className="ensai_about_pg_card_text">
              The mission team can then make a documented decision:
            </p>
          </div>

          <div className="ensai_about_pg_two_grid ensai_about_pg_decisions">
            {DECISIONS.map((d, i) => (
              <div
                key={d.tag}
                className={`ensai_about_pg_decision ensai_about_pg_decision_${d.tone} ensai_about_pg_reveal`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="ensai_about_pg_decision_tag">{d.tag}</span>
                <p className="ensai_about_pg_card_text">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 09 OPERATIONAL CHANGE ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
          
            title="Operational Change"
              lead="The fundamental difference is the discovery point: mission
            problems are addressed before field resources are committed."
          />

          <div className="ensai_about_pg_stack">
            <div className="ensai_about_pg_panel ensai_about_pg_panel_bad ensai_about_pg_reveal">
              <span className="ensai_about_pg_panel_label">
                Without Digital Rehearsal:
              </span>
              <Flow
                steps={FLOW_WITHOUT}
                variant="bad"
                highlight={["DISCOVER PROBLEM", "RE-FLY"]}
              />
            </div>

            <div className="ensai_about_pg_panel ensai_about_pg_panel_good ensai_about_pg_reveal">
              <span className="ensai_about_pg_panel_label">
                With Digital Rehearsal:
              </span>
              <Flow
                steps={FLOW_WITH}
                variant="good"
                highlight={["REHEARSE", "REHEARSE AGAIN"]}
              />
            </div>
          </div>

        
        </div>
      </section>

      {/* ================= OPERATIONAL COMPARISON ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <SectionHead
            title="Operational Comparison"
          />

          <div className="ensai_about_pg_table_wrap ensai_about_pg_reveal">
            <table className="ensai_about_pg_table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Without Digital Rehearsal</th>
                  <th scope="col">With enSaio</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.stage}>
                    <td
                      className="ensai_about_pg_td_stage"
                      data-label="Stage"
                    >
                      {r.stage}
                    </td>
                    <td data-label="Without Digital Rehearsal">{r.without}</td>
                    <td
                      className="ensai_about_pg_td_with"
                      data-label="With enSaio"
                    >
                      {r.with}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= 10 BUSINESS IMPACT ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
      
            title="Business Impact"
            lead="The operational value of Digital Rehearsal is measured through risk and resource avoidance."
          />

        

          <div className="ensai_about_pg_impacts">
            {IMPACTS.map((t, i) => (
              <div
                key={t}
                className="ensai_about_pg_impact ensai_about_pg_reveal"
                style={{ transitionDelay: `${(i % 4) * 60}ms` }}
              >
                <span className="ensai_about_pg_idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="ensai_about_pg_h4">{t}</h3>
              </div>
            ))}
          </div>

        
        </div>
      </section>

      {/* ================= 11 MISSION RECORD -> AUDIT RECORD ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <SectionHead
         
            title="From Mission Record to Audit Record"
            lead="A structured mission process can connect planning and execution into a traceable record:"
          />

          <div className="ensai_about_pg_panel ensai_about_pg_reveal">
            <Flow
              steps={RECORD_FLOW}
              variant="good"
              highlight={["Digital Rehearsal", "Go/No-Go"]}
            />
            <p className="ensai_about_pg_panel_text">
              The rehearsal record can support documented due diligence and
              provide evidence for defensible operational decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 12 WHY IT MATTERS ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
    
            title="Why It Matters"
            lead="Technical executability does not automatically equal a successful project outcome."
          />

          <div className="ensai_about_pg_shift">
            <div className="ensai_about_pg_card ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">The question shifts from:</span>
              <p className="ensai_about_pg_card_text ensai_about_pg_card_text_big">
                &ldquo;Can the drone fly this mission?&rdquo;
              </p>
            </div>

            <span className="ensai_about_pg_shift_arrow" aria-hidden="true" />

            <div className="ensai_about_pg_card ensai_about_pg_card_accent ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge">to:</span>
              <p className="ensai_about_pg_card_text ensai_about_pg_card_text_big">
                &ldquo;Can this mission deliver what the project
                requires?&rdquo;
              </p>
            </div>
          </div>

       
        </div>
      </section>

      {/* ================= 13 KEY TAKEAWAYS ================= */}
      <section className="ensai_about_pg_section">
        <div className="ensai_about_pg_container">
          <SectionHead  title="Key Takeaways" />

          <div className="ensai_about_pg_two_grid">
            <div className="ensai_about_pg_card ensai_about_pg_card_bad ensai_about_pg_reveal">
              <span className="ensai_about_pg_badge ensai_about_pg_badge_bad">
                Before Digital Rehearsal:
              </span>
              <ul className="ensai_about_pg_list ensai_about_pg_list_bad">
                {TAKE_BEFORE.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div
              className="ensai_about_pg_card ensai_about_pg_card_good ensai_about_pg_reveal"
              style={{ transitionDelay: "90ms" }}
            >
              <span className="ensai_about_pg_badge ensai_about_pg_badge_good">
                With enSaio:
              </span>
              <ul className="ensai_about_pg_list ensai_about_pg_list_good">
                {TAKE_WITH.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 14 THE ENSAIO PRINCIPLE ================= */}
      <section className="ensai_about_pg_section ensai_about_pg_section_alt">
        <div className="ensai_about_pg_container">
          <SectionHead
        
            title="The enSaio Principle"
            lead="Don’t wait for the field to tell you whether the mission works."
          />

          <p className="ensai_about_pg_big ensai_about_pg_reveal">
            Rehearse it first.
          </p>

          <div className="ensai_about_pg_panel ensai_about_pg_reveal">
            <Flow
              steps={PRINCIPLE_FLOW}
              variant="good"
              highlight={["REHEARSE"]}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;