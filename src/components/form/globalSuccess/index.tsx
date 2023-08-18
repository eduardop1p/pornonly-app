'use client';

import { Container } from './styled';

export function GlobalSuccess({
  errorMsg,
  showError,
}: {
  errorMsg?: string;
  showError?: boolean;
}) {
  return (
    <Container data-show-error={showError}>
      <span>{errorMsg}</span>
    </Container>
  );
}
