'use client';

import { useState, useRef } from 'react';

export default function useGlobalError() {
  const [msgError, setMsgError] = useState<string | undefined>(undefined);

  let timeId = useRef<NodeJS.Timeout>();

  const handleError = (msg: string) => {
    if (typeof timeId.current === 'number') return;
    setMsgError(msg);
    timeId.current = setTimeout(() => {
      setMsgError(undefined);
      clearTimeout(timeId.current);
      timeId.current = undefined;
    }, 4000);
  };

  return { msgError, handleError };
}
