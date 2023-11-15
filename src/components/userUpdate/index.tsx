'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import Loading from '../form/loading';
import Input from './input';
import ShowPassword from '../form/showPassword';
import { GlobalErrorToastify } from '../form/globalErrorToastify';
import useGlobalError from '@/utils/useGlobalError';
import FallbackUserUpdate from './fallbackUserUpdate';
import revalidatePin from '@/services/revalidatePin';
import Logout from '../form/logout';

import {
  Container,
  FormContainer,
  ContainerBtns,
  ContainerLinks,
} from './styled';

interface Props {
  currentEmail: string;
  currentUsername: string;
  token: string;
}

const ZodCreateAccountSchema = z
  .object({
    username: z.optional(z.string()).superRefine((val, ctx) => {
      if (!val) return;
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
    email: z.optional(z.string()).superRefine((val, ctx) => {
      if (!val) return;
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email inválido.',
        });
      }
    }),
    password: z.optional(z.string()).superRefine((val, ctx) => {
      if (!val) return;
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

export type BodyUserUpdate = z.infer<typeof ZodCreateAccountSchema>;

export default function UserUpdate({
  currentEmail,
  currentUsername,
  token,
}: Props) {
  const pathName = usePathname();
  const router = useRouter();

  const [sendUserUpdate, setSendUserUpdate] = useState(false);
  const [successUserUdate, setSuccessUserUpdate] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, msgError } = useGlobalError();

  const originalUserData = useRef({
    currentEmail,
    currentUsername,
  });
  let refDisableBtn = useRef(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    clearErrors,
    watch,
  } = useForm<BodyUserUpdate>({
    resolver: zodResolver(ZodCreateAccountSchema),
  });

  const handleGetValues = useCallback(() => {
    return {
      email: getValues('email'),
      username: getValues('username'),
      password: getValues('password'),
      repeatPassword: getValues('repeatPassword'),
    };
  }, [getValues]);

  const watchEmail = watch('email');
  const watchUsername = watch('username');
  const watchPassword = watch('password');
  const watchRepeatPassword = watch('repeatPassword');
  if (
    (watchEmail === originalUserData.current.currentEmail &&
      watchUsername === originalUserData.current.currentUsername &&
      !watchPassword &&
      !watchRepeatPassword) ||
    (typeof watchEmail === 'undefined' && typeof watchUsername === 'undefined')
  ) {
    refDisableBtn.current = true;
  } else {
    refDisableBtn.current = false;
  }

  const handleUserUpdate = useCallback(
    async (body: BodyUserUpdate) => {
      if (isLoading) return;
      const username = body.username?.trim();
      const email = body.email?.trim();
      const password = body.password?.trim();
      const repeatPassword = body.repeatPassword?.trim();

      try {
        setIsLoading(true);
        const resCreateUser = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/users`,
          {
            method: 'PUT',
            body: JSON.stringify({ username, email, password, repeatPassword }),
            // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-cache',
          }
        );
        const data = await resCreateUser.json();
        if (!resCreateUser.ok) {
          if (data.type === 'server') {
            handleError(data.error as string);
            return;
          }
          setError(data.type, { message: data.error });
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/logout`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const dataJson = await res.json();
          handleError(dataJson.error);
          setSuccessUserUpdate(false);
          return;
        }
        await revalidatePin();
        router.refresh();
        router.push('/login');
      } catch (err) {
        handleError('Erro interno no servidor');
      } finally {
        setIsLoading(false);
        setSuccessUserUpdate(false);
      }
    },
    [isLoading, handleError, router, setError, token]
  );

  useEffect(() => {
    if (successUserUdate) {
      setSuccessUserUpdate(false);
      handleUserUpdate(handleGetValues());
    }
  }, [successUserUdate, handleUserUpdate, handleGetValues]);

  const handleClickPasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleResetSendUserUpdate = () => {
    refDisableBtn.current = true;

    setValue('username', originalUserData.current.currentUsername);
    setValue('email', originalUserData.current.currentEmail);
    setValue('password', '');
    setValue('repeatPassword', '');

    clearErrors('username');
    clearErrors('email');
    clearErrors('password');
    clearErrors('repeatPassword');
  };

  const handleFormSubmit: SubmitHandler<BodyUserUpdate> = async (
    body,
    event
  ) => {
    event?.preventDefault();
    setSendUserUpdate(true);
  };

  return (
    <Container>
      {isLoading && <Loading />}
      <GlobalErrorToastify errorMsg={msgError} />
      {sendUserUpdate && (
        <FallbackUserUpdate
          setSendUserUpdate={setSendUserUpdate}
          setSuccessUserUpdate={setSuccessUserUpdate}
        />
      )}
      <ContainerLinks>
        <Link
          href={`/settings/${currentUsername}`}
          className={
            pathName === `/settings/${currentUsername}` ? 'link-active' : ''
          }
        >
          Configurações
        </Link>
        <Link
          href={`/${currentUsername}`}
          className={pathName === `/${currentUsername}` ? 'link-active' : ''}
        >
          {currentUsername}
        </Link>
        <Link href="/privacy-policy" target="_blank">
          Política de privacidade
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Link href="/cookies-policy" target="_blank">
          Política de Cookies
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Link href="/terms-use" target="_blank">
          Termos de Uso
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Link href="/report-bugs" target="_blank">
          Reportar bugs
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Link href="/compliments-improvements" target="_blank">
          Elogios e sugestões de melhorias
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Link href="/request-content-pack" target="_blank">
          Pedir pack de conteúdos
          <svg height="12" width="12" viewBox="0 0 24 24">
            <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
          </svg>
        </Link>
        <Logout />
      </ContainerLinks>
      <FormContainer
        onSubmit={handleSubmit(handleFormSubmit)}
        className="form-user-update"
      >
        <Input
          defaultValue={currentUsername}
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
          defaultValue={currentEmail}
          id="email"
          label="Email"
          name="email"
          placeholder="Email"
          type="email"
          register={register}
          errors={{ message: errors.email?.message, classError: errors.email }}
        />
        <Input
          id="password"
          label="Nova senha"
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
        <ContainerBtns className="container-btns">
          <button
            type="button"
            className={refDisableBtn.current ? 'equal-value' : ''}
            onClick={() => handleResetSendUserUpdate()}
            disabled={refDisableBtn.current}
          >
            Redefinir
          </button>
          <button
            type="submit"
            className={refDisableBtn.current ? 'equal-value' : ''}
            disabled={refDisableBtn.current}
          >
            Salvar
          </button>
        </ContainerBtns>
      </FormContainer>
    </Container>
  );
}
