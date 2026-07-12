import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import VaporwaveRadioApp from './VaporwaveRadioApp';

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
  fillTimeData = data => data.fill(128)
} = {}) {
  const analyser = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 32,
    frequencyBinCount: 16,
    getByteFrequencyData: fillFrequencyData,
    getByteTimeDomainData: fillTimeData,
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
  window.AudioContext = jest.fn(() => audioContext);

  return { analyser, audioContext, source };
}

beforeEach(() => {
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
  renderRadio();

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /88.7 palm mirage/i })
  );

  expect(
    screen.getByRole('button', { name: /88.7 palm mirage/i })
  ).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('region', { name: /now playing/i })).toHaveTextContent(
    /solid dance.*shambara/i
  );
  expect(playMedia).toHaveBeenCalledTimes(2);
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

test('restarts the current station when its only track ends', () => {
  const { container } = renderRadio();
  const audio = container.querySelector('audio');

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));
  fireEvent.ended(audio);

  expect(playMedia).toHaveBeenCalledTimes(2);
  expect(audio.currentTime).toBe(0);
  expect(
    screen.getByRole('button', { name: /pause music/i })
  ).toBeInTheDocument();
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

test('draws the Broadcast Terminal waveform from live audio samples', () => {
  installAudioAnalyser({
    fillTimeData: data => {
      data.forEach((_, index) => {
        data[index] = index % 2 === 0 ? 0 : 255;
      });
    }
  });
  renderRadio({
    ...enabledAudioSettings,
    radioAppearance: 'broadcast'
  });

  fireEvent.click(screen.getByRole('button', { name: /play music/i }));

  const waveform = screen.getByRole('img', { name: /live audio waveform/i });
  const points = waveform.querySelectorAll('i');
  expect(waveform).toHaveAttribute('data-active', 'true');
  expect(points).toHaveLength(24);
  expect(points[0]).toHaveStyle('--wave: -18px');
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
