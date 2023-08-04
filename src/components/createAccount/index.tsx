/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';

import styles from './styles.module.css';
import { FormContainer } from '../formContainer/styles';

import Logo from '../logo';
import Input from './input';
import ShowPassword from '../showPassword';

export interface BodyCreateAccount {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function CreateAccount() {
  const [passwordType, setPasswordType] = useState('password');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyCreateAccount>();

  const handleFormSubmit: SubmitHandler<BodyCreateAccount> = body => {
    const { username, email, password, repeatPassword } = body;
    let controllerError = true;

    if (password !== repeatPassword) {
      setError('password', { message: 'As senhas não se coincidem.' });
      controllerError = false;
    }

    if (!isEmail(email)) {
      setError('email', { message: 'E-mail inválido.' });
      controllerError = false;
    }

    if (!controllerError) return;
    console.log(body);
  };

  const handleClickPasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <FormContainer>
      <Logo />
      <h1 className="title-login">Bem vind@ a Pornonly</h1>
      <p className={styles.param}>
        Crie uma conta aqui grátes e aproveite o máximo do nosso site
      </p>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          id="username"
          label="Usuário"
          name="username"
          placeholder="Nome de usuário"
          type="text"
          required={true}
          register={register}
          errors={errors}
        />
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
        <Input
          id="repeatPassword"
          label="Repetir senha"
          name="repeatPassword"
          placeholder="Repetir senha"
          type={passwordType}
          required={true}
          register={register}
          errors={errors}
        />
        <button className="create-account" type="submit">
          Criar
        </button>
      </form>
      <span className="login-title">
        Já tem tem uma conta?
        <Link href="/login">Login</Link>
      </span>
    </FormContainer>
  );
}
