import { useEffect, useState } from 'react';

export default function HeaderSpacer() {
  const [height, setHeight] = useState(160);

  useEffect(() => {
    function measure() {
      const header = document.querySelector('header');
      if (!header) return;
      const rect = header.getBoundingClientRect();
      if (rect.bottom > 0) {
        setHeight(rect.bottom);
      }
    }

    measure();

    const header = document.querySelector('header');
    let resizeObserver: ResizeObserver | null = null;
    if (header) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(header);
    }

    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });

    const timers = [
      setTimeout(measure, 100),
      setTimeout(measure, 300),
      setTimeout(measure, 600),
      setTimeout(measure, 1000),
    ];

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      timers.forEach(clearTimeout);
    };
  }, []);

  return <div style={{ height }} aria-hidden="true" />;
}
