'use client';
import { useEffect, useRef } from 'react';

export default function HomeClient() {
  const bootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Cursor glow ──
    const glow = cursorRef.current;
    if (glow) {
      const onMove = (e: MouseEvent) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
      };
      window.addEventListener('mousemove', onMove);
    }

    // ── Boot sequence ──
    const boot = bootRef.current;
    if (!boot) return;

    const lines = [
      ['dim', '> initialising duc-than.dev...'],
      ['ok', '[OK] personality.json loaded'],
      ['ok', '[OK] backend_experience: 4yrs mounted'],
      ['ok', '[OK] rag_pipeline.py compiled'],
      ['dim', '> starting portfolio server...'],
    ];

    const feed = boot.querySelector('.boot-feed') as HTMLElement;
    const bar = boot.querySelector('.boot-bar i') as HTMLElement;

    let delay = 0;
    lines.forEach((line) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'boot-line';
        el.innerHTML = `<span class="${line[0]}">${line[1]}</span>`;
        feed.appendChild(el);
      }, delay);
      delay += 340;
    });

    setTimeout(() => {
      if (bar) bar.style.width = '100%';
    }, delay);

    setTimeout(() => {
      boot.classList.add('done');
      document.body.classList.remove('booting');

      // ── Reveal on scroll ──
      const reveals = document.querySelectorAll<HTMLElement>('.reveal');
      const io = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
        { threshold: 0.1 }
      );
      reveals.forEach(el => io.observe(el));

      // ── Counter animation ──
      const counters = document.querySelectorAll<HTMLElement>('[data-count]');
      const counterIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count!);
          const dec = parseInt(el.dataset.dec ?? '0', 10);
          const duration = 1500;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target * ease).toFixed(dec);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterIo.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(el => counterIo.observe(el));

      // ── Typewriter ──
      const tw = document.querySelector<HTMLElement>('[data-typewriter]');
      if (tw) {
        const roles: string[] = JSON.parse(tw.dataset.typewriter!);
        const text = tw.querySelector('.tw-text') as HTMLElement;
        let ri = 0, ci = 0, deleting = false;
        const tick = () => {
          const current = roles[ri];
          if (deleting) {
            text.textContent = current.slice(0, --ci);
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
            setTimeout(tick, 60);
          } else {
            text.textContent = current.slice(0, ++ci);
            if (ci === current.length) { deleting = true; setTimeout(tick, 2200); return; }
            setTimeout(tick, 90);
          }
        };
        tick();
      }

      // ── Nav scrolled state ──
      const nav = document.querySelector('.nav');
      const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });

      // ── Nav mobile toggle ──
      const toggle = document.querySelector('.nav-toggle');
      const navLinks = document.querySelector('.nav-links');
      toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

    }, delay + 800);

    return () => {
      if (glow) window.removeEventListener('mousemove', () => {});
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
