'use client';

import { useState, useCallback } from 'react';

export default function useGlobalErrorTime() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [msgGlobalError, setMsgGlobalError] = useState('');

  const handleServerError = useCallback((msg: string) => {
    setShowGlobalError(true);
    setMsgGlobalError(msg);
    setTimeout(() => setShowGlobalError(false), 3000);
  }, []);

  return { showGlobalError, msgGlobalError, handleServerError };
}
