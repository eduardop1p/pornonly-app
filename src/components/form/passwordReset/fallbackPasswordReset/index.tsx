import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';

import { Container } from './styled';

export default function FallbackPassworReset({
  email,
  setSuccessSendEmail,
}: {
  email: string;
  setSuccessSendEmail: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Container onClick={() => setSuccessSendEmail(state => !state)}>
      <div
        className="container-info"
        onClick={event => event.stopPropagation()}
      >
        <p>
          Foi enviado um email para <span>{email}</span> com instruções pra você
          acessar sua conta
        </p>
        <p>Deseja ir para tela inicial ou fazer login?</p>
        <div>
          <button type="button" onClick={() => router.push('/')}>
            Home
          </button>
          <button type="button" onClick={() => router.push('/login')}>
            Login
          </button>
        </div>
      </div>
    </Container>
  );
}
