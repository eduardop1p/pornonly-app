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
        <div style={{ marginTop: '10px', fontSize: '1rem' }}>
          Houve um erro inesperado na aplicação {':('}
        </div>
        {/* <button onClick={() => reset()}>Try again</button> */}
      </body>
    </html>
  );
}
