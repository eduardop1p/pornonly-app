'use client';

import { ReactNode } from 'react';

import { Container } from './styled';

export function GlobalSuccess({
  successMsg,
  showSuccess,
  children,
  midiaType,
}: {
  successMsg?: string;
  showSuccess?: boolean;
  children?: ReactNode;
  midiaType?: 'video' | 'img' | 'gif';
}) {
  return (
    <Container data-show-success={showSuccess} $midiaType={midiaType}>
      {children}
      <span>{successMsg}</span>
    </Container>
  );
}
