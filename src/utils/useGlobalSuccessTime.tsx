'use client';

import { useState, useEffect } from 'react';

export default function useGlobalSuccessTime() {
  const [showGlobalSuccess, setShowGlobalSuccess] = useState(false);
  const [msgGlobalSuccess, setMsgGlobalError] = useState('');
  const [timiOutId, setTimiOutId] = useState<any>(null);

  useEffect(() => {
    return () => clearTimeout(timiOutId);
  }, [timiOutId]);

  const handleServerSuccess = (msg: string) => {
    setShowGlobalSuccess(true);
    setMsgGlobalError(msg);
    const id = setTimeout(() => setShowGlobalSuccess(false), 3000);
    setTimiOutId(id);
  };

  return { showGlobalSuccess, msgGlobalSuccess, handleServerSuccess };
}
