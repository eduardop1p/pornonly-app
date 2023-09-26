/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  // useEffect(() => {
  //   console.log(error);
  // }, [error]);

  return (
    <html>
      <body style={{ textAlign: 'center' }}>
        <title>Pornonly</title>
        <div style={{ marginTop: '10px', fontSize: '1rem' }}>
          Houve um erro inesperado na aplicação {':('}
        </div>
        <button onClick={() => router.refresh()}>Tentar novalmente</button>
      </body>
    </html>
  );
}
