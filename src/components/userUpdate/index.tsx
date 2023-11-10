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
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import { GlobalError } from '../form/globalError';
import FallbackUserUpdate from './fallbackUserUpdate';
import revalidatePin from '@/services/revalidatePin';
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
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();

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
            handleServerError(data.error as string);
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
          handleServerError(dataJson.error);
          setSuccessUserUpdate(false);
          return;
        }
        await revalidatePin();
        router.refresh();
        router.push('/login');
      } catch (err) {
        handleServerError('Erro interno no servidor.');
      } finally {
        setIsLoading(false);
        setSuccessUserUpdate(false);
      }
    },
    [isLoading, handleServerError, router, setError, token]
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
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
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
        <Link href="/" className={pathName === '/' ? 'link-active' : ''}>
          Página inicial
        </Link>
        <Link
          href="/categories"
          className={pathName === '/' ? 'link-active' : ''}
        >
          Categorias
        </Link>
        <Link
          href="/publish-pin"
          className={pathName === '/publish-pin' ? 'link-active' : ''}
        >
          Criar pin
        </Link>
        <Link
          href={`/${currentUsername}`}
          className={pathName === `/${currentUsername}` ? 'link-active' : ''}
        >
          {currentUsername}
        </Link>
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
