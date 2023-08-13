/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loadingClient';
import { GlobalErrorClient as GlobalError } from '../globalErrorClient';

import Logo from '../logo';
import Input from './input';
import ShowPassword from '../showPassword';

export interface BodyLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [msgGlobalError, setMsgGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyLogin>();

  const handleFormSubmit: SubmitHandler<BodyLogin> = async body => {
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
          handleServerError();
          return;
        }
        setError(jsonResponse.type, { message: jsonResponse.error });
        return;
      }
      console.log('user logado.');
    } catch (err) {
      handleServerError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickPasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleServerError = () => {
    setShowGlobalError(true);
    setMsgGlobalError('Erro interno no servidor.');
    setTimeout(() => setShowGlobalError(false), 3000);
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
