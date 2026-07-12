import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import VaporwaveRadioApp from './VaporwaveRadioApp';

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
