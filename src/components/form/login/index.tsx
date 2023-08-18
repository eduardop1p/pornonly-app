/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loading';
import { GlobalError } from '../globalError';
import Logo from '../../logo';
import Input from './input';
import ShowPassword from '../showPassword';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalContext from '@/utils/useGlobalContext';
import { dataFailure, dataSuccess } from '@/utils/appContextUser/actions';

const ZodLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('E-mail não pode está vazio.')
    .email('E-mail inválido.'),
  password: z.string().trim().nonempty('Digite sua senha pra fazer login.'),
});

// z.infer vai pegar toda a tipagem do nosso scheme setado no zod acima que é o nosso ZodLoginSchema
export type BodyLogin = z.infer<typeof ZodLoginSchema>;

export default function Login() {
  const redirect = useRouter();
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();
  const { state, dispatch } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyLogin>({ resolver: zodResolver(ZodLoginSchema) });

  useEffect(() => {
    console.log(state);
    // dispatch(dataSuccess({ email: 'any', password: '123' }));
  }, [state]);

  const handleFormSubmit: SubmitHandler<BodyLogin> = async (body, event) => {
    event?.preventDefault();
    if (isLoading) return;
    const { email, password } = body;

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
