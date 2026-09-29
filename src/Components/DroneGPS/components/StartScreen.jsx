import { Play, Radar, MapPin, Mountain, Volume2, VolumeX, Keyboard } from "lucide-react";
import { CONFIG, DURATION } from "../engine/timeline";

function DataChip({ icon, label, value, delay }) {
  return (
    <div className="chip anim-fade-up" style={{ animationDelay: delay }}>
      <span className="chip__icon">{icon}</span>
      <span className="chip__body">
        <span className="chip__label">{label}</span>
        <span className="chip__value">{value}</span>
      </span>
    </div>
  );
}

export default function StartScreen({ onStart, muted, onToggleMute }) {
  return (
    <div className="start">
      {/* photographic hero: the real drone over the landing site */}
      <img
        src="https://res.cloudinary.com/dk50cmtps/image/upload/v1790675716/hero-drone_w3cemy.jpg"
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="start__bg"
      />
      <div className="start__scrim" />
      <div className="start__warm" />

      <div className="start__inner">
        {/* top bar */}
        <header className="start__bar anim-fade-up">
          <div className="start__brand">DM-21 // AUTONOMOUS NAV SYSTEMS</div>
          <div className="start__tools">
            <span className="start__ready">
              <span className="dot-wrap">
                <span className="dot--ping anim-ping-soft" />
                <span className="dot" />
              </span>
              <span className="start__ready-label">SYS READY</span>
            </span>
            <button onClick={onToggleMute} title="Toggle sound (M)" className="icon-btn">
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </header>

        {/* center */}
        <main className="start__main">
          <div className="pill anim-fade-up" style={{ animationDelay: "0.05s" }}>
            <Radar size={14} className="pill__icon anim-spin-slow" />
            <span className="pill__text">AUTONOMOUS DRONE NAVIGATION</span>
          </div>

          <h1 className="title anim-fade-up" style={{ animationDelay: "0.12s" }}>
            DRONE <span className="title__accent text-glow-cyan">MISSION</span>
          </h1>

          <p className="place anim-fade-up" style={{ animationDelay: "0.16s" }}>
            CHETPET LAKE ECO-PARK · CHENNAI, IN
          </p>

          <p className="sub anim-fade-up" style={{ animationDelay: "0.2s" }}>
            REALTIME RENDER · 16:9 · {Math.round(DURATION)}S SEQUENCE
          </p>

          <div className="chips">
            <DataChip icon={<MapPin size={18} />} label="LATITUDE" value={CONFIG.LAT} delay="0.28s" />
            <DataChip
              icon={<MapPin size={18} className="rotate-90" />}
              label="LONGITUDE"
              value={CONFIG.LON}
              delay="0.34s"
            />
            <DataChip
              icon={<Mountain size={18} />}
              label="ALTITUDE"
              value={`${CONFIG.ALT} M`}
              delay="0.4s"
            />
          </div>

          <button onClick={onStart} className="cta anim-fade-up" style={{ animationDelay: "0.48s" }}>
            <Play size={18} className="cta__icon" />
            START MISSION
          </button>

          <div className="keys anim-fade-up" style={{ animationDelay: "0.56s" }}>
            <Keyboard size={13} />
            <span>SPACE — PLAY · R — RESTART · M — SOUND</span>
          </div>
        </main>

        {/* bottom strip */}
        <footer className="start__foot anim-fade-up" style={{ animationDelay: "0.64s" }}>
          <span>MISSION: LANDFALL</span>
          <span className="foot-mid">13.0827°N · 80.2707°E</span>
          <span>GOLDEN HOUR · 18:42 IST</span>
        </footer>
      </div>
    </div>
  );
}
