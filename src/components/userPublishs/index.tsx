'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  FocusEvent,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './styles.module.css';

import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';
import Loading from '../form/loading';
import { GlobalSuccess } from '../form/globalSuccess';
import { GlobalError } from '../form/globalError';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import revalidatePin from '@/services/revalidatePin';

export default function UserPublishs({
  publishsResults,
  token,
  isUniqueUser,
  userId,
  username,
}: {
  publishsResults: MidiaResultsType[];
  token: string;
  isUniqueUser: boolean;
  userId: string;
  username: string;
}) {
  const pathName = usePathname();

  const [stPublishsResults, setStPublishsResults] = useState(publishsResults);
  const [pinSelectMode, setPinSelectMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerSuccess, msgGlobalSuccess, showGlobalSuccess } =
    useGlobalSuccessTime();
  const { handleServerError, msgGlobalError, showGlobalError } =
    useGlobalErrorTime();

  const refContainerManageMoreOptions = useRef<HTMLDivElement | null>(null);
  const refBtnManageMoreOptions = useRef<HTMLButtonElement | null>(null);
  const pinsIdsRemoveArray = useRef<{ id?: string; key: string }[]>([]);
  const refPinSelectMode = useRef<boolean | null>(null);
  refPinSelectMode.current = pinSelectMode;

  const handleGetAllPin = useCallback(() => {
    return document.querySelectorAll('.pin-publishs-container');
  }, []);

  const handleSelectPin = useCallback(
    (pinElement?: HTMLDivElement | null) => {
      if (!pinElement) return;
      pinElement.onclick = event => {
        const currentTarget = event.currentTarget as HTMLDivElement;
        const index = parseInt(
          currentTarget.getAttribute('data-index') as string
        );
        const { _id, url, thumb } = stPublishsResults[index];
        if (!currentTarget.classList.contains('selected')) {
          if (thumb)
            pinsIdsRemoveArray.current.push({
              key: new URL(thumb).pathname.slice(1),
            });
          pinsIdsRemoveArray.current.push({
            id: _id,
            key: new URL(url).pathname.slice(1),
          });
          currentTarget.classList.add('selected');
        } else {
          pinsIdsRemoveArray.current = pinsIdsRemoveArray.current.filter(
            value => value.id != _id
          );
          currentTarget.classList.remove('selected');
        }
      };
    },
    [pinsIdsRemoveArray, stPublishsResults]
  );

  const handleAddSelectDiv = useCallback(() => {
    const allPin = handleGetAllPin();
    allPin.forEach(element => {
      const pinElement = element as HTMLDivElement;
      const selectDiv = pinElement.querySelector('.select-pin');
      if (pinElement.contains(selectDiv)) return;

      const div = document.createElement('div');
      div.classList.add('select-pin');
      pinElement.appendChild(div);
      handleSelectPin(pinElement);
    });
  }, [handleSelectPin, handleGetAllPin]);

  const handleRemoveSelectDiv = useCallback(() => {
    const allPin = handleGetAllPin();
    allPin.forEach(element => {
      const pinElement = element as HTMLDivElement;
      const selectDiv = pinElement.querySelector('.select-pin');
      if (!pinElement.contains(selectDiv)) return;
      if (pinElement.classList.contains('selected'))
        pinElement.classList.remove('selected');
      if (pinsIdsRemoveArray.current.length) pinsIdsRemoveArray.current = [];

      pinElement.onclick = event => event.stopPropagation();
      pinElement.removeChild(selectDiv as HTMLDivElement);
    });
  }, [handleGetAllPin]);

  useEffect(() => {
    const masonry = document.body.querySelector('#masonry') as HTMLDivElement;
    if (pinSelectMode && stPublishsResults.length && masonry) {
      masonry.style.scale = '0.95';
      handleAddSelectDiv();
    } else if (stPublishsResults.length && masonry) {
      masonry.style.scale = '1';
      handleRemoveSelectDiv();
    }
  }, [
    pinSelectMode,
    handleRemoveSelectDiv,
    handleAddSelectDiv,
    stPublishsResults,
  ]);

  const handlePathName = (pathName: string) => {
    return `/${pathName}/${username}`;
  };

  return (
    <div className={styles['container']}>
      {isLoading && <Loading />}
      <GlobalSuccess
        showSuccess={showGlobalSuccess}
        successMsg={msgGlobalSuccess}
      />
      <GlobalError showError={showGlobalError} errorMsg={msgGlobalError} />
      <div className={styles['btns-publishs-or-saves']}>
        {isUniqueUser && stPublishsResults.length ? (
          <MoreOptions
            pinSelectMode={pinSelectMode}
            refBtnManageMoreOptions={refBtnManageMoreOptions}
            refContainerManageMoreOptions={refContainerManageMoreOptions}
            setPinSelectMode={setPinSelectMode}
            handleServerError={handleServerError}
            handleServerSuccess={handleServerSuccess}
            isLoading={isLoading}
            pinsIdsRemoveArray={pinsIdsRemoveArray}
            refPinSelectMode={refPinSelectMode}
            setIsLoading={setIsLoading}
            setStPublishsResults={setStPublishsResults}
            token={token}
          />
        ) : null}

        <Link
          href={`/created/${username}`}
          className={styles['btn-manage']}
          type="button"
          data-active-btn={
            // eslint-disable-next-line
            pathName === handlePathName('created') || pathName === `/${username}` ? true : false
          }
        >
          Criados
        </Link>
        <Link
          href={`/saves/${username}`}
          className={styles['btn-manage']}
          type="button"
          data-active-btn={pathName === handlePathName('saves') ? true : false}
        >
          Salvos
        </Link>
      </div>

      <div className={styles['publishs-or-saves']}>
        {stPublishsResults.length ? (
          <Masonry
            results={stPublishsResults}
            visibleUserInfo={false}
            masonryPage="user-midia"
            userId={userId}
            masonryPublishs
            username={username}
          />
        ) : (
          <div className={styles['none-results']}>
            Nenhuma publicação criada
          </div>
        )}
      </div>
    </div>
  );
}

function MoreOptions({
  refContainerManageMoreOptions,
  refBtnManageMoreOptions,
  setPinSelectMode,
  pinSelectMode,
  refPinSelectMode,
  setStPublishsResults,
  isLoading,
  setIsLoading,
  pinsIdsRemoveArray,
  handleServerError,
  handleServerSuccess,
  token,
}: {
  refContainerManageMoreOptions: MutableRefObject<HTMLDivElement | null>;
  refBtnManageMoreOptions: MutableRefObject<HTMLButtonElement | null>;
  setPinSelectMode: Dispatch<SetStateAction<boolean>>;
  pinSelectMode: boolean;
  refPinSelectMode: MutableRefObject<boolean | null>;
  setStPublishsResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  pinsIdsRemoveArray: MutableRefObject<{ id?: string; key: string }[]>;
  handleServerError(msg: string): void;
  handleServerSuccess(msg: string): void;
  token: string;
}) {
  const [showContainerSelectMode, setShowContainerSelectMode] = useState(false);

  const handlePublishsCount = () => {
    const publishsCount = document.querySelector(
      '#publishs'
    ) as HTMLSpanElement;
    const publishsCountValue = parseInt(publishsCount.innerText);
    const publishsCountNewValue =
      publishsCountValue -
      pinsIdsRemoveArray.current
        .map(val => val.id)
        .filter(val => typeof val !== 'undefined').length;

    const newValue = () => {
      if (!publishsCountNewValue) return `Sem publicações`;
      if (publishsCountNewValue == 1)
        return `${publishsCountNewValue} publicação`;
      return `${publishsCountNewValue} publicações`;
    };

    publishsCount.innerText = newValue();
  };

  const handleUserDeletePin = async () => {
    if (isLoading) return;
    if (!pinsIdsRemoveArray.current.length) {
      handleServerError('Nada foi selecionado');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/delete?midiaDelete=${JSON.stringify(pinsIdsRemoveArray.current)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonRes = await res.json();
      if (!res.ok) {
        handleServerError(jsonRes.error as string);
        return;
      }
      await revalidatePin();
      setShowContainerSelectMode(false);
      setPinSelectMode(false);
      setStPublishsResults(state =>
        state.filter(itemP =>
          pinsIdsRemoveArray.current.every(itemC => itemP._id !== itemC.id)
        )
      );
      handlePublishsCount();
      handleServerSuccess('Selecionados excluidos');
    } catch (err) {
      handleServerError('Erro interno no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnimationClick = () => {
    refBtnManageMoreOptions.current?.setAttribute('data-click', 'true');
    setTimeout(() => {
      refBtnManageMoreOptions.current?.removeAttribute('data-click');
    }, 300);
  };

  const handleOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !refContainerManageMoreOptions.current?.contains(event.relatedTarget) &&
      !refPinSelectMode.current
    ) {
      setShowContainerSelectMode(false);
      if (showContainerSelectMode) {
        handleAddAnimationClick();
      }
    }
  };

  return (
    <div
      className={styles['container-manage-more-options']}
      ref={refContainerManageMoreOptions}
      data-user-options-active={showContainerSelectMode}
      tabIndex={0}
      onBlur={handleOnBlur}
    >
      <button
        type="button"
        data-user-options-active={showContainerSelectMode}
        ref={refBtnManageMoreOptions}
        className={styles['btn-manage-more-options']}
        onClick={() => {
          setShowContainerSelectMode(!showContainerSelectMode);
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
          data-user-options-active={showContainerSelectMode}
        >
          <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
        </svg>
      </button>
      <div
        onClick={event => event.stopPropagation()}
        data-user-options-active={showContainerSelectMode}
        className={styles['user-options-pin']}
      >
        <button
          type="button"
          onClick={() => setPinSelectMode(!pinSelectMode)}
          className={styles['btn-user-save-pin']}
        >
          {!pinSelectMode ? 'Selecionar' : 'Sair'}
        </button>
        {pinSelectMode && (
          <button
            type="button"
            className={styles['btn-user-delete-pin']}
            onClick={handleUserDeletePin}
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
