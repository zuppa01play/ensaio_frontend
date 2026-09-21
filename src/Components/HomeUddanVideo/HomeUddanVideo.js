import React, { useEffect, useRef } from "react";
import "./HomeUddanVideo.css";

const BG_IMAGE =
  "https://res.cloudinary.com/dk50cmtps/image/upload/v1788763061/ChatGPT_Image_Sep_7_2026_12_07_31_PM_s63mxp.png";
const VIDEO_SRC =
  "https://res.cloudinary.com/dk50cmtps/video/upload/v1780468333/drone_2_qgmxwk.mp4";

// How "slow motion" the drone footage should feel once it takes over.
const VIDEO_PLAYBACK_RATE = 0.55;
// How strongly visuals lag behind the actual scroll position.
// Lower = heavier / more cinematic drift, higher = snappier.
const SMOOTHING = 0.065;

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// progress p mapped between a..b, eased for a cinematic ease-in/ease-out curve
const range = (p, a, b) => easeInOutCubic(clamp((p - a) / (b - a)));

// Fixed seed so particle layout is stable across re-renders (no reshuffle on resize etc.)
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const makeGlitterParticles = (count) => {
  const rand = seededRandom(1337);
  return Array.from({ length: count }, (_, i) => {
    const size = 30 + rand() * 9; // 3 - 12px
    return {
      id: i,
      size,
      top: rand() * 100,
      left: rand() * 100,
      dx: (rand() - 0.5) * 60, // drift px
      dy: (rand() - 0.5) * 60,
      floatDur: 6 + rand() * 8,
      floatDelay: -rand() * 10,
      twinkleDur: 2 + rand() * 3,
      twinkleDelay: -rand() * 5,
      hue: rand() > 0.5 ? "warm" : "cool",
    };
  });
};

const GLITTER_PARTICLES = makeGlitterParticles(34);

const HomeUddanVideo = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const glitterRef = useRef(null);
  const textRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const barTopRef = useRef(null);
  const barBottomRef = useRef(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafRef = useRef(null);
  const videoPlayingRef = useRef(false);

  useEffect(() => {
    const readTargetProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      targetProgress.current = clamp(-rect.top / total);
    };

    const render = (p) => {
      // 1) Image: slow Ken-Burns push-in + depth tilt, then dissolves with a
      // soft focus-pull blur as it recedes into the background (0 - 0.28)
      const imageOut = range(p, 0, 0.28);
      const kenBurns = range(p, 0, 1); // continuous slow drift across whole section
      if (imageRef.current) {
        const scale = 1.12 + kenBurns * 0.1 + imageOut * 0.06;
        const rotateX = 4 - imageOut * 4;
        const translateZ = -60 + imageOut * 60;
        imageRef.current.style.opacity = 1 - imageOut;
        imageRef.current.style.filter = `blur(${imageOut * 14}px) brightness(${1 - imageOut * 0.3})`;
        imageRef.current.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
      }

      // 1.5) Glitter / bokeh field: replaces the plain black gap — fades in as the
      // image dissolves, swirls slowly, fades out again once the video takes over.
      const glitterIn = range(p, 0.1, 0.3);
      const glitterOut = range(p, 0.72, 0.92);
      if (glitterRef.current) {
        const glitterOpacity = glitterIn * (1 - glitterOut);
        const rotate = p * 50; // slow continuous swirl across the whole scroll
        const scale = 1 + glitterIn * 0.15;
        glitterRef.current.style.opacity = glitterOpacity;
        glitterRef.current.style.transform = `rotate(${rotate}deg) scale(${scale})`;
      }

      // 2) Title + paragraph: blur-focus-pull in (0.3 - 0.48), drift + blur out (0.58 - 0.75)
      const textIn = range(p, 0.3, 0.48);
      const textOut = range(p, 0.58, 0.75);
      const textOpacity = textIn * (1 - textOut);
      if (textRef.current) {
        textRef.current.style.opacity = textOpacity;
      }
      if (titleRef.current) {
        const shiftIn = (1 - textIn) * 50;
        const shiftOut = -textOut * 40;
        const blurAmt = (1 - textIn) * 16 + textOut * 10;
        titleRef.current.style.transform = `translateY(${shiftIn + shiftOut}px) scale(${0.94 + textIn * 0.06})`;
        titleRef.current.style.filter = `blur(${blurAmt}px)`;
      }
      if (descRef.current) {
        // paragraph trails slightly behind the title for a staggered, layered reveal
        const dIn = range(p, 0.35, 0.52);
        const dOut = range(p, 0.6, 0.75);
        const shiftIn = (1 - dIn) * 30;
        const shiftOut = -dOut * 30;
        const blurAmt = (1 - dIn) * 10 + dOut * 8;
        descRef.current.style.transform = `translateY(${shiftIn + shiftOut}px)`;
        descRef.current.style.filter = `blur(${blurAmt}px)`;
      }

      // 3) Video: rises up out of black with a slow zoom-settle + focus pull (0.78 - 0.95)
      const videoIn = range(p, 0.78, 0.95);
      if (videoWrapRef.current) {
        videoWrapRef.current.style.opacity = videoIn;
        const scale = 1.15 - videoIn * 0.15;
        videoWrapRef.current.style.transform = `scale(${scale})`;
        videoWrapRef.current.style.filter = `blur(${(1 - videoIn) * 10}px)`;
      }

      // 4) Letterbox bars close in as the video takes over, classic cinematic frame
      const barSize = videoIn * 7; // vh
      if (barTopRef.current) barTopRef.current.style.height = `${barSize}vh`;
      if (barBottomRef.current) barBottomRef.current.style.height = `${barSize}vh`;

      const video = videoRef.current;
      if (video) {
        if (videoIn > 0.02) {
          if (video.paused) {
            video.playbackRate = VIDEO_PLAYBACK_RATE;
            video.play().catch(() => {});
          }
          videoPlayingRef.current = true;
        } else if (videoPlayingRef.current) {
          video.pause();
          video.currentTime = 0;
          videoPlayingRef.current = false;
        }
      }
    };

    const loop = () => {
      const current = currentProgress.current;
      const target = targetProgress.current;
      const diff = target - current;

      // Once close enough, snap to avoid endless tiny rAF churn.
      if (Math.abs(diff) < 0.0004) {
        currentProgress.current = target;
      } else {
        currentProgress.current = current + diff * SMOOTHING;
      }

      render(currentProgress.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    const onScroll = () => readTargetProgress();

    readTargetProgress();
    currentProgress.current = targetProgress.current;
    rafRef.current = requestAnimationFrame(loop);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="ensai_ho_uddan_pg_video_section" ref={sectionRef}>
      <div className="ensai_ho_uddan_pg_video_sticky">
        <div className="ensai_ho_uddan_pg_video_stage">
          <div
            className="ensai_ho_uddan_pg_video_bg"
            ref={imageRef}
            style={{ backgroundImage: `url(${BG_IMAGE})` }}
          />

          <div className="ensai_ho_uddan_pg_glitter" ref={glitterRef}>
            {GLITTER_PARTICLES.map((particle) => (
              <span
                key={particle.id}
                className={`ensai_ho_uddan_pg_glitter_dot ensai_ho_uddan_pg_glitter_dot--${particle.hue}`}
                style={{
                  width: particle.size,
                  height: particle.size,
                  top: `${particle.top}%`,
                  left: `${particle.left}%`,
                  "--dx": `${particle.dx}px`,
                  "--dy": `${particle.dy}px`,
                  animationDuration: `${particle.floatDur}s, ${particle.twinkleDur}s`,
                  animationDelay: `${particle.floatDelay}s, ${particle.twinkleDelay}s`,
                }}
              />
            ))}
          </div>

          <div className="ensai_ho_uddan_pg_video_text" ref={textRef}>
            <h1 className="ensai_ho_uddan_pg_video_title" ref={titleRef}>
              Choose your drone, choose your ground
            </h1>
            <p className="ensai_ho_uddan_pg_video_desc" ref={descRef}>
              The main menu — pick an airframe from the Ajeet lineup and an
              environment, then start the rehearsal.
            </p>
          </div>

          <div className="ensai_ho_uddan_pg_video_wrap" ref={videoWrapRef}>
            <video
              className="ensai_ho_uddan_pg_video_player"
              ref={videoRef}
              src={VIDEO_SRC}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </div>
        </div>

        <div className="ensai_ho_uddan_pg_video_vignette" />
        <div className="ensai_ho_uddan_pg_letterbox_top" ref={barTopRef} />
        <div className="ensai_ho_uddan_pg_letterbox_bottom" ref={barBottomRef} />
      </div>
    </section>
  );
};

export default HomeUddanVideo;