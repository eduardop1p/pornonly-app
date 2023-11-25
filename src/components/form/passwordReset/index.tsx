'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormContainer } from '../formContainer/styles';
import Input from './input';
import Loading from '../loading';
import Logo from '../../logo';
import { GlobalSuccessComponent } from '../globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import { GlobalErrorComponent } from '../globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
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
  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();

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
        handleError(jsonResponse.error as string);
        return;
      }
      handleSuccess(jsonResponse.success as string);
      setSuccessSendEmail(true);
    } catch (err) {
      handleError('Erro interno no servidor');
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
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess} />
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
