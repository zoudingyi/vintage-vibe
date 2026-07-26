import React from 'react';
import { Button, Panel } from 'react95';
import useGuestbook from './useGuestbook';
import {
  GUESTBOOK_MESSAGE_LIMIT,
  GUESTBOOK_NAME_LIMIT,
  localGuestbookRepository
} from './guestbookRepository';
import './GuestbookContent.css';

export const archivedGuestbookEntries = [
  {
    authorType: 'system',
    createdAt: '1999-08-07T20:07:00.000Z',
    id: 'archive-webmaster',
    message:
      'Welcome to the local node. Leave a note before the modem disconnects.',
    name: 'WEBMASTER',
    status: 'published'
  },
  {
    authorType: 'system',
    createdAt: '1999-09-09T23:42:00.000Z',
    id: 'archive-night-operator',
    message: 'The signal is clear. Thanks for stopping by.',
    name: 'NIGHT OPERATOR',
    status: 'published'
  }
];

function formatEntryDate(createdAt) {
  if (!createdAt) {
    return 'DATE UNKNOWN';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'DATE UNKNOWN';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: 'short',
    year: 'numeric'
  })
    .format(date)
    .toUpperCase();
}

function formatStatusDate(createdAt) {
  if (!createdAt) {
    return 'NO SIGNAL';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'DATE UNKNOWN';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric'
  })
    .format(date)
    .toUpperCase();
}

function getLatestTransmissionDate(entries) {
  return entries.reduce((latestDate, entry) => {
    const entryDate = new Date(entry.createdAt);

    if (Number.isNaN(entryDate.getTime())) {
      return latestDate;
    }

    return !latestDate || entryDate > latestDate ? entryDate : latestDate;
  }, null);
}

function formatSignalId(id) {
  if (id === undefined || id === null) {
    return 'UNKNOWN';
  }

  return String(id).slice(-8).toUpperCase();
}

function getEntryLabel(entry) {
  if (entry.authorType === 'system') {
    return 'ARCHIVED TRANSMISSION';
  }

  if (entry.status === 'pending') {
    return 'AWAITING MODERATION';
  }

  return entry.status === 'published' ? 'PUBLIC ENTRY' : 'LOCAL ENTRY';
}

export default function GuestbookContent({
  archivedEntries = [],
  mode = 'window',
  repository = localGuestbookRepository
}) {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [lastSubmittedEntry, setLastSubmittedEntry] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState({});
  const nameInputRef = React.useRef(null);
  const { entries, error, phase, submitEntry } = useGuestbook(repository);
  const displayedEntries = [...entries, ...archivedEntries];
  const isPage = mode === 'page';
  const nameErrorId = React.useId();
  const messageErrorId = React.useId();
  const nodeStatusHeadingId = React.useId();
  const previewHeadingId = React.useId();
  const hasDraft = Boolean(name.trim() || message.trim());
  const previewEntry =
    hasDraft || !lastSubmittedEntry
      ? {
          message:
            message.trim() || 'Your signature preview will appear here.',
          name: name.trim() || 'YOUR NAME'
        }
      : lastSubmittedEntry;
  const previewStatus =
    phase === 'sending'
      ? 'TRANSMITTING'
      : !hasDraft && lastSubmittedEntry
        ? 'SIGNATURE RECORDED'
        : 'NOT YET TRANSMITTED';
  const latestTransmissionDate = getLatestTransmissionDate(displayedEntries);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const nextErrors = {};

    if (!trimmedName) {
      nextErrors.name = 'Please enter your name.';
    } else if (trimmedName.length > GUESTBOOK_NAME_LIMIT) {
      nextErrors.name = `Name must be ${GUESTBOOK_NAME_LIMIT} characters or fewer.`;
    }

    if (!trimmedMessage) {
      nextErrors.message = 'Please enter a message.';
    } else if (trimmedMessage.length > GUESTBOOK_MESSAGE_LIMIT) {
      nextErrors.message = `Message must be ${GUESTBOOK_MESSAGE_LIMIT} characters or fewer.`;
    }

    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await submitEntry({
      message: trimmedMessage,
      name: trimmedName
    });

    if (result.success) {
      setLastSubmittedEntry(result.entry);
      setName('');
      setMessage('');
      nameInputRef.current?.focus();
    }
  }

  const statusMessage =
    error ||
    (phase === 'sending'
      ? 'TRANSMITTING SIGNATURE...'
      : phase === 'saved'
        ? `TRANSMISSION ACCEPTED // SIGNATURE ID: ${formatSignalId(
            lastSubmittedEntry?.id
          )}`
        : null);

  return (
    <section
      aria-label="Guestbook terminal"
      className={`guestbook-content guestbook-content--${mode}`}
    >
      <div className="guestbook-terminal-heading">
        <div>
          <span>VISITOR LOG // INPUT CHANNEL</span>
          <h2>SIGN &amp; READ</h2>
        </div>
        <strong>
          {displayedEntries.length}{' '}
          {displayedEntries.length === 1 ? 'ENTRY' : 'ENTRIES'}
        </strong>
      </div>

      {statusMessage && (
        <p
          aria-label="Guestbook status"
          className={`guestbook-message is-${phase}`}
          role="status"
        >
          {statusMessage}
        </p>
      )}

      {isPage && (
        <>
          <section
            aria-labelledby={nodeStatusHeadingId}
            className="guestbook-node-status"
          >
            <div className="guestbook-node-status-heading">
              <span aria-hidden="true">●</span>
              <h3 id={nodeStatusHeadingId}>NODE STATUS</h3>
              <small>VISITOR SERVICES / 1999</small>
            </div>
            <dl>
              <div>
                <dt>SIGNATURES</dt>
                <dd>{entries.length}</dd>
              </div>
              <div>
                <dt>ARCHIVED</dt>
                <dd>{archivedEntries.length}</dd>
              </div>
              <div>
                <dt>LAST TRANSMISSION</dt>
                <dd>{formatStatusDate(latestTransmissionDate)}</dd>
              </div>
              <div>
                <dt>MESSAGE LIMIT</dt>
                <dd>{GUESTBOOK_MESSAGE_LIMIT} CHAR</dd>
              </div>
            </dl>
          </section>

          <div className="guestbook-context-grid">
            <Panel className="guestbook-webmaster-note" variant="well">
              <div className="guestbook-letter-meta">
                <span>FROM THE WEBMASTER</span>
                <span>TO: VAPORNET VISITORS</span>
                <span>SUBJECT: BEFORE YOU DISCONNECT</span>
              </div>
              <p>
                This page is a small record of the people who passed through.
                Leave your name, a thought, or a signal from wherever you are.
              </p>
              <p lang="zh-CN">
                欢迎来到这里。愿每一次短暂访问，都能留下一点真实的痕迹。
              </p>
              <strong>— WEBMASTER</strong>
            </Panel>

            <section
              aria-labelledby={previewHeadingId}
              className="guestbook-signature-preview"
            >
              <div className="guestbook-preview-heading">
                <div>
                  <span>LIVE COMPOSER</span>
                  <h3 id={previewHeadingId}>SIGNATURE PREVIEW</h3>
                </div>
                <strong>{previewStatus}</strong>
              </div>
              <article className="guestbook-preview-card">
                <div className="guestbook-entry-meta">
                  <span>#NEW</span>
                  <span>READY FOR TRANSMISSION</span>
                </div>
                <span className="guestbook-entry-type">VISITOR SIGNATURE</span>
                <h4>{previewEntry.name}</h4>
                <p>{previewEntry.message}</p>
              </article>
            </section>
          </div>
        </>
      )}

      <div
        className={`guestbook-terminal-grid${isPage ? ' is-page' : ''}`}
      >
        <Panel className="guestbook-form-panel" variant="well">
          <div className="guestbook-panel-heading">
            <span aria-hidden="true">01</span>
            <div>
              <strong>SIGN THE GUESTBOOK</strong>
              <small>VISITOR ENTRY FORM</small>
            </div>
          </div>

          <form
            aria-label="Sign guestbook"
            className="guestbook-entry-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <label>
              <span>Name</span>
              <input
                aria-describedby={validationErrors.name ? nameErrorId : undefined}
                aria-invalid={Boolean(validationErrors.name)}
                aria-label="Guestbook name"
                maxLength={GUESTBOOK_NAME_LIMIT}
                onChange={event => {
                  setName(event.target.value);
                  setValidationErrors(currentErrors => ({
                    ...currentErrors,
                    name: null
                  }));
                }}
                ref={nameInputRef}
                value={name}
              />
            </label>
            {validationErrors.name && (
              <span className="guestbook-field-error" id={nameErrorId}>
                {validationErrors.name}
              </span>
            )}

            <label>
              <span>Message</span>
              <textarea
                aria-describedby={
                  validationErrors.message ? messageErrorId : undefined
                }
                aria-invalid={Boolean(validationErrors.message)}
                aria-label="Guestbook message"
                maxLength={GUESTBOOK_MESSAGE_LIMIT}
                onChange={event => {
                  setMessage(event.target.value);
                  setValidationErrors(currentErrors => ({
                    ...currentErrors,
                    message: null
                  }));
                }}
                value={message}
              />
            </label>
            {validationErrors.message && (
              <span className="guestbook-field-error" id={messageErrorId}>
                {validationErrors.message}
              </span>
            )}

            <div className="guestbook-form-footer">
              <output aria-label="Message character count">
                {String(message.length).padStart(3, '0')} /{' '}
                {GUESTBOOK_MESSAGE_LIMIT}
              </output>
              <Button disabled={phase === 'sending'} type="submit">
                {phase === 'sending' ? 'Transmitting...' : 'Sign Guestbook'}
              </Button>
            </div>
          </form>
        </Panel>

        <section
          aria-labelledby="guestbook-transmissions-heading"
          className="guestbook-transmissions"
        >
          <div className="guestbook-panel-heading is-dark">
            <span aria-hidden="true">02</span>
            <div>
              <strong id="guestbook-transmissions-heading">
                RECENT TRANSMISSIONS
              </strong>
              <small>NEWEST ENTRIES FIRST</small>
            </div>
          </div>

          <div className="guestbook-entry-list">
            {phase === 'loading' ? (
              <p className="guestbook-empty-state">
                CONNECTING TO VISITOR LOG...
              </p>
            ) : displayedEntries.length === 0 ? (
              <p className="guestbook-empty-state">
                <strong>NO SIGNATURES YET</strong>
                <span>
                  The visitor log is waiting for its first transmission.
                </span>
              </p>
            ) : (
              displayedEntries.map((entry, index) => (
                <article className="guestbook-entry-card" key={entry.id}>
                  <div className="guestbook-entry-meta">
                    <span>#{String(index + 1).padStart(3, '0')}</span>
                    <span>{formatEntryDate(entry.createdAt)}</span>
                  </div>
                  <span className="guestbook-entry-type">
                    {getEntryLabel(entry)}
                  </span>
                  <h3>{entry.name}</h3>
                  <p>{entry.message}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {isPage && (
        <p className="guestbook-preview-note">
          Preview note: new signatures currently appear on this device.
        </p>
      )}
    </section>
  );
}
