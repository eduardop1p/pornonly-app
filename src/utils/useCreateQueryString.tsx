'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function useCreateQueryString() {
  const searchParams = useSearchParams() as any;

  const handleCreateQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return { handleCreateQueryString };
}
