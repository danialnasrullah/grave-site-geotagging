import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

// Returns true when the viewport matches the mobile breakpoint. Tracks changes
// (resize / orientation) via matchMedia so the UI swaps views live.
export function useIsMobile() {
  const getMatch = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(MOBILE_QUERY).matches;
  };

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mql = window.matchMedia(MOBILE_QUERY);
    const handler = () => setIsMobile(mql.matches);

    // Primary: matchMedia change (fires on resize/orientation in real
    // browsers). addEventListener is modern; addListener is the deprecated
    // fallback for older Safari/Edge.
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
    } else {
      mql.addListener(handler);
    }

    // Fallback: some environments don't dispatch matchMedia 'change' on
    // programmatic viewport changes, so also re-evaluate on window resize.
    window.addEventListener('resize', handler);

    // Sync once in case the viewport changed between render and effect.
    setIsMobile(mql.matches);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler);
      } else {
        mql.removeListener(handler);
      }
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isMobile;
}
