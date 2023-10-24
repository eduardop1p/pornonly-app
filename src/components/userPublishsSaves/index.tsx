'use client';

import { useState, useEffect, useCallback, useRef, FocusEvent } from 'react';

import styles from './styles.module.css';

import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';
import Loading from '../form/loading';
import { GlobalSuccess } from '../form/globalSuccess';
import { GlobalError } from '../form/globalError';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import revalidatePin from '@/services/revalidatePin';

export default function UserPublishsSaves({
  publishsResults,
  savesResults,
  token,
  isUniqueUser,
  userId,
  username,
}: {
  publishsResults: MidiaResultsType[];
  savesResults: MidiaResultsType[];
  token: string;
  isUniqueUser: boolean;
  userId: string;
  username: string;
}) {
  const [stPublishsResults, setStPublishsResults] = useState(publishsResults);
  const [showPublish, setShowPublish] = useState(true);
  const [showSaves, setShowSaves] = useState(false);
  const [showContainerSelectMode, setShowContainerSelectMode] = useState(false);
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

  const handleClickShowPublishs = () => {
    setShowPublish(true);
    setShowSaves(false);
  };

  const handleClickShowSaves = () => {
    setShowSaves(true);
    setShowPublish(false);
  };

  useEffect(() => {
    const masonry = document.body.querySelector('#masonry') as HTMLDivElement;
    if (pinSelectMode) {
      masonry.style.scale = '0.95';
      handleAddSelectDiv();
    } else {
      masonry.style.scale = '1';
      handleRemoveSelectDiv();
    }
  }, [pinSelectMode, handleRemoveSelectDiv, handleAddSelectDiv]);

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
      handleServerSuccess('Selecionados excluidos');
      setShowContainerSelectMode(false);
      setPinSelectMode(false);
      setStPublishsResults(state =>
        state.filter(itemP =>
          pinsIdsRemoveArray.current.every(itemC => itemP._id !== itemC.id)
        )
      );
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

  return (
    <div className={styles['container']}>
      {isLoading && <Loading />}
      <GlobalSuccess
        showSuccess={showGlobalSuccess}
        successMsg={msgGlobalSuccess}
      />
      <GlobalError showError={showGlobalError} errorMsg={msgGlobalError} />
      <div className={styles['btns-publishs-or-saves']}>
        {isUniqueUser && showPublish && (
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
        )}

        <button
          className={styles['btn-manage']}
          type="button"
          onClick={handleClickShowPublishs}
          data-active-btn={showPublish}
        >
          Criados
        </button>
        <button
          className={styles['btn-manage']}
          type="button"
          onClick={handleClickShowSaves}
          data-active-btn={showSaves}
        >
          Salvos
        </button>
      </div>

      <div className={styles['publishs-or-saves']}>
        <div data-active={showPublish}>
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
        <div data-active={showSaves}>
          {savesResults.length ? (
            <Masonry
              results={savesResults}
              visibleUserInfo={true}
              userId={userId}
              masonryPage="user-saves"
              username={username}
            />
          ) : (
            <div className={styles['none-results']}>
              Nenhuma publicação salva
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
