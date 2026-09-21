import React, { useRef, useEffect, useState, useCallback } from "react";
import "./HomeCount.css";

const HomeCount = () => {
  const stats = [
    { id: 1, value: 10, suffix: "", label: "Ajeet airframes" },
    { id: 2, value: 5, suffix: " km", label: "Max mission range" },
    { id: 3, value: 60, suffix: " min", label: "Max endurance" },
    { id: 4, value: 3, suffix: "", label: "Real-world scenario types" },
  ];

  const sectionRef = useRef(null);
  const numberRefs = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const runCountUp = useCallback(() => {
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      stats.forEach((stat, index) => {
        const el = numberRefs.current[index];
        if (!el) return;
        const current = Math.round(stat.value * eased);
        el.textContent = `${current}${stat.suffix}`;
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        stats.forEach((stat, index) => {
          const el = numberRefs.current[index];
          if (el) el.textContent = `${stat.value}${stat.suffix}`;
        });
      }
    };

    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            runCountUp();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasAnimated, runCountUp]);

  return (
    <section ref={sectionRef} className="ensai_count_pg_section">
      <div className="ensai_count_pg_bg">
        <div className="ensai_count_pg_glow ensai_count_pg_glow_left"></div>
        <div className="ensai_count_pg_glow ensai_count_pg_glow_right"></div>
        <div className="ensai_count_pg_grid_overlay"></div>
        <div className="ensai_count_pg_scanline"></div>
        <div className="ensai_count_pg_vignette"></div>
      </div>

      <div className="ensai_count_pg_grid">
        {stats.map((stat, index) => (
          <div key={stat.id} className="ensai_count_pg_item">
            <span
              ref={(el) => (numberRefs.current[index] = el)}
              className="ensai_count_pg_value"
            >
              0{stat.suffix}
            </span>
            <span className="ensai_count_pg_label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeCount;