/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';

import { FormContainer } from '../formContainer/styles';

import Logo from '../logo';
import Input from './input';
import ShowPassword from '../showPassword';

export interface BodyLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [passwordType, setPasswordType] = useState('password');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyLogin>();

  const handleFormSubmit: SubmitHandler<BodyLogin> = body => {
    const email = body.email.trim();
    const password = body.password.trim();
    let controllerError = true;

    if (!isEmail(email)) {
      setError('email', { message: 'E-mail inválido.' });
      controllerError = false;
    }

    if (!controllerError) return;
    console.log(body);

    // back-end errors
  };

  const handleClickPasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <FormContainer>
      <Logo />
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
          errors={errors}
        />
        <Input
          id="password"
          label="Senha"
          name="password"
          placeholder="Senha"
          type={passwordType}
          required={true}
          register={register}
          errors={errors}
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
