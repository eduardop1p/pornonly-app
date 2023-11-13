import type { SetStateAction, Dispatch } from 'react';
import { useRef } from 'react';

import { Container } from './styled';

import revalidatePin from '@/services/revalidatePin';
import { MidiaResultsType } from '@/app/page';

interface Props {
  token: string;
  midiaId: string;
  keyUrl: string;
  thumgUrl?: string;
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleError(msg: string): void;
  handleServerSuccess(msg: string): void;
}

export default function AcceptPin({
  token,
  midiaId,
  keyUrl,
  thumgUrl,
  setStResults,
  handleError,
  handleServerSuccess,
  isLoading,
  setIsLoading,
}: Props) {
  const deletePinArr = useRef(
    [{ key: keyUrl, id: midiaId }, { key: thumgUrl }].filter(
      val => typeof val.key !== 'undefined'
    )
  );

  const handleAcceptPin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/accept-midia-pending/${midiaId}`,
        {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        handleError(data.error);
        return;
      }

      await revalidatePin();
      handleServerSuccess('Publicação aceita');
      setStResults(state => state.filter(val => val._id !== midiaId));
    } catch (err) {
      // console.log(err);
      handleError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectPin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API
        }/midia/delete?midiaDelete=${JSON.stringify(
          deletePinArr.current
        )}&sendEmail=true`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        handleError(data.error);
        return;
      }
      // await revalidatePin();
      handleServerSuccess('Publicação rejeitada');
      setStResults(state => state.filter(val => val._id !== midiaId));
    } catch (err) {
      handleError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <button type="button" onClick={() => handleAcceptPin()}>
        Aceitar
      </button>
      <button type="button" onClick={() => handleRejectPin()}>
        Rejeitar
      </button>
    </Container>
  );
}
