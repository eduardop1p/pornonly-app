/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, FocusEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

import { Container } from './styled';
import Loading from '../../form/loading';
import { GlobalError } from '@/components/form/globalError';
import { GlobalSuccess } from '@/components/form/globalSuccess';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';

interface Props {
  data: {
    _id: string;
    url: string;
    title: string;
    midiaType?: 'video' | 'img' | 'gif';
    username: string;
    description: string;
  };
  isAuth: boolean;
  token: string;
  isSave: boolean;
}

export default function SaveAndMore({ data, isAuth, token, isSave }: Props) {
  const redirect = useRouter();
  const pathName = usePathname();

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinIsSave, setPinIsSave] = useState(isSave);
  const { handleServerError, msgGlobalError, showGlobalError } =
    useGlobalErrorTime();
  const { handleServerSuccess, msgGlobalSuccess, showGlobalSuccess } =
    useGlobalSuccessTime();

  const refMoreOptions = useRef<HTMLDivElement | null>(null);
  const fileName = data.url.split('/').pop() as string;

  const handleOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!refMoreOptions.current?.contains(event.relatedTarget)) {
      setShowMoreOptions(false);
    }
  };

  const handleDawnload = async () => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = data.url;
    link.download = fileName;
    document.body.appendChild(link);
    link.target = '_blank';
    link.click(); // link.click() vai simular um click no meu link
    document.body.removeChild(link);
  };

  const handleUserSavePin = async () => {
    if (!isAuth) {
      redirect.push(`/login?from=${pathName}`);
      return;
    }
    try {
      // setIsLoading(true);
      setPinIsSave(true);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/saves/create/${data._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const jsonRes = await res.json();
      // if (!res.ok) {
      //   handleServerError(jsonRes.error as string);
      //   return;
      // }
      handleServerSuccess('Pin foi salvo');
    } catch (err) {
      setPinIsSave(false);
      handleServerError('Erro interno no servidor.');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleUserRemovePin = async () => {
    if (!isAuth) {
      redirect.push(`/login?from=${pathName}`);
      return;
    }
    try {
      // setIsLoading(true);
      setPinIsSave(false);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/saves/${data._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const jsonRes = await res.json();
      // if (!res.ok) {
      //   handleServerError(jsonRes.error as string);
      //   return;
      // }
      handleServerSuccess('Pin removido dos salvos');
    } catch (err) {
      setPinIsSave(true);
      handleServerError('Erro interno no servidor.');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleSharePin = async () => {
    try {
      await navigator.share({
        title: data.title,
        text: data.description,
        url: location.href,
      });
    } catch {
      handleServerError('Seu navegador não suporta está função');
    }
  };

  return (
    <Container id="save-and-share">
      {isLoading && <Loading />}
      <GlobalError showError={showGlobalError} errorMsg={msgGlobalError} />
      <GlobalSuccess
        showSuccess={showGlobalSuccess}
        successMsg={msgGlobalSuccess}
        midiaType={data.midiaType}
      >
        <video src={data.url} controls={false} preload="auto"></video>
        <Image
          src={data.url}
          alt={data.title}
          priority
          width={25}
          height={25}
        />
      </GlobalSuccess>
      <div
        className="more-options"
        onClick={() => setShowMoreOptions(!showMoreOptions)}
        onBlur={event => handleOnBlur(event)}
        tabIndex={0}
        ref={refMoreOptions}
      >
        <button
          type="button"
          className="btn-more-options"
          data-btn-more-options-active={showMoreOptions}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            aria-label=""
            role="img"
          >
            <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
          </svg>
        </button>
        <div
          className="container-more-options"
          data-more-options-active={showMoreOptions}
          onClick={event => event.stopPropagation()}
        >
          <button type="button" onClick={handleDawnload}>
            Baixar pin
          </button>
          <button type="button" onClick={handleSharePin}>
            Compatilhar
          </button>
        </div>
      </div>
      {pinIsSave ? (
        <button
          type="button"
          className="btn-pin-un-save"
          onClick={handleUserRemovePin}
        >
          Salvo
        </button>
      ) : (
        <button
          type="button"
          className="btn-pin-save"
          onClick={handleUserSavePin}
        >
          Salvar
        </button>
      )}
    </Container>
  );
}
