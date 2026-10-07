import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import { playRadioCue } from '@/desktop/audioEngine';
import VaporwaveRadioApp from './VaporwaveRadioApp';

jest.mock('@/desktop/audioEngine', () => ({
  ...jest.requireActual('@/desktop/audioEngine'),
  playRadioCue: jest.fn()
}));

const originalAudioContext = window.AudioContext;
const originalMatchMedia = window.matchMedia;

const enabledAudioSettings = {
  masterVolume: 40,
  radioAppearance: 'cassette',
  soundEnabled: true
};

function radioView(desktopSettings) {
  return (
    <ThemeProvider theme={theSixtiesUSA}>
      <VaporwaveRadioApp desktopSettings={desktopSettings} />
    </ThemeProvider>
  );
}

function renderRadio(desktopSettings = enabledAudioSettings) {
  return render(radioView(desktopSettings));
}

let pauseMedia;
let playMedia;

function installAudioAnalyser({
  fillFrequencyData = data => data.fill(255),
  fillLeftTimeData = data => data.fill(0),
  fillRightTimeData = data => data.fill(0),
  fillTimeData = data => data.fill(128)
} = {}) {
  function createAnalyser(getByteTimeDomainData, getByteFrequencyData = jest.fn()) {
    return {
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 32,
      frequencyBinCount: 16,
      getByteFrequencyData,
      getByteTimeDomainData,
      smoothingTimeConstant: 0
    };
  }
  const analyser = createAnalyser(fillTimeData, fillFrequencyData);
  const channelAnalysers = [
    createAnalyser(fillLeftTimeData),
    createAnalyser(fillRightTimeData)
  ];
  const source = {
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  const splitter = {
    connect: jest.fn(),
    disconnect: jest.fn()
  };
  const audioContext = {
    close: jest.fn(),
    createAnalyser: jest
      .fn()
      .mockReturnValueOnce(analyser)
      .mockReturnValueOnce(channelAnalysers[0])
      .mockReturnValueOnce(channelAnalysers[1]),
    createChannelSplitter: jest.fn(() => splitter),
    createMediaElementSource: jest.fn(() => source),
    destination: {},
    resume: jest.fn(),
    state: 'running'
  };
  window.AudioContext = jest.fn(() => audioContext);

  return { analyser, audioContext, channelAnalysers, source, splitter };
}

beforeEach(() => {
  playRadioCue.mockClear();
  playMedia = jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(function play() {
      fireEvent.play(this);
      return Promise.resolve();
    });
  pauseMedia = jest
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(function pause() {
      fireEvent.pause(this);
    });
});

afterEach(() => {
  jest.restoreAllMocks();
  window.AudioContext = originalAudioContext;
  window.matchMedia = originalMatchMedia;
});

test('plays and pauses the tuned station through the browser audio player', () => {
  renderRadio();

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  expect(playMedia).toHaveBeenCalledTimes(1);
  expect(
    screen.getByRole('button', { name: /pause music/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /pause music/i }));

  expect(pauseMedia).toHaveBeenCalledTimes(1);
  expect(
    screen.getByRole('button', { name: /play music/i })
  ).toBeInTheDocument();
});

test('keeps broadcasting and shows the track after tuning another station', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /88.7 palm mirage/i })
  );
  fireEvent.loadedMetadata(audio);

  expect(
    screen.getByRole('button', { name: /88.7 palm mirage/i })
  ).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('region', { name: /now playing/i })).toHaveTextContent(
    /love philter.*aevv.*01 \/ 06/i
  );
  expect(playMedia).toHaveBeenCalledTimes(2);
  expect(playRadioCue).toHaveBeenCalledWith('tuning', enabledAudioSettings);
});

test('explains why playback cannot start when global sound is disabled', () => {
  renderRadio({
    ...enabledAudioSettings,
    soundEnabled: false
  });

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  expect(playMedia).not.toHaveBeenCalled();
  expect(screen.getByRole('status')).toHaveTextContent(
    /enable sound in settings/i
  );
  expect(
    screen.getByRole('button', { name: /play music/i })
  ).toBeInTheDocument();
});

test('applies master volume and pauses when global sound is switched off', () => {
  const { container, rerender } = renderRadio();
  const audio = container.querySelector('audio');

  expect(audio.volume).toBe(0.4);

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  rerender(
    radioView({
      ...enabledAudioSettings,
      soundEnabled: false
    })
  );

  expect(audio.volume).toBe(0);
  expect(pauseMedia).toHaveBeenCalledTimes(1);
  expect(
    screen.getByRole('button', { name: /play music/i })
  ).toBeInTheDocument();
});

test('shows real elapsed time and duration from the tuned audio', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  Object.defineProperty(audio, 'duration', {
    configurable: true,
    value: 311.72
  });
  fireEvent.loadedMetadata(audio);
  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    value: 65
  });
  fireEvent.timeUpdate(audio);

  expect(screen.getByRole('region', { name: /now playing/i })).toHaveTextContent(
    /01:05 \/ 05:11/i
  );
});

test('automatically plays the next track when the current track ends', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.ended(audio);
  fireEvent.loadedMetadata(audio);

  expect(playMedia).toHaveBeenCalledTimes(2);
  expect(audio.currentTime).toBe(0);
  expect(screen.getByRole('region', { name: /now playing/i })).toHaveTextContent(
    /solid dance.*shambara.*02 \/ 10/i
  );
  expect(
    screen.getByRole('button', { name: /pause music/i })
  ).toBeInTheDocument();
});

test('uses the three-second threshold and wraps previous and next tracks', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');
  const nowPlaying = screen.getByRole('region', { name: /now playing/i });

  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  fireEvent.loadedMetadata(audio);
  expect(nowPlaying).toHaveTextContent(/solid dance.*02 \/ 10/i);

  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    value: 5,
    writable: true
  });
  fireEvent.timeUpdate(audio);
  fireEvent.click(screen.getByRole('button', { name: /previous track/i }));
  expect(nowPlaying).toHaveTextContent(/solid dance.*02 \/ 10/i);
  expect(audio.currentTime).toBe(0);

  fireEvent.click(screen.getByRole('button', { name: /previous track/i }));
  fireEvent.loadedMetadata(audio);
  expect(nowPlaying).toHaveTextContent(/真夜中のドア.*01 \/ 10/i);

  fireEvent.click(screen.getByRole('button', { name: /previous track/i }));
  fireEvent.loadedMetadata(audio);
  expect(nowPlaying).toHaveTextContent(/プラスティック・ラブ.*10 \/ 10/i);

  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  expect(playRadioCue).toHaveBeenCalledWith('tape-flip', enabledAudioSettings);
  expect(playMedia).not.toHaveBeenCalled();
});

test('keeps playing after a manual track change', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  fireEvent.loadedMetadata(audio);

  expect(playMedia).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button', { name: /pause music/i })).toBeInTheDocument();
});

test('restores each station track and progress after tuning away', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');
  const nowPlaying = screen.getByRole('region', { name: /now playing/i });

  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  fireEvent.loadedMetadata(audio);
  audio.currentTime = 45;
  fireEvent.timeUpdate(audio);

  fireEvent.click(screen.getByRole('button', { name: /88.7 palm mirage/i }));
  fireEvent.loadedMetadata(audio);
  fireEvent.click(screen.getByRole('button', { name: /next track/i }));
  fireEvent.loadedMetadata(audio);
  audio.currentTime = 18;
  fireEvent.timeUpdate(audio);

  fireEvent.click(screen.getByRole('button', { name: /94.2 midnight plaza/i }));
  fireEvent.loadedMetadata(audio);
  expect(nowPlaying).toHaveTextContent(/solid dance.*02 \/ 10.*00:45/i);
  expect(audio.currentTime).toBe(45);

  fireEvent.click(screen.getByRole('button', { name: /88.7 palm mirage/i }));
  fireEvent.loadedMetadata(audio);
  expect(nowPlaying).toHaveTextContent(/告白♡.*02 \/ 06.*00:18/i);
  expect(audio.currentTime).toBe(18);
});

test.each([
  ['cassette', /track 01 \/ 10/i],
  ['night-drive', /01 \/ 10/i],
  ['broadcast', /program 01 of 10/i]
])('shows track position in the %s appearance', (radioAppearance, position) => {
  renderRadio({
    ...enabledAudioSettings,
    radioAppearance
  });

  expect(screen.getByRole('region', { name: /now playing/i })).toHaveTextContent(
    position
  );
});

test('reports an audio loading failure without showing a false playing state', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.error(audio);

  expect(screen.getByRole('status')).toHaveTextContent(
    /could not load midnight plaza/i
  );
  expect(
    screen.getByRole('button', { name: /play music/i })
  ).toBeInTheDocument();
});

test('distinguishes browser playback blocking from an audio loading failure', async () => {
  playMedia.mockImplementationOnce(() =>
    Promise.reject(
      Object.assign(new Error('Playback requires user activation'), {
        name: 'NotAllowedError'
      })
    )
  );
  renderRadio();

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  expect(await screen.findByRole('status')).toHaveTextContent(
    /browser blocked playback/i
  );
});

test('clears a stale playback error after tuning another station', async () => {
  playMedia.mockImplementationOnce(() =>
    Promise.reject(
      Object.assign(new Error('Playback requires user activation'), {
        name: 'NotAllowedError'
      })
    )
  );
  renderRadio();

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  expect(await screen.findByRole('status')).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: /88.7 palm mirage/i })
  );

  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('drives the Cassette Deck VU meters from live audio samples', () => {
  installAudioAnalyser();
  renderRadio();

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  const meters = screen.getByRole('img', { name: /dual vu meters/i });
  const meterLevels = meters.querySelectorAll('i');
  expect(meters).toHaveAttribute('data-active', 'true');
  expect(meterLevels).toHaveLength(2);
  expect(meterLevels[0]).toHaveStyle('--level: 100%');
  expect(meterLevels[1]).toHaveStyle('--level: 100%');
});

test('drives the Night Drive spectrum from live frequency bands', () => {
  installAudioAnalyser();
  renderRadio({
    ...enabledAudioSettings,
    radioAppearance: 'night-drive'
  });

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  const spectrum = screen.getByRole('img', {
    name: /live frequency spectrum/i
  });
  const bars = spectrum.querySelectorAll('i');
  expect(spectrum).toHaveAttribute('data-active', 'true');
  expect(bars).toHaveLength(16);
  expect(bars[0]).toHaveStyle('--bar: 32px');
  expect(bars[15]).toHaveStyle('--bar: 32px');
});

test('renders a dual-channel CRT oscilloscope with an 8-band spectrum', () => {
  installAudioAnalyser({
    fillLeftTimeData: data => data.fill(0),
    fillRightTimeData: data => data.fill(255)
  });
  renderRadio({
    ...enabledAudioSettings,
    radioAppearance: 'broadcast'
  });

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  const oscilloscope = screen.getByRole('img', {
    name: /dual channel crt oscilloscope/i
  });
  const traces = oscilloscope.querySelectorAll('polyline');
  const spectrum = screen.getByRole('img', { name: /8-band spectrum/i });
  const spectrumBars = spectrum.querySelectorAll('i');

  expect(oscilloscope).toHaveAttribute('data-active', 'true');
  expect(traces).toHaveLength(2);
  expect(traces[0]).not.toHaveAttribute('points', traces[1].getAttribute('points'));
  expect(oscilloscope).toHaveTextContent(/ch1.*ch2.*time\/div/i);
  expect(spectrumBars).toHaveLength(8);
  expect(spectrumBars[0]).toHaveStyle('--band: 100%');
});

test('keeps visualization static when reduced motion is preferred', () => {
  window.matchMedia = jest.fn(() => ({
    addEventListener: jest.fn(),
    matches: true,
    removeEventListener: jest.fn()
  }));
  installAudioAnalyser();
  renderRadio({
    ...enabledAudioSettings,
    radioAppearance: 'night-drive'
  });

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  const spectrum = screen.getByRole('img', {
    name: /live frequency spectrum/i
  });
  expect(window.AudioContext).not.toHaveBeenCalled();
  expect(spectrum).toHaveAttribute('data-active', 'false');
  expect(spectrum.querySelector('i')).toHaveStyle('--bar: 3px');
});
