import fs from 'fs';
import path from 'path';
import { radioStations } from './radioStations';

test('defines the complete track list for each radio station', () => {
  expect(
    Object.fromEntries(
      radioStations.map(station => [station.id, station.tracks.length])
    )
  ).toEqual({ dream: 6, midnight: 10, mirage: 6 });
});

test('maps every radio track to a unique local audio file', () => {
  const audioSources = radioStations.flatMap(station =>
    station.tracks.map(track => track.audioSrc)
  );

  expect(new Set(audioSources).size).toBe(audioSources.length);
  audioSources.forEach(audioSrc => {
    const localPath = path.join(process.cwd(), 'public', audioSrc);
    expect(fs.existsSync(localPath)).toBe(true);
  });
});
