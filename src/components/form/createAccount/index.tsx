/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import styles from './styles.module.css';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loading';
import { GlobalError } from '../globalError';
import Logo from '../../logo';
import Input from './input';
import ShowPassword from '../showPassword';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalContext from '@/utils/useGlobalContext';
import { dataSuccess } from '@/utils/appContextUser/actions';

const ZodCreateAccountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .superRefine((val, ctx) => {
        if (!val.match(/^[a-z0-9-_]*$/)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Nome de usuário deve conter apenas: letras minusculas, números e espaços com ( - ou _ ).',
          });
        }
        if (val.length < 4 || val.length > 15) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Usuário deve ter ao menos 4 caracteres e no máximo 15.',
          });
        }
      }),
    email: z
      .string()
      .trim()
      .nonempty('E-mail não pode está vazio.')
      .email('E-mail inválido.'),
    password: z.string().superRefine((val, ctx) => {
      if (val.length < 5 || val.length > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve ter ao menos 5 caracteres e no máximo 20.',
        });
      }

      const rgx = /[!@#$%^&*(),.?":{}|<>]/;
      if (!rgx.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Senha deve ter ao menos 1 desses caracteres especiais: @#$!*&%^.',
        });
      }
    }),
    repeatPassword: z.string().trim(),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: 'As senhas não se coincidem.',
    path: ['repeatPassword'],
  });

export type BodyCreateAccount = z.infer<typeof ZodCreateAccountSchema>;

export default function CreateAccount() {
  const redirect = useRouter();
  const { dispatch } = useGlobalContext();

  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyCreateAccount>({
    resolver: zodResolver(ZodCreateAccountSchema),
  });

  const handleFormSubmit: SubmitHandler<BodyCreateAccount> = async (
    body,
    event
  ) => {
    event?.preventDefault();
    if (isLoading) return;
    const { username, email, password, repeatPassword } = body;

    try {
      setIsLoading(true);
      const resCreateUser = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/users`,
        {
          method: 'POST',
          body: JSON.stringify({ username, email, password, repeatPassword }),
          // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        }
      );
      const jsonResCreateUser = await resCreateUser.json();
      if (!resCreateUser.ok) {
        if (jsonResCreateUser.type === 'server') {
          handleServerError(jsonResCreateUser.error as string);
          return;
        }
        setError(jsonResCreateUser.type, { message: jsonResCreateUser.error });
        return;
      }
      const resLogin = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        credentials: 'include', // para setar os cookies no server tenho que colocar credentials: 'include'
      });
      if (!resLogin.ok) {
        dispatch(dataSuccess({ email, password }));
        redirect.push('/login');
        return;
      }
      redirect.refresh();
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
      <p className={styles.param}>
        Crie uma conta grátes e aproveite o máximo do nosso site
      </p>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          id="username"
          label="Usuário"
          name="username"
          placeholder="Nome de usuário"
          type="text"
          register={register}
          errors={{
            message: errors.username?.message,
            classError: errors.username,
          }}
        />
        <Input
          id="email"
          label="E-mail"
          name="email"
          placeholder="E-mail"
          type="email"
          register={register}
          errors={{ message: errors.email?.message, classError: errors.email }}
        />
        <Input
          id="password"
          label="Senha"
          name="password"
          placeholder="Senha"
          type={passwordType}
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
        <Input
          id="repeatPassword"
          label="Repetir senha"
          name="repeatPassword"
          placeholder="Repetir senha"
          type={passwordType}
          register={register}
          errors={{
            message: errors.repeatPassword?.message,
            classError: errors.repeatPassword,
          }}
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
