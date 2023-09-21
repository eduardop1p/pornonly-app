'use client';

import { ReactNode } from 'react';

import { Container } from './styled';

export default function AddComments({ children }: { children: ReactNode }) {
  return (
    <Container>
      {children}
      <input value="meu comment" />
    </Container>
  );
}
