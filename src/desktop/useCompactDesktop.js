import { useEffect, useState } from 'react';

const COMPACT_DESKTOP_QUERY = '(max-width: 768px), (pointer: coarse)';

function getInitialValue() {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia(COMPACT_DESKTOP_QUERY).matches
    : false;
}

export default function useCompactDesktop() {
  const [compact, setCompact] = useState(getInitialValue);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(COMPACT_DESKTOP_QUERY);
    const updateValue = event => setCompact(event.matches);

    setCompact(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateValue);
      return () => mediaQuery.removeEventListener('change', updateValue);
    }

    mediaQuery.addListener(updateValue);
    return () => mediaQuery.removeListener(updateValue);
  }, []);

  return compact;
}
