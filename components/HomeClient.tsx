'use client';
import { useEffect, useRef } from 'react';

const BOOT_LINES: [string, string][] = [
  ['dim', '> initialising duc-than.dev...'],
  ['ok', '[OK] personality.json loaded'],
  ['ok', '[OK] backend_experience: 4yrs mounted'],
  ['ok', '[OK] rag_pipeline.py compiled'],
  ['dim', '> starting portfolio server...'],
];

const BOOT_LINE_GAP = 340;
const BOOT_HOLD = 800;

export default function HomeClient() {
  const bootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observers: IntersectionObserver[] = [];
    let twTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    // ── Cursor glow ──
    const glow = cursorRef.current;
    const onMove = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove);

    // ── Boot sequence ──
    const boot = bootRef.current;
    const feed = boot?.querySelector<HTMLElement>('.boot-feed');
    const bar = boot?.querySelector<HTMLElement>('.boot-bar i');

    let delay = 0;
    BOOT_LINES.forEach(([tone, text]) => {
      timeouts.push(setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'boot-line';
        const span = document.createElement('span');
        span.className = tone;
        span.textContent = text;
        line.appendChild(span);
        feed?.appendChild(line);
      }, delay));
      delay += BOOT_LINE_GAP;
    });

    timeouts.push(setTimeout(() => {
      if (bar) bar.style.width = '100%';
    }, delay));

    timeouts.push(setTimeout(() => {
      if (cancelled) return;
      boot?.classList.add('done');

      // ── Reveal on scroll ──
      const revealIo = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
        { threshold: 0.1 }
      );
      observers.push(revealIo);
      document.querySelectorAll<HTMLElement>('.reveal').forEach(el => revealIo.observe(el));

      // ── Counter animation ──
      const counterIo = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count ?? '0');
          const dec = parseInt(el.dataset.dec ?? '0', 10);
          const duration = 1500;
          const start = performance.now();
          const tick = (now: number) => {
            if (cancelled) return;
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * ease).toFixed(dec);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterIo.unobserve(el);
        });
      }, { threshold: 0.5 });
      observers.push(counterIo);
      document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => counterIo.observe(el));

      // ── Typewriter ──
      const tw = document.querySelector<HTMLElement>('[data-typewriter]');
      const text = tw?.querySelector<HTMLElement>('.tw-text');
      if (!tw || !text) return;

      let roles: string[];
      try {
        roles = JSON.parse(tw.dataset.typewriter ?? '[]');
      } catch {
        return;
      }
      if (!roles.length) return;

      let ri = 0, ci = 0, deleting = false;
      const type = () => {
        if (cancelled) return;
        const current = roles[ri];
        if (deleting) {
          text.textContent = current.slice(0, --ci);
          if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
          twTimer = setTimeout(type, 60);
        } else {
          text.textContent = current.slice(0, ++ci);
          if (ci === current.length) {
            deleting = true;
            twTimer = setTimeout(type, 2200);
            return;
          }
          twTimer = setTimeout(type, 90);
        }
      };
      type();
    }, delay + BOOT_HOLD));

    return () => {
      cancelled = true;
      window.removeEventListener('mousemove', onMove);
      timeouts.forEach(clearTimeout);
      if (twTimer) clearTimeout(twTimer);
      observers.forEach(io => io.disconnect());
    };
  }, []);

  return (
    <>
      <div className="cursor-glow" ref={cursorRef} />
      <div className="boot" ref={bootRef}>
        <div className="boot-inner">
          <div className="boot-feed" />
          <div className="boot-bar"><i /></div>
        </div>
      </div>
    </>
  );
}
