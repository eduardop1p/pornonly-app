'use client';

import { useState } from 'react';

export default function useGlobalSuccess() {
  const [msgSuccess, setMsgSuccess] = useState<string | undefined>(undefined);

  const handleSuccess = (msg: string) => {
    setMsgSuccess(msg);
    setTimeout(() => {
      setMsgSuccess(undefined);
    }, 10);
  };

  return { msgSuccess, handleSuccess };
}
