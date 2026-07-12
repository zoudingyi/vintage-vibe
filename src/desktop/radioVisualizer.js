export const EMPTY_RADIO_VISUALIZATION = {
  bands: Array(16).fill(0),
  levels: [0, 0],
  waveforms: [Array(64).fill(0), Array(64).fill(0)]
};

function compactSamples(data, count, transform) {
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = Math.round(
      (index * (data.length - 1)) / Math.max(count - 1, 1)
    );
    return transform(data[sourceIndex]);
  });
}

function rootMeanSquare(values) {
  return Math.sqrt(
    values.reduce((total, value) => total + value ** 2, 0) / values.length
  );
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
  let channelAnalysers = [];
  let channelTimeData = [];
  let destroyed = false;
  let frameId = null;
  let frequencyData = null;
  let running = false;
  let source = null;
  let splitter = null;
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
      splitter = audioContext.createChannelSplitter(2);
      channelAnalysers = [
        audioContext.createAnalyser(),
        audioContext.createAnalyser()
      ];
      channelAnalysers.forEach((channelAnalyser, channelIndex) => {
        channelAnalyser.fftSize = 128;
        channelAnalyser.smoothingTimeConstant = 0.68;
        splitter.connect(channelAnalyser, channelIndex);
      });
      source.connect(splitter);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      channelTimeData = channelAnalysers.map(
        channelAnalyser => new Uint8Array(channelAnalyser.fftSize)
      );
    } catch {
      source?.disconnect();
      analyser?.disconnect();
      channelAnalysers.forEach(channelAnalyser => channelAnalyser.disconnect());
      splitter?.disconnect();
      audioContext?.close();
      source = null;
      analyser = null;
      channelAnalysers = [];
      audioContext = null;
      splitter = null;
      unsupported = true;
      return false;
    }

    return true;
  }

  function sample() {
    analyser.getByteFrequencyData(frequencyData);
    channelAnalysers.forEach((channelAnalyser, channelIndex) =>
      channelAnalyser.getByteTimeDomainData(channelTimeData[channelIndex])
    );

    const bands = compactSamples(frequencyData, 16, value => value / 255);
    const waveforms = channelTimeData.map(data =>
      compactSamples(data, 64, value => (value - 128) / 128)
    );

    onFrame({
      bands,
      levels: waveforms.map(rootMeanSquare),
      waveforms
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
    channelAnalysers.forEach(channelAnalyser => channelAnalyser.disconnect());
    splitter?.disconnect();
    audioContext?.close();
    destroyed = true;
  }

  return {
    destroy,
    stop,
    start
  };
}
