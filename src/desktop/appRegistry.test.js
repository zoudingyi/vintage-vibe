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
        windowSize: {
          width: expect.any(Number)
        }
      })
    );
  });
});
