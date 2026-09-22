import React, { useState, useRef, useEffect } from "react";
import "./HomePage.css";
import HomeVideo from "./hero.mp4";

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const [ripples, setRipples] = useState({ primary: [], secondary: [] });
  const rippleId = useRef(0);

  const [telemetry, setTelemetry] = useState({
    spd: 1.91,
    alt: 1.97,
    hdg: 306,
    bat: 93,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Simulate live telemetry — SPD, ALT, HDG jitter up/down; BAT slowly drains
  useEffect(() => {
    const randomStep = (value, min, max, delta) => {
      const next = value + (Math.random() * 2 - 1) * delta;
      return Math.min(max, Math.max(min, next));
    };

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const nextHdg = prev.hdg + (Math.random() * 2 - 1) * 4;
        const wrappedHdg = ((nextHdg % 360) + 360) % 360;

        return {
          spd: randomStep(prev.spd, 0.4, 4.5, 0.3),
          alt: randomStep(prev.alt, 0.5, 6, 0.25),
          hdg: wrappedHdg,
          bat: Math.max(0, prev.bat - Math.random() * 0.15),
        };
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const handleRipple = (btnKey) => (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = rippleId.current++;

    setRipples((prev) => ({
      ...prev,
      [btnKey]: [...prev[btnKey], { id, x, y, size }],
    }));

    setTimeout(() => {
      setRipples((prev) => ({
        ...prev,
        [btnKey]: prev[btnKey].filter((r) => r.id !== id),
      }));
    }, 700);
  };

  return (
    <main className="ensai_home_pg_page">
      <section className="ensai_home_pg_hero">
        {/* Background Video */}
        <div className="ensai_home_pg_hero_video_wrap">
          <video
            className="ensai_home_pg_hero_video"
            src={HomeVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="ensai_home_pg_hero_overlay"></div>
        </div>

      
    
        <div
          className={`ensai_home_pg_telemetry_card ensai_home_pg_anim_item ${
            visible ? "ensai_home_pg_hero_content_visible" : ""
          }`}
        >
         
          <div className="ensai_home_pg_telemetry_header">
            <span className="ensai_home_pg_telemetry_dot"></span>
            LIVE TELEMETRY
          </div>
          <div className="ensai_home_pg_telemetry_grid">
            <div className="ensai_home_pg_telemetry_item">
              <span className="ensai_home_pg_telemetry_label">SPD</span>
              <span className="ensai_home_pg_telemetry_value">
                {telemetry.spd.toFixed(2)} m/s
              </span>
            </div>
            <div className="ensai_home_pg_telemetry_item">
              <span className="ensai_home_pg_telemetry_label">ALT</span>
              <span className="ensai_home_pg_telemetry_value">
                {telemetry.alt.toFixed(2)} m
              </span>
            </div>
            <div className="ensai_home_pg_telemetry_item">
              <span className="ensai_home_pg_telemetry_label">HDG</span>
              <span className="ensai_home_pg_telemetry_value">
                {Math.round(telemetry.hdg)}°
              </span>
            </div>
            <div className="ensai_home_pg_telemetry_item">
              <span className="ensai_home_pg_telemetry_label">BAT</span>
              <span className="ensai_home_pg_telemetry_value">
                {Math.round(telemetry.bat)}%
              </span>
            </div>
          </div>
        </div>

        <div
          className={`ensai_home_pg_hero_content ${
            visible ? "ensai_home_pg_hero_content_visible" : ""
          }`}
        >
          <h1 className="ensai_home_pg_hero_title ensai_home_pg_anim_item">
        Rehearse the mission, 
            <br />
            <span className="ensai_home_pg_hero_title_accent">
         before you fly it.
            </span>
          </h1>

          <p className="ensai_home_pg_hero_description ensai_home_pg_anim_item">
        enSaio enables professional drone operators to practice real missions before reaching the actual site. Simply enter the GPS location, simulate the environment and mission conditions, and validate the flight with realistic telemetry — before the real drone takes off.
          </p>

          <div className="ensai_home_pg_hero_actions ensai_home_pg_anim_item">
            <button
              className="ensai_home_pg_primary_btn"
              onClick={handleRipple("primary")}
            >
              <svg
                className="ensai_home_pg_btn_icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="ensai_home_pg_btn_label">Request a Demo</span>
              {ripples.primary.map((r) => (
                <span
                  key={r.id}
                  className="ensai_home_pg_ripple"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: r.size,
                    height: r.size,
                  }}
                />
              ))}
            </button>

            <button
              className="ensai_home_pg_secondary_btn"
              onClick={handleRipple("secondary")}
            >
              <svg
                className="ensai_home_pg_btn_icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon
                  points="10,8 16,12 10,16"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              <span className="ensai_home_pg_btn_label">See it in action</span>
              {ripples.secondary.map((r) => (
                <span
                  key={r.id}
                  className="ensai_home_pg_ripple"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: r.size,
                    height: r.size,
                  }}
                />
              ))}
            </button>
          </div>

          <ul className="ensai_home_pg_hero_stats ensai_home_pg_anim_item">
            <li className="ensai_home_pg_stat_item">
              <span className="ensai_home_pg_stat_dot"></span>
              10 Ajeet airframes
            </li>
            <li className="ensai_home_pg_stat_item">
              <span className="ensai_home_pg_stat_dot"></span>
              Real-world terrain
            </li>
            <li className="ensai_home_pg_stat_item">
              <span className="ensai_home_pg_stat_dot"></span>
              Live flight telemetry
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default HomePage;