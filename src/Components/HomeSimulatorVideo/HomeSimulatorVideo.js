import React from 'react';
import { Fade } from 'react-awesome-reveal';
import './HomeSimulatorVideo.css';

const HomeSimulatorVideo = () => {
  return (
    <section className="ensai_simu_home_vid_pg_section">
  

      <div className="ensai_simu_home_vid_pg_wave_wrap">
        <svg
          className="ensai_simu_home_vid_pg_wave_svg"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="ensai_simu_home_vid_pg_wave_path"
            d="M0,400 C240,300 480,500 720,400 C960,300 1200,500 1440,400"
          />
          <path
            className="ensai_simu_home_vid_pg_wave_path ensai_simu_home_vid_pg_wave_path_2"
            d="M0,500 C240,400 480,600 720,500 C960,400 1200,600 1440,500"
          />
        </svg>
      </div>

      <div className="ensai_simu_home_vid_pg_container">
        <p className="ensai_simu_home_vid_pg_eyebrow">the ajeet fleet</p>
        <h2 className="ensai_simu_home_vid_pg_title">Ten airframes, one simulator</h2>
        <p className="ensai_simu_home_vid_pg_subtitle">
          Specs shown are pulled straight from the in-sim aircraft cards.
        </p>

        <div className="ensai_simu_home_vid_pg_cards_row">
          <Fade
            direction="left"
            triggerOnce
            duration={900}
            className="ensai_simu_home_vid_pg_fade_wrap"
          >
            <div className="ensai_simu_home_vid_pg_card">
              <video
                className="ensai_simu_home_vid_pg_video"
                src="https://res.cloudinary.com/dk50cmtps/video/upload/v1780468333/drone_1_pj9rm0.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
              />
              <div className="ensai_simu_home_vid_pg_card_overlay" />
            </div>
          </Fade>

          <Fade
            direction="right"
            triggerOnce
            duration={900}
            className="ensai_simu_home_vid_pg_fade_wrap"
          >
            <div className="ensai_simu_home_vid_pg_card">
              <video
                className="ensai_simu_home_vid_pg_video"
                src="https://res.cloudinary.com/dk50cmtps/video/upload/v1780468333/drone_2_qgmxwk.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
              />
              <div className="ensai_simu_home_vid_pg_card_overlay" />
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default HomeSimulatorVideo;