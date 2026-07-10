import React, { useState } from 'react';
import { Button, Panel } from 'react95';

const guestbookStorageKey = 'vintage-vibe-guestbook';

function loadGuestbookEntries() {
  try {
    const storedValue = window.localStorage.getItem(guestbookStorageKey);
    const entries = storedValue ? JSON.parse(storedValue) : [];

    if (
      !Array.isArray(entries) ||
      entries.some(
        entry =>
          !entry ||
          typeof entry.id !== 'number' ||
          typeof entry.name !== 'string' ||
          typeof entry.message !== 'string'
      )
    ) {
      throw new TypeError('Guestbook entries must be a valid entry list.');
    }

    return {
      entries,
      error: null
    };
  } catch (error) {
    return {
      entries: [],
      error: 'Guestbook data could not be read and was reset.'
    };
  }
}

export default function GuestbookApp() {
  const [initialGuestbook] = useState(loadGuestbookEntries);
  const [entries, setEntries] = useState(initialGuestbook.entries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState(initialGuestbook.error);

  function saveEntries(nextEntries) {
    try {
      window.localStorage.setItem(
        guestbookStorageKey,
        JSON.stringify(nextEntries)
      );
      setEntries(nextEntries);
      setStorageError(null);
    } catch (error) {
      setStorageError('Guestbook entry could not be saved in this browser.');
    }
  }

  function submitEntry(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      return;
    }

    saveEntries([
      {
        id: Date.now(),
        name: trimmedName,
        message: trimmedMessage
      },
      ...entries
    ]);
    setName('');
    setMessage('');
  }

  return (
    <div className="guestbook-app">
      <strong>Guestbook</strong>
      {storageError && <p role="status">{storageError}</p>}
      <form className="guestbook-form" onSubmit={submitEntry}>
        <label>
          Name
          <input
            aria-label="Guestbook name"
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </label>
        <label>
          Message
          <textarea
            aria-label="Guestbook message"
            onChange={event => setMessage(event.target.value)}
            value={message}
          />
        </label>
        <Button type="submit">Sign Guestbook</Button>
      </form>
      <div className="guestbook-entries">
        {entries.length === 0 ? (
          <p>No signatures yet. Entries are stored only in this browser.</p>
        ) : (
          entries.map(entry => (
            <Panel variant="well" key={entry.id}>
              <strong>{entry.name}</strong>
              <p>{entry.message}</p>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
