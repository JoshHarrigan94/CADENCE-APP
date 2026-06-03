let audioContext = null;
let enabled = false;

export async function unlockAudio() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  enabled = true;
}

export function isAudioEnabled() {
  return enabled;
}

export function playPhaseTick(phaseId = "default") {
  if (!enabled || !audioContext) return;

  const settings = {
    eccentric: { frequency: 160, duration: 0.035 },
    bottom: { frequency: 110, duration: 0.05 },
    concentric: { frequency: 260, duration: 0.04 },
    top: { frequency: 190, duration: 0.035 },
    default: { frequency: 180, duration: 0.035 },
  };

  const sound = settings[phaseId] || settings.default;
  playClick(sound.frequency, sound.duration);
}

export function playStartCue() {
  if (!enabled || !audioContext) return;

  playClick(140, 0.05);

  window.setTimeout(() => {
    playClick(220, 0.04);
  }, 90);
}

export function playPauseCue() {
  if (!enabled || !audioContext) return;

  playClick(90, 0.08);
}

export function playCompleteCue() {
  if (!enabled || !audioContext) return;

  playClick(180, 0.05);

  window.setTimeout(() => {
    playClick(260, 0.06);
  }, 110);

  window.setTimeout(() => {
    playClick(340, 0.08);
  }, 230);
}

function playClick(frequency, duration) {
  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}