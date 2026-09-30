import React from "react";
import "./HomeMission.css";

const CARDS_DATA = [
  {
    tag: "Waypoint 01",
    badge: "Real-World Scenarios",
    desc: "Environments built to rehearse the real mission.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630359/b4b884d4-94e6-4df1-85d7-f09ab1fc7361_v0xluu.png",
  },
  {
    tag: "Waypoint 02",
    badge: "Dynamic Environments",
    desc: "Snowfields, coastlines, and low-visibility terrain to rehearse the conditions your mission will actually face.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630638/54b186e5-d3cd-4af1-a641-ae12c47444c3_rvl2xs.png",
  },
  {
    tag: "Waypoint 03",
    badge: "Precision FPV Courses",
    desc: "Tight structures and targeting reticles for FPV racing and precision-approach practice.",
    img: "https://res.cloudinary.com/dk50cmtps/image/upload/v1789631893/203608d9-9629-49cb-9824-e750d25a0813_m1pser.png",
  },
];

const HomeMission = () => {
  return (
    <section className="ensai_mission_section">
      <div className="ensai_mission_container">
        <header className="ensai_mission_head">
          <span className="ensai_mission_kicker">Mission Rehearsal</span>
          <h2 className="ensai_mission_title">
            Every environment your mission will face — flown before you fly it.
          </h2>
        </header>

        <div className="ensai_mission_list">
          {CARDS_DATA.map((card, index) => (
            <article
              key={card.badge}
              className={
                "ensai_mission_row" +
                (index % 2 !== 0 ? " ensai_mission_row_reverse" : "")
              }
              style={{ "--i": index }}
            >
              <div className="ensai_mission_media">
                <img
                  src={card.img}
                  alt={card.badge}
                  width={880}
                  height={605}
                  loading="lazy"
                />
              </div>

              <div className="ensai_mission_body">
                <span className="ensai_mission_tag">{card.tag}</span>
                <h3 className="ensai_mission_name">{card.badge}</h3>
                <p className="ensai_mission_desc">{card.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeMission;