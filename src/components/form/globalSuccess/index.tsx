'use client';

import { ReactNode } from 'react';

import { Container } from './styled';

export function GlobalSuccess({
  successMsg,
  showSuccess,
  children,
}: {
  successMsg?: string;
  showSuccess?: boolean;
  children?: ReactNode;
}) {
  return (
    <Container data-show-error={showSuccess}>
      {children}
      <span>{successMsg}</span>
    </Container>
  );
}
