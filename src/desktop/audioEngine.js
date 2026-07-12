export function playTestTone(
  { masterVolume, soundEnabled },
  AudioContextClass = window.AudioContext || window.webkitAudioContext
) {
  if (!soundEnabled || masterVolume === 0) {
    return 'muted';
  }

  if (!AudioContextClass) {
    return 'unsupported';
  }

  try {
    const audioContext = new AudioContextClass();
    const gain = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    const startTime = audioContext.currentTime;
    const stopTime = startTime + 0.25;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, startTime);
    gain.gain.setValueAtTime(masterVolume / 100, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(stopTime);
    oscillator.onended = () => audioContext.close?.();

    return 'played';
  } catch {
    return 'unsupported';
  }
}
