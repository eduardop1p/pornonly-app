/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // useEffect(() => {
  //   console.log(error);
  // }, [error]);

  return (
    <html>
      <body style={{ textAlign: 'center' }}>
        <title>Pornonly</title>
        <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
          Erro interno na aplicação {':('}
        </div>
        {/* <button onClick={() => reset()}>Try again</button> */}
      </body>
    </html>
  );
}
