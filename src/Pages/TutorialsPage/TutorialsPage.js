import React, { useEffect } from "react";
import "./TutorialsPage.css";
import underconstruction from "./underconstruction.png";

/* REPLACE THIS with your Cloudinary drone image URL */
const droneImage = underconstruction;

/* Where the "Back to Home" button should go */
const homeLink = "/ensaio_frontend";

const TutorialsPage = () => {

      useEffect(() => {
        document.querySelector("#root")?.scrollIntoView({ behavior: "smooth" });
      }, []);
  return (
    <section
      className="ensai_tutorial_pg_section"
      aria-labelledby="ensai_tutorial_pg_heading"
    >
      <div className="ensai_tutorial_pg_backdrop" aria-hidden="true">
        <div className="ensai_tutorial_pg_grid" />
      </div>

      <div className="ensai_tutorial_pg_inner">
        <div className="ensai_tutorial_pg_content">
          <span className="ensai_tutorial_pg_status">
            <span className="ensai_tutorial_pg_status_dot" aria-hidden="true" />
            Under construction
          </span>

          <h1 id="ensai_tutorial_pg_heading" className="ensai_tutorial_pg_title">
            Tutorials page is under construction
          </h1>

          <p className="ensai_tutorial_pg_description">
            We are preparing step-by-step tutorials for you. Please check back
            soon, or head back to the home page in the meantime.
          </p>

          <a
            href={homeLink}
            className="ensai_tutorial_pg_home_btn"
            aria-label="Go back to the home page"
          >
            Back to Home
          </a>
        </div>

        <div className="ensai_tutorial_pg_visual">
          <div className="ensai_tutorial_pg_glow" aria-hidden="true" />
          <div className="ensai_tutorial_pg_drone_wrap">
            <img
              src={droneImage}
              alt="Zuppa surveillance drone hovering"
              className="ensai_tutorial_pg_drone"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialsPage;