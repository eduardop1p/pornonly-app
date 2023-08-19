'use client';

import { ReactNode } from 'react';

import { Container } from './styled';

export function GlobalSuccess({
  errorMsg,
  showError,
  children,
}: {
  errorMsg?: string;
  showError?: boolean;
  children?: ReactNode;
}) {
  return (
    <Container data-show-error={showError}>
      {children}
      <span>{errorMsg}</span>
    </Container>
  );
}
