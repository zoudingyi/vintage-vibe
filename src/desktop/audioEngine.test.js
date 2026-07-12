import { playTestTone } from './audioEngine';

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
