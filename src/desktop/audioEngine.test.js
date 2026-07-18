import { playRadioCue, playTestTone } from './audioEngine';

test.each([
  {
    caseName: 'the sound switch is off',
    masterVolume: 25,
    soundEnabled: false
  },
  { caseName: 'master volume is zero', masterVolume: 0, soundEnabled: true }
])('does not create audio when $caseName', audioSettings => {
  const AudioContextClass = jest.fn();

  expect(playTestTone(audioSettings, AudioContextClass)).toBe('muted');
  expect(AudioContextClass).not.toHaveBeenCalled();
});

test.each([
  ['tuning', 'sine', 0.3],
  ['tape-flip', 'square', 0.12]
])(
  'plays the %s radio cue with a short volume-limited envelope',
  (cue, oscillatorType, duration) => {
    const gain = {
      connect: jest.fn(),
      gain: {
        exponentialRampToValueAtTime: jest.fn(),
        setValueAtTime: jest.fn()
      }
    };
    const oscillator = {
      connect: jest.fn(),
      frequency: {
        exponentialRampToValueAtTime: jest.fn(),
        setValueAtTime: jest.fn()
      },
      start: jest.fn(),
      stop: jest.fn(),
      type: ''
    };
    const audioContext = {
      close: jest.fn(),
      createGain: jest.fn(() => gain),
      createOscillator: jest.fn(() => oscillator),
      currentTime: 2,
      destination: {}
    };

    expect(
      playRadioCue(
        cue,
        { masterVolume: 25, soundEnabled: true },
        jest.fn(() => audioContext)
      )
    ).toBe('played');
    expect(oscillator.type).toBe(oscillatorType);
    expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.045, 2);
    expect(oscillator.stop).toHaveBeenCalledWith(2 + duration);

    oscillator.onended();
    expect(audioContext.close).toHaveBeenCalledTimes(1);
  }
);

test.each([
  ['tuning', { masterVolume: 25, soundEnabled: false }],
  ['tape-flip', { masterVolume: 0, soundEnabled: true }],
  ['unknown', { masterVolume: 25, soundEnabled: true }]
])('does not create audio for %s when the cue cannot play', (cue, settings) => {
  const AudioContextClass = jest.fn();

  expect(playRadioCue(cue, settings, AudioContextClass)).not.toBe('played');
  expect(AudioContextClass).not.toHaveBeenCalled();
});
