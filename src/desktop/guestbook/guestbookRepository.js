export const GUESTBOOK_STORAGE_KEY = 'vintage-vibe-guestbook';
export const GUESTBOOK_CHANGE_EVENT = 'vintage-vibe:guestbook-change';
export const GUESTBOOK_NAME_LIMIT = 32;
export const GUESTBOOK_MESSAGE_LIMIT = 280;

const unreadableGuestbookMessage =
  'Guestbook data could not be read and was reset.';
const unsavedGuestbookMessage =
  'Guestbook entry could not be saved in this browser.';

function isOptionalString(value) {
  return value === undefined || typeof value === 'string';
}

function isGuestbookEntry(entry) {
  return (
    entry &&
    (typeof entry.id === 'number' || typeof entry.id === 'string') &&
    typeof entry.name === 'string' &&
    typeof entry.message === 'string' &&
    isOptionalString(entry.authorType) &&
    isOptionalString(entry.clientRequestId) &&
    isOptionalString(entry.createdAt) &&
    isOptionalString(entry.status)
  );
}

function readEntries(storage) {
  try {
    const storedValue = storage.getItem(GUESTBOOK_STORAGE_KEY);
    const entries = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(entries) || entries.some(entry => !isGuestbookEntry(entry))) {
      throw new TypeError('Guestbook entries must be a valid entry list.');
    }

    return { entries, error: null };
  } catch (error) {
    return {
      entries: [],
      error: unreadableGuestbookMessage
    };
  }
}

function createDefaultId() {
  if (typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function validateEntryInput({ message, name }) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName) {
    throw new TypeError('Please enter your name.');
  }

  if (trimmedName.length > GUESTBOOK_NAME_LIMIT) {
    throw new TypeError(
      `Name must be ${GUESTBOOK_NAME_LIMIT} characters or fewer.`
    );
  }

  if (!trimmedMessage) {
    throw new TypeError('Please enter a message.');
  }

  if (trimmedMessage.length > GUESTBOOK_MESSAGE_LIMIT) {
    throw new TypeError(
      `Message must be ${GUESTBOOK_MESSAGE_LIMIT} characters or fewer.`
    );
  }

  return {
    message: trimmedMessage,
    name: trimmedName
  };
}

export function createLocalGuestbookRepository(options = {}) {
  const storage = options.storage || window.localStorage;
  const eventTarget = options.eventTarget || window;
  const createId = options.createId || createDefaultId;
  const now = options.now || (() => new Date());

  return {
    kind: 'local',

    async listEntries() {
      return readEntries(storage);
    },

    async createEntry(input) {
      const validatedInput = validateEntryInput(input);
      const id = createId();
      const entry = {
        authorType: 'visitor',
        clientRequestId: input.clientRequestId || id,
        createdAt: now().toISOString(),
        id,
        message: validatedInput.message,
        name: validatedInput.name,
        status: 'local'
      };
      const nextEntries = [entry, ...readEntries(storage).entries];

      try {
        storage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(nextEntries));
      } catch (error) {
        throw new Error(unsavedGuestbookMessage);
      }

      eventTarget.dispatchEvent(new Event(GUESTBOOK_CHANGE_EVENT));
      return entry;
    },

    subscribe(listener) {
      function handleStorage(event) {
        if (event.key === GUESTBOOK_STORAGE_KEY) {
          listener();
        }
      }

      eventTarget.addEventListener(GUESTBOOK_CHANGE_EVENT, listener);
      eventTarget.addEventListener('storage', handleStorage);

      return () => {
        eventTarget.removeEventListener(GUESTBOOK_CHANGE_EVENT, listener);
        eventTarget.removeEventListener('storage', handleStorage);
      };
    }
  };
}

export const localGuestbookRepository = createLocalGuestbookRepository();
