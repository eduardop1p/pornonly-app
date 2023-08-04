/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import contains from 'validator/lib/contains';

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
    const username = body.username.trim();
    const email = body.email.trim();
    const password = body.password.trim();
    const repeatPassword = body.repeatPassword.trim();
    let controllerError = true;

    if (username.length < 4 || username.length > 15) {
      setError('username', {
        message: 'Usuário deve ter ao menos 4 caracteres e no máximo 15.',
      });
      controllerError = false;
    }

    if (!isAlphanumeric(username)) {
      setError('username', {
        message: 'Usuário deve conter apenas letras e números.',
      });
      controllerError = false;
    }

    if (!isEmail(email)) {
      setError('email', { message: 'E-mail inválido.' });
      controllerError = false;
    }

    if (password !== repeatPassword) {
      setError('password', { message: 'As senhas não se coincidem.' });
      controllerError = false;
    }

    if (password.length < 5 || password.length > 20) {
      setError('password', {
        message: 'Senha deve ter ao menos 5 caracteres e no máximo 20.',
      });
      controllerError = false;
    }

    const rgPassword = /[!@#$%^&*(),.?":{}|<>]/;
    if (!rgPassword.test(password)) {
      setError('password', {
        message: 'Senha deve ter ao menos 1 caractere especial ex: @#$!*&%^.',
      });
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
