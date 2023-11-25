/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { FormContainer } from '../formContainer/styles';
import Loading from '../loading';
import { GlobalErrorComponent } from '../globalErrorComponent';
import Logo from '../../logo';
import Input from './input';
import ShowPassword from '../showPassword';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '../globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import useGlobalContext from '@/utils/useGlobalContext';
import { dataFailure } from '@/utils/appContextUser/actions';

const ZodLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email não pode está vazio.')
    .email('Email inválido.'),
  password: z.string().trim().nonempty('Digite sua senha pra fazer login.'),
});

// z.infer vai pegar toda a tipagem do nosso scheme setado no zod acima que é o nosso ZodLoginSchema
export type BodyLogin = z.infer<typeof ZodLoginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();
  const { state, dispatch } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<BodyLogin>({ resolver: zodResolver(ZodLoginSchema) });

  useEffect(() => {
    state.email && handleSuccess('Faça o login pra poder continuar');
    return () => dispatch(dataFailure());
  }, [state, handleSuccess, dispatch, searchParams]);

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
          handleError(jsonResponse.error as string);
          return;
        }
        setError(jsonResponse.type, { message: jsonResponse.error });
        return;
      }
      router.refresh(); // usar router.refresh() para atualizar os estados do react no client, esse refresh não irar carregar a pagina
      const from = searchParams.get('from');
      from ? router.push(from as string) : router.push('/');
    } catch (err) {
      handleError('Erro interno no servidor');
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
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess} />
      <h1 className="title-login">Bem vind@ a Pornonly</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          value={state.email}
          id="email"
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
          register={register}
          errors={{ message: errors.email?.message, classError: errors.email }}
        />
        <Input
          value={state.password}
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
