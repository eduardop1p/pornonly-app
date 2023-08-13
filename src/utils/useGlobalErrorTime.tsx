'use client';

import { useState, useEffect } from 'react';

export default function useGlobalErrorTime() {
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [msgGlobalError, setMsgGlobalError] = useState('');
  const [timiOutId, setTimiOutId] = useState<any>(null);

  useEffect(() => {
    return () => clearTimeout(timiOutId);
  }, [timiOutId]);

  const handleServerError = (msg: string) => {
    setShowGlobalError(true);
    setMsgGlobalError(msg);
    const id = setTimeout(() => setShowGlobalError(false), 3000);
    setTimiOutId(id);
  };

  return { showGlobalError, msgGlobalError, handleServerError };
}
