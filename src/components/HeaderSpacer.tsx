import { useEffect, useRef, useState } from 'react';

export default function HeaderSpacer() {
  const [height, setHeight] = useState(220);

  useEffect(() => {
    function measure() {
      const header = document.querySelector('header');
      if (header) {
        const rect = header.getBoundingClientRect();
        setHeight(rect.bottom > 0 ? rect.bottom : rect.height);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    const id = setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(id);
    };
  }, []);

  return <div style={{ height }} aria-hidden="true" />;
}
