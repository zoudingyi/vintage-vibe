import { createRadioVisualizer } from './radioVisualizer';

test('samples normalized audio data into a compact visualization frame', () => {
  const analyser = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 32,
    frequencyBinCount: 16,
    getByteFrequencyData: data => {
      data.set([0, 32, 64, 96, 128, 160, 192, 224, 255, 224, 192, 160, 128, 96, 64, 32]);
    },
    getByteTimeDomainData: data => {
      const wave = [0, 32, 64, 96, 128, 160, 192, 255];
      data.forEach((_, index) => {
        data[index] = wave[index % wave.length];
      });
    },
    smoothingTimeConstant: 0
  };
  const source = {
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  const audioContext = {
    close: jest.fn(),
    createAnalyser: jest.fn(() => analyser),
    createMediaElementSource: jest.fn(() => source),
    destination: {},
    resume: jest.fn(),
    state: 'suspended'
  };
  const AudioContextClass = jest.fn(() => audioContext);
  const onFrame = jest.fn();
  const requestFrame = jest.fn(() => 41);
  const visualizer = createRadioVisualizer({
    AudioContextClass,
    audio: document.createElement('audio'),
    cancelFrame: jest.fn(),
    onFrame,
    requestFrame
  });

  expect(visualizer.start()).toBe('running');

  expect(audioContext.resume).toHaveBeenCalledTimes(1);
  expect(source.connect).toHaveBeenCalledWith(analyser);
  expect(analyser.connect).toHaveBeenCalledWith(audioContext.destination);
  expect(onFrame).toHaveBeenCalledWith(
    expect.objectContaining({
      bands: expect.any(Array),
      levels: expect.any(Array),
      waveform: expect.any(Array)
    })
  );

  const frame = onFrame.mock.calls[0][0];
  expect(frame.bands).toHaveLength(16);
  expect(frame.bands[0]).toBe(0);
  expect(frame.bands[8]).toBe(1);
  expect(frame.levels).toHaveLength(2);
  expect(frame.waveform[0]).toBe(-1);
  expect(frame.waveform).toContain(0);
  expect(requestFrame).toHaveBeenCalledTimes(1);
});

test('stops sampling and releases the media graph without rebuilding it', () => {
  const analyser = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 32,
    frequencyBinCount: 16,
    getByteFrequencyData: jest.fn(),
    getByteTimeDomainData: jest.fn(),
    smoothingTimeConstant: 0
  };
  const source = {
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  const audioContext = {
    close: jest.fn(),
    createAnalyser: jest.fn(() => analyser),
    createMediaElementSource: jest.fn(() => source),
    destination: {},
    resume: jest.fn(),
    state: 'running'
  };
  const AudioContextClass = jest.fn(() => audioContext);
  const cancelFrame = jest.fn();
  const onFrame = jest.fn();
  const requestFrame = jest.fn(() => 73);
  const visualizer = createRadioVisualizer({
    AudioContextClass,
    audio: document.createElement('audio'),
    cancelFrame,
    onFrame,
    requestFrame
  });

  visualizer.start();
  visualizer.start();
  visualizer.stop();
  visualizer.destroy();

  expect(AudioContextClass).toHaveBeenCalledTimes(1);
  expect(requestFrame).toHaveBeenCalledTimes(1);
  expect(cancelFrame).toHaveBeenCalledWith(73);
  expect(onFrame).toHaveBeenLastCalledWith({
    bands: Array(16).fill(0),
    levels: [0, 0],
    waveform: Array(24).fill(0)
  });
  expect(source.disconnect).toHaveBeenCalledTimes(1);
  expect(analyser.disconnect).toHaveBeenCalledTimes(1);
  expect(audioContext.close).toHaveBeenCalledTimes(1);
});

test('falls back without interrupting playback when Web Audio initialization fails', () => {
  const requestFrame = jest.fn();
  const visualizer = createRadioVisualizer({
    AudioContextClass: jest.fn(() => {
      throw new Error('Web Audio is unavailable');
    }),
    audio: document.createElement('audio'),
    cancelFrame: jest.fn(),
    onFrame: jest.fn(),
    requestFrame
  });

  expect(visualizer.start()).toBe('unsupported');
  expect(requestFrame).not.toHaveBeenCalled();
});

test('cleans up a partial graph when the media element was already connected', () => {
  const audioContext = {
    close: jest.fn(),
    createAnalyser: jest.fn(),
    createMediaElementSource: jest.fn(() => {
      throw new DOMException('Already connected', 'InvalidStateError');
    })
  };
  const requestFrame = jest.fn();
  const visualizer = createRadioVisualizer({
    AudioContextClass: jest.fn(() => audioContext),
    audio: document.createElement('audio'),
    cancelFrame: jest.fn(),
    onFrame: jest.fn(),
    requestFrame
  });

  expect(visualizer.start()).toBe('unsupported');
  expect(audioContext.close).toHaveBeenCalledTimes(1);
  expect(audioContext.createAnalyser).not.toHaveBeenCalled();
  expect(requestFrame).not.toHaveBeenCalled();
});
