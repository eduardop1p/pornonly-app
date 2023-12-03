/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, FocusEvent, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

import { Container, ContainerFullScreen } from './styled';
import Loading from '../../form/loading';
import { default as LoadingFullScreen } from '../loading';
import { GlobalErrorComponent } from '@/components/form/globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '@/components/form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import revalidatePin from '@/services/revalidatePin';
import calHeight from '@/config/calcHeight';

interface Props {
  data: {
    _id: string;
    url: string;
    title: string;
    midiaType?: 'video' | 'img' | 'gif';
    username: string;
    description: string;
    height: string;
    width: string;
  };
  isAuth: boolean;
  token: string;
  isSave: boolean | undefined;
}

export default function SaveAndMore({ data, isAuth, token, isSave }: Props) {
  if (typeof window === 'undefined') return;

  const router = useRouter();
  const pathName = usePathname();

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinIsSave, setPinIsSave] = useState(isSave);
  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();

  const refMoreOptions = useRef<HTMLDivElement | null>(null);
  const refBtnMoreOptions = useRef<HTMLButtonElement | null>(null);
  const fileName = data.url.split('/').pop() as string;

  const pinProportion = +data.width / +data.height;
  const [newHeight, setNewHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);

  const handleOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!refMoreOptions.current?.contains(event.relatedTarget)) {
      setShowMoreOptions(false);
      if (showMoreOptions) {
        handleAddAnimationClick();
      }
    }
  };

  useEffect(() => {
    const localNewWidth = window.innerWidth;
    const localNewHeight = calHeight({
      customWidth: localNewWidth,
      originalHeight: +data.height,
      originalWidth: +data.width,
    });

    if (localNewHeight > window.innerHeight - 128) {
      const newLocalNewHeight = window.innerHeight - 128;
      let newLocalNewWidth = Math.round(newLocalNewHeight * pinProportion);
      setNewHeight(newLocalNewHeight);
      setNewWidth(newLocalNewWidth);
      return;
    }

    setNewWidth(localNewWidth);
    setNewHeight(localNewHeight);
  }, [data, pinProportion]);

  const handleDawnload = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }

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
      router.push(`/login?from=${pathName}`);
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
      await revalidatePin();
      // const jsonRes = await res.json();
      // if (!res.ok) {
      //   handleError(jsonRes.error as string);
      //   return;
      // }
      handleSuccess('Pin foi salvo');
    } catch (err) {
      setPinIsSave(false);
      handleError('Erro interno no servidor');
    } finally {
      // setIsLoading(false);
    }
  };

  const handleUserRemovePin = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
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
      await revalidatePin();
      // const jsonRes = await res.json();
      // if (!res.ok) {
      //   handleError(jsonRes.error as string);
      //   return;
      // }
      handleSuccess('Pin removido dos salvos');
    } catch (err) {
      setPinIsSave(true);
      handleError('Erro interno no servidor');
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
      handleError('Seu navegador não suporta está função');
    }
  };

  const handleAddAnimationClick = () => {
    refBtnMoreOptions.current?.classList.add('click');
    setTimeout(() => {
      refBtnMoreOptions.current?.classList.remove('click');
    }, 300);
  };

  return (
    <Container id="save-and-share">
      {showFullScreen && data.midiaType !== 'video' && (
        <ContainerFullScreen onClick={() => setShowFullScreen(false)}>
          <button
            type="button"
            className="close-full-screen"
            onClick={() => setShowFullScreen(false)}
          >
            <svg
              height={22}
              width={22}
              viewBox="0 0 24 24"
              aria-hidden="true"
              aria-label=""
              role="img"
            >
              <path d="m15.18 12 7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
            </svg>
          </button>
          <div
            className="pin-full-screen"
            style={{ width: isLoadingFullScreen ? '100%' : 'auto' }}
            onClick={event => event.stopPropagation()}
          >
            {isLoadingFullScreen && <LoadingFullScreen fullScreen />}
            <Image
              src={data.url}
              height={newHeight}
              width={newWidth}
              alt={data.title ? data.title : 'no title'}
              onLoad={() => setIsLoadingFullScreen(false)}
            />
          </div>
        </ContainerFullScreen>
      )}
      {isLoading && <Loading />}
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess}>
        {data.midiaType === 'video' ? (
          <video src={data.url} controls={false} preload="auto"></video>
        ) : (
          <Image
            src={data.url}
            alt={data.title}
            priority
            width={25}
            height={25}
          />
        )}
      </GlobalSuccessComponent>
      <div className="container-more-aptions-and-compress">
        <div
          className="more-options"
          onBlur={event => handleOnBlur(event)}
          tabIndex={0}
          ref={refMoreOptions}
        >
          <button
            ref={refBtnMoreOptions}
            type="button"
            className="btn-more-options"
            data-btn-more-options-active={showMoreOptions}
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
              handleAddAnimationClick();
            }}
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
        {data.midiaType !== 'video' && (
          <button type="button" onClick={() => setShowFullScreen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={20}
              width={20}
              viewBox="0 0 448 512"
            >
              <path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </button>
        )}
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
