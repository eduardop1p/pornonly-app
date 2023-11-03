'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormContainer } from '../formContainer/styles';
import Input from './input';
import Loading from '../loading';
import Logo from '../../logo';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';
import { GlobalSuccess } from '../globalSuccess';
import { GlobalError } from '../globalError';
import FallbackPassworReset from './fallbackPasswordReset';

const ZodLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('E-mail não pode está vazio.')
    .email('E-mail inválido.'),
});

export type BodyPasswordReset = z.infer<typeof ZodLoginSchema>;

export default function PasswordReset() {
  const [successSendEmail, setSuccessSendEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();
  const { handleServerSuccess, showGlobalSuccess, msgGlobalSuccess } =
    useGlobalSuccessTime();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<BodyPasswordReset>({ resolver: zodResolver(ZodLoginSchema) });

  const handleFormSubmit: SubmitHandler<BodyPasswordReset> = async (
    body,
    event
  ) => {
    event?.preventDefault();
    if (isLoading) return;
    const { email } = body;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/password-reset`,
        {
          method: 'POST',
          body: JSON.stringify({ email }),
          // para aplicações post json tenho q colocar headers 'Content-Type': 'application/json'
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        }
      );
      const jsonResponse = await response.json();
      if (!response.ok) {
        handleServerError(jsonResponse.error as string);
        return;
      }
      handleServerSuccess(jsonResponse.success as string);
      setSuccessSendEmail(true);
    } catch (err) {
      handleServerError('Erro interno no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Logo />
      {successSendEmail && (
        <FallbackPassworReset
          email={getValues('email')}
          setSuccessSendEmail={setSuccessSendEmail}
        />
      )}
      {isLoading && <Loading />}
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
      <GlobalSuccess
        successMsg={msgGlobalSuccess}
        showSuccess={showGlobalSuccess}
      />
      <h1 className="title-password-reset">Vamos encontrar sua conta</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          value={watch('email')}
          id="email"
          label="Insira seu email"
          name="email"
          placeholder="Email"
          type="email"
          register={register}
          errors={{ message: errors.email?.message, classError: errors.email }}
        />
        <button className="password-reset" type="submit">
          Enviar
        </button>
      </form>
    </FormContainer>
  );
}