'use client';

import { useContext } from 'react';

import { Container } from './styles';

import { Context } from '@/utils/context/appContext';

export default function Register() {
  const {
    state: { registerActive },
  } = useContext(Context) as any;
  if (!registerActive) return null;

  return (
    <Container>
      <h1>Register</h1>
    </Container>
  );
}
