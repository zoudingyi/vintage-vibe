import React from 'react';
import { localGuestbookRepository } from './guestbookRepository';

const connectionErrorMessage =
  'Guestbook data could not be loaded from this browser.';

export default function useGuestbook(repository = localGuestbookRepository) {
  const [guestbookState, setGuestbookState] = React.useState({
    entries: [],
    error: null,
    phase: 'loading'
  });

  React.useEffect(() => {
    let active = true;

    async function refreshEntries() {
      try {
        const result = await repository.listEntries();

        if (active) {
          setGuestbookState(currentState => ({
            entries: result.entries,
            error: result.error,
            phase:
              currentState.phase === 'saved' ? currentState.phase : 'ready'
          }));
        }
      } catch (error) {
        if (active) {
          setGuestbookState({
            entries: [],
            error: error.message || connectionErrorMessage,
            phase: 'error'
          });
        }
      }
    }

    refreshEntries();
    const unsubscribe = repository.subscribe(refreshEntries);

    return () => {
      active = false;
      unsubscribe();
    };
  }, [repository]);

  const submitEntry = React.useCallback(
    async input => {
      setGuestbookState(currentState => ({
        ...currentState,
        error: null,
        phase: 'sending'
      }));

      try {
        const entry = await repository.createEntry(input);
        const result = await repository.listEntries();

        setGuestbookState({
          entries: result.entries,
          error: result.error,
          phase: 'saved'
        });

        return { entry, success: true };
      } catch (error) {
        setGuestbookState(currentState => ({
          ...currentState,
          error: error.message || connectionErrorMessage,
          phase: 'error'
        }));

        return { entry: null, success: false };
      }
    },
    [repository]
  );

  return {
    ...guestbookState,
    submitEntry
  };
}
