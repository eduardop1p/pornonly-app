'use client';

import { useContext } from 'react';

import { Container } from './styles';

import { Context } from '@/utils/context/appContext';
import Logo from '../logo';
// import Close from '../close';

export default function Login() {
  const {
    state: { loginActive },
  } = useContext(Context) as any;

  if (!loginActive) return null;

  return (
    <Container>
      <Logo />
      <h1 className="title-login">Bem vind@ a Pornonly</h1>
    </Container>
  );
}
