/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';

import Header from '@/components/header';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ textAlign: 'center' }}>
        <title>Pornonly</title>
        <div style={{ marginTop: '10px', fontSize: '1rem', color: '#111' }}>
          Houve um erro inesperado na aplicação {':('}
        </div>
        <button
          onClick={() => {
            reset();
          }}
          style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            color: '#111',
            fontWeight: 400,
            fontSize: '1rem',
            padding: '8px 1rem',
            cursor: 'pointer',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          Tentar novalmente
        </button>
      </body>
    </html>
  );
}
