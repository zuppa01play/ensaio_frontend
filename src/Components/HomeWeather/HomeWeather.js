import React from "react";
import "./HomeWeather.css";

const WEATHER_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1789630638/54b186e5-d3cd-4af1-a641-ae12c47444c3_rvl2xs.png";
const HUD_IMG =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1789631893/203608d9-9629-49cb-9824-e750d25a0813_m1pser.png";

const WEATHER_ITEMS = [
  "Rain",
  "Fog",
  "Dust",
  "Snow",
  "Falling leaves",
  "Wind direction — X / Y / Z",
];

const HUD_ITEMS = [
  "Ground speed (m/s)",
  "Altitude (m)",
  "Compass heading (°)",
  "Distance to home (m)",
  "Pitch & roll (°)",
  "Mission timer",
];

/* Snowflakes — ovvondrukkum vera size, speed, drift */
const FLAKES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: (i * 3.9 + (i % 5) * 1.7) % 100,
  size: 3 + ((i * 7) % 5),
  delay: ((i * 0.23) % 3).toFixed(2),
  duration: (3.4 + ((i * 11) % 9) * 0.22).toFixed(2),
  drift: ((i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 9)).toFixed(0),
  fade: (0.45 + (i % 6) * 0.09).toFixed(2),
}));

/* Sparks — center-la irundhu veliya theri padum */
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  angle: i * 20 + (i % 3) * 6,
  distance: 70 + ((i * 13) % 70),
  delay: ((i % 6) * 0.045).toFixed(3),
  size: 2 + (i % 3),
}));

const HomeWeather = () => {
  return (
    <section className="ensai_ho_wehud_pg_wrapper">
      <div className="ensai_ho_wehud_pg_grid" aria-hidden="true" />

      <div className="ensai_ho_wehud_pg_container">
        <div className="ensai_ho_wehud_pg_row">
          {/* ------------------- Weather card ------------------- */}
          <div className="ensai_ho_wehud_pg_col">
            <article
              className="ensai_ho_wehud_pg_card ensai_ho_wehud_pg_card_snow"
              tabIndex={0}
            >
              <span className="ensai_ho_wehud_pg_frame" aria-hidden="true" />

              <div className="ensai_ho_wehud_pg_media">
                <img
                  src={WEATHER_IMG}
                  alt="Simulated snowfield conditions"
                  loading="lazy"
                />
                <span className="ensai_ho_wehud_pg_scrim" aria-hidden="true" />

                <div className="ensai_ho_wehud_pg_snowfield" aria-hidden="true">
                  {FLAKES.map((f) => (
                    <span
                      key={f.id}
                      className="ensai_ho_wehud_pg_flake"
                      style={{
                        left: `${f.left}%`,
                        width: `${f.size}px`,
                        height: `${f.size}px`,
                        animationDelay: `${f.delay}s`,
                        animationDuration: `${f.duration}s`,
                        "--ensai-ho-wehud-pg-drift": `${f.drift}px`,
                        "--ensai-ho-wehud-pg-fade": f.fade,
                      }}
                    />
                  ))}
                </div>

              </div>

              <div className="ensai_ho_wehud_pg_body">
                <p className="ensai_ho_wehud_pg_kicker">in-sim weather control</p>
                <h3 className="ensai_ho_wehud_pg_title">
                  Dial in the conditions before you commit to the window
                </h3>

                <ul className="ensai_ho_wehud_pg_chips">
                  {WEATHER_ITEMS.map((item) => (
                    <li className="ensai_ho_wehud_pg_chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          {/* ------------------- HUD card ------------------- */}
          <div className="ensai_ho_wehud_pg_col">
            <article
              className="ensai_ho_wehud_pg_card ensai_ho_wehud_pg_card_spark"
              tabIndex={0}
            >
              <span className="ensai_ho_wehud_pg_frame" aria-hidden="true" />

              <div className="ensai_ho_wehud_pg_media">
                <img src={HUD_IMG} alt="Live flight HUD readout" loading="lazy" />
                <span className="ensai_ho_wehud_pg_scrim" aria-hidden="true" />

                <div className="ensai_ho_wehud_pg_sparkfield" aria-hidden="true">
                  <span className="ensai_ho_wehud_pg_flash" />
                  {SPARKS.map((s) => (
                    <span
                      key={s.id}
                      className="ensai_ho_wehud_pg_spark"
                      style={{
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDelay: `${s.delay}s`,
                        "--ensai-ho-wehud-pg-angle": `${s.angle}deg`,
                        "--ensai-ho-wehud-pg-distance": `${s.distance}px`,
                      }}
                    />
                  ))}
                </div>

              </div>

              <div className="ensai_ho_wehud_pg_body">
                <p className="ensai_ho_wehud_pg_kicker">live flight HUD</p>
                <h3 className="ensai_ho_wehud_pg_title">
                  Every readout a real flight would give you
                </h3>

                <ul className="ensai_ho_wehud_pg_chips">
                  {HUD_ITEMS.map((item) => (
                    <li className="ensai_ho_wehud_pg_chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWeather;