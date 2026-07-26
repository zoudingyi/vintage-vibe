import {
  GUESTBOOK_CHANGE_EVENT,
  GUESTBOOK_STORAGE_KEY,
  createLocalGuestbookRepository
} from './guestbookRepository';

beforeEach(() => {
  window.localStorage.clear();
});

test('loads legacy entries and creates backend-ready local entries', async () => {
  window.localStorage.setItem(
    GUESTBOOK_STORAGE_KEY,
    JSON.stringify([
      {
        id: 1,
        name: 'Legacy Visitor',
        message: 'Still readable.'
      }
    ])
  );
  const repository = createLocalGuestbookRepository({
    createId: () => 'local-entry-01',
    now: () => new Date('2026-07-26T14:18:00.000Z')
  });

  expect(await repository.listEntries()).toEqual({
    entries: [
      {
        id: 1,
        name: 'Legacy Visitor',
        message: 'Still readable.'
      }
    ],
    error: null
  });

  await repository.createEntry({
    clientRequestId: 'request-01',
    message: '  Great desktop shell.  ',
    name: '  Ada  '
  });

  expect(JSON.parse(window.localStorage.getItem(GUESTBOOK_STORAGE_KEY))).toEqual([
    {
      authorType: 'visitor',
      clientRequestId: 'request-01',
      createdAt: '2026-07-26T14:18:00.000Z',
      id: 'local-entry-01',
      message: 'Great desktop shell.',
      name: 'Ada',
      status: 'local'
    },
    {
      id: 1,
      name: 'Legacy Visitor',
      message: 'Still readable.'
    }
  ]);
});

test('reports unreadable data and recovers on the next valid entry', async () => {
  window.localStorage.setItem(GUESTBOOK_STORAGE_KEY, '{not-json');
  const repository = createLocalGuestbookRepository({
    createId: () => 'recovered-entry',
    now: () => new Date('2026-07-26T14:18:00.000Z')
  });

  expect(await repository.listEntries()).toEqual({
    entries: [],
    error: 'Guestbook data could not be read and was reset.'
  });

  await repository.createEntry({
    clientRequestId: 'recovery-request',
    message: 'The signal is back.',
    name: 'Operator'
  });

  expect((await repository.listEntries()).entries).toHaveLength(1);
});

test('notifies other mounted guestbook views after a local change', async () => {
  const repository = createLocalGuestbookRepository({
    createId: () => 'sync-entry',
    now: () => new Date('2026-07-26T14:18:00.000Z')
  });
  const listener = jest.fn();
  const unsubscribe = repository.subscribe(listener);

  await repository.createEntry({
    clientRequestId: 'sync-request',
    message: 'Received by both terminals.',
    name: 'Night Operator'
  });

  expect(listener).toHaveBeenCalledTimes(1);
  window.dispatchEvent(new Event(GUESTBOOK_CHANGE_EVENT));
  expect(listener).toHaveBeenCalledTimes(2);

  unsubscribe();
});
