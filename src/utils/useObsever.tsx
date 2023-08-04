'use client';

import { useState, useEffect, RefObject } from 'react';

export default function useObsever(
  headerRef: RefObject<HTMLHeadingElement | null>
) {
  const [obseverHeader, setObseverHeader] = useState(true);
  useEffect(() => {
    const obsever = new IntersectionObserver(([entry]) => {
      setObseverHeader(entry.isIntersecting);
    });

    if (headerRef.current) obsever.observe(headerRef.current);

    return () => {
      // eslint-disable-next-line
      if (headerRef.current) obsever.unobserve(headerRef.current);
    };
  }, [headerRef]);

  return [obseverHeader];
}
