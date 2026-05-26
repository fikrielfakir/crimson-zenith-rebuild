import { useEffect, useRef, useState } from 'react';

export default function HeaderSpacer() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    function measure() {
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(header);
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const totalHeight = rect.height + marginTop;
      setHeight(totalHeight > 0 ? totalHeight : rect.bottom);
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);

    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return <div style={{ height }} aria-hidden="true" />;
}
