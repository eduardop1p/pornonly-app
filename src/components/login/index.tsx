/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loadingClient';

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
      const data = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      console.log(await data.json());
    } catch (err) {
      console.error(err);
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
          errorMsg={errors.email?.message}
        />
        <Input
          id="password"
          label="Senha"
          name="password"
          placeholder="Senha"
          type={passwordType}
          required={true}
          register={register}
          errorMsg={errors.password?.message}
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
