'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const SHOW_DELAY = 150;   // don't show the bar for near-instant navs
const TRICKLE_CAP = 0.9;  // trickle stalls at 90% until the route commits
const FAILSAFE_MS = 10000;

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  const running = useRef(false);
  const prog = useRef(0);
  const raf = useRef<number | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trickle = useCallback(() => {
    prog.current += (TRICKLE_CAP - prog.current) * 0.06;
    setProgress(prog.current);
    if (running.current) raf.current = requestAnimationFrame(trickle);
  }, []);

  const done = useCallback(() => {
    if (!running.current) return;
    running.current = false;
    if (raf.current) cancelAnimationFrame(raf.current);
    if (showTimer.current) clearTimeout(showTimer.current);
    if (failsafe.current) clearTimeout(failsafe.current);
    prog.current = 1;
    setProgress(1);
    setTimeout(() => {
      setActive(false);
      setTimeout(() => { prog.current = 0; setProgress(0); }, 250);
    }, 180);
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    prog.current = 0;
    setProgress(0);
    showTimer.current = setTimeout(() => {
      setActive(true);
      raf.current = requestAnimationFrame(trickle);
    }, SHOW_DELAY);
    failsafe.current = setTimeout(() => done(), FAILSAFE_MS);
  }, [trickle, done]);

  // START: only for navigations that change the pathname
  useEffect(() => {
    const origPush = window.history.pushState;
    window.history.pushState = function (...args: Parameters<typeof origPush>) {
      try {
        const url = args[2];
        if (url) {
          const next = new URL(url.toString(), window.location.href);
          if (next.pathname !== window.location.pathname) start();
        }
      } catch {}
      return origPush.apply(this, args);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      try {
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return; // same page / filter change
        start();
      } catch {}
    };
    document.addEventListener('click', onClick, true);
    const onPop = () => start();
    window.addEventListener('popstate', onPop);

    return () => {
      window.history.pushState = origPush;
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPop);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (showTimer.current) clearTimeout(showTimer.current);
      if (failsafe.current) clearTimeout(failsafe.current);
    };
  }, [start]);

  // COMPLETE: route committed (pathname changed)
  useEffect(() => { done(); }, [pathname, done]);

  const pct = Math.min(100, Math.max(0, progress * 100));

  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 2147483000, pointerEvents: 'none', opacity: active ? 1 : 0, transition: 'opacity .25s ease' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#635BFF,#FF7A59)', boxShadow: '0 0 10px rgba(99,91,255,.5)', borderRadius: '0 2px 2px 0', transition: 'width .18s ease' }} />
      <div style={{ position: 'absolute', top: 2, left: `${pct}%`, transform: 'translateX(-50%)', transition: 'left .18s ease' }}>
        {/* delete this <svg> for a clean gradient bar with no truck */}
        <svg viewBox="0 0 32 20" width="30" height="19" aria-hidden="true">
          <rect x="1" y="4" width="17" height="10" rx="1.5" fill="#0c1e3e" />
          <rect x="2.5" y="8" width="14" height="1.6" fill="#FF7A59" />
          <path d="M18 6.5h5l3 3.2V14h-8z" fill="#635BFF" />
          <rect x="19.5" y="7.6" width="3.6" height="3" rx="0.5" fill="#cfe3ff" />
          <circle cx="7" cy="15" r="2.6" fill="#0c1e3e" /><circle cx="7" cy="15" r="1" fill="#FBFAF8" />
          <circle cx="22" cy="15" r="2.6" fill="#0c1e3e" /><circle cx="22" cy="15" r="1" fill="#FBFAF8" />
        </svg>
      </div>
    </div>
  );
}
