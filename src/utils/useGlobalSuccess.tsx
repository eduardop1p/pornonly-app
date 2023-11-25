'use client';

import { useState, useRef } from 'react';

export default function useGlobalSuccess() {
  const [msgSuccess, setMsgSuccess] = useState<string | undefined>(undefined);

  let timeId = useRef<NodeJS.Timeout>();

  const handleSuccess = (msg: string) => {
    if (typeof timeId.current === 'number') return;
    setMsgSuccess(msg);
    timeId.current = setTimeout(() => {
      setMsgSuccess(undefined);
      clearTimeout(timeId.current);
      timeId.current = undefined;
    }, 4000);
  };

  return { msgSuccess, handleSuccess };
}
