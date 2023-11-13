'use client';

import { useState } from 'react';

export default function useGlobalError() {
  const [msgError, setMsgError] = useState<string | undefined>(undefined);

  const handleError = (msg: string) => {
    setMsgError(msg);
    setTimeout(() => {
      setMsgError(undefined);
    }, 10);
  };

  return { msgError, handleError };
}
