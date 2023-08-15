/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/navigation';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loadingClient';
import { GlobalErrorClient as GlobalError } from '../globalErrorClient';

import Logo from '../logo';
import Input from './input';
import ShowPassword from '../showPassword';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';

export interface BodyLogin {
  email: string;
  password: string;
}

export default function Login() {
  const redirect = useRouter();
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyLogin>();

  const handleFormSubmit: SubmitHandler<BodyLogin> = async (body, event) => {
    event?.preventDefault();
    if (isLoading) return;

    const email = body.email.trim();
    const password = body.password.trim();
    let controllerError = true;

    if (!isEmail(email)) {
      setError('email', { message: 'E-mail inválido.' });
      controllerError = false;
    }

    if (!controllerError) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        credentials: 'include', // para setar os cookies no server tenho que colocar credentials: 'include'
      });
      const jsonResponse = await response.json();
      if (!response.ok) {
        if (jsonResponse.type === 'server') {
          handleServerError(jsonResponse.error as string);
          return;
        }
        setError(jsonResponse.type, { message: jsonResponse.error });
        return;
      }
      redirect.refresh(); // usar redirect.refresh() para atualizar os estados do react no client, esse refresh não irar carregar a pagina
      redirect.push('/');
    } catch (err) {
      handleServerError('Erro interno no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickPasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <FormContainer>
      <Logo />
      {isLoading && <Loading />}
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
      <h1 className="title-login">Bem vind@ a Pornonly</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          id="email"
          label="E-mail"
          name="email"
          placeholder="E-mail"
          type="email"
          required={true}
          register={register}
          errors={{ message: errors.email?.message, classError: errors.email }}
        />
        <Input
          id="password"
          label="Senha"
          name="password"
          placeholder="Senha"
          type={passwordType}
          required={true}
          register={register}
          errors={{
            message: errors.password?.message,
            classError: errors.password,
          }}
        >
          {
            <ShowPassword
              onClickCustom={handleClickPasswordType}
              passwordType={passwordType}
            />
          }
        </Input>
        <Link href="/password/reset">Esqueceu sua senha?</Link>
        <button className="login" type="submit">
          Login
        </button>
      </form>
      <span className="create-account-title">
        Ainda não tem uma conta?
        <Link href="/create-account">Criar conta</Link>
      </span>
    </FormContainer>
  );
}
