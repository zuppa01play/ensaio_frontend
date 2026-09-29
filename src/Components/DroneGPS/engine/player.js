import { clamp } from "./timeline";

/** Master playback clock for the mission timeline. No recording — pure playback. */
export class Player {
  constructor(duration) {
    this.time = 0;
    this.playing = false;
    this.duration = duration;
  }

  /** Advance the clock by dt seconds (called from the rAF loop). */
  tick(dt) {
    if (this.playing) {
      this.time = Math.min(this.duration, this.time + dt);
      if (this.time >= this.duration) this.playing = false;
    }
    return this.time;
  }

  play() {
    if (this.time >= this.duration) this.time = 0;
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  restart() {
    this.time = 0;
    this.playing = true;
  }

  seek(t) {
    this.time = clamp(t, 0, this.duration - 0.001);
  }

  reset() {
    this.time = 0;
    this.playing = false;
  }
}
