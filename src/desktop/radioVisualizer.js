export const EMPTY_RADIO_VISUALIZATION = {
  bands: Array(16).fill(0),
  levels: [0, 0],
  waveform: Array(24).fill(0)
};

function compactSamples(data, count, transform) {
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = Math.round(
      (index * (data.length - 1)) / Math.max(count - 1, 1)
    );
    return transform(data[sourceIndex]);
  });
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function createRadioVisualizer({
  AudioContextClass,
  audio,
  cancelFrame,
  onFrame,
  requestFrame
}) {
  let analyser = null;
  let audioContext = null;
  let destroyed = false;
  let frameId = null;
  let frequencyData = null;
  let running = false;
  let source = null;
  let timeData = null;
  let unsupported = false;

  function initialize() {
    if (audioContext || unsupported) {
      return Boolean(audioContext);
    }
    if (!AudioContextClass) {
      unsupported = true;
      return false;
    }

    try {
      audioContext = new AudioContextClass();
      source = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      timeData = new Uint8Array(analyser.fftSize);
    } catch {
      source?.disconnect();
      analyser?.disconnect();
      audioContext?.close();
      source = null;
      analyser = null;
      audioContext = null;
      unsupported = true;
      return false;
    }

    return true;
  }

  function sample() {
    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);

    const bands = compactSamples(frequencyData, 16, value => value / 255);
    const evenBands = bands.filter((_, index) => index % 2 === 0);
    const oddBands = bands.filter((_, index) => index % 2 === 1);
    const waveform = compactSamples(
      timeData,
      24,
      value => (value - 128) / 128
    );

    onFrame({
      bands,
      levels: [average(evenBands), average(oddBands)],
      waveform
    });
    frameId = requestFrame(sample);
  }

  function start() {
    if (destroyed) {
      return 'destroyed';
    }
    if (!initialize()) {
      return 'unsupported';
    }
    if (running) {
      return 'running';
    }

    running = true;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    sample();

    return 'running';
  }

  function stop() {
    if (!running) {
      return;
    }

    running = false;
    if (frameId !== null) {
      cancelFrame(frameId);
      frameId = null;
    }
    onFrame(EMPTY_RADIO_VISUALIZATION);
  }

  function destroy() {
    if (destroyed) {
      return;
    }

    stop();
    source?.disconnect();
    analyser?.disconnect();
    audioContext?.close();
    destroyed = true;
  }

  return {
    destroy,
    stop,
    start
  };
}
