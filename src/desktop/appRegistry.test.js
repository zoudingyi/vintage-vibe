import appRegistry from './appRegistry';

test('registers complete desktop app metadata with unique ids', () => {
  const appIds = appRegistry.map(app => app.id);

  expect(new Set(appIds).size).toBe(appIds.length);

  appRegistry.forEach(app => {
    expect(app).toEqual(
      expect.objectContaining({
        component: expect.any(Function),
        defaultPosition: {
          x: expect.any(Number),
          y: expect.any(Number)
        },
        icon: expect.any(String),
        id: expect.any(String),
        showInStartMenu: expect.any(Boolean),
        showOnDesktop: expect.any(Boolean),
        title: expect.any(String),
        windowSize: expect.objectContaining({
          width: expect.any(Number)
        })
      })
    );
  });
});

test('uses Vaporwave Radio as the desktop music shortcut', () => {
  const radioApp = appRegistry.find(app => app.id === 'vaporwave-radio');

  expect(appRegistry.some(app => app.id === 'media-player')).toBe(false);
  expect(radioApp).toMatchObject({
    defaultPosition: { x: 168, y: 96 },
    showInStartMenu: true,
    showOnDesktop: true
  });
  expect(
    appRegistry.filter(app => app.showOnDesktop).map(app => app.id)
  ).toEqual([
    'my-computer',
    'my-folder',
    'vaporwave-radio',
    'my-videos',
    'recycle-bin'
  ]);
});
