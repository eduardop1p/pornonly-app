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
import { upperFirst } from 'lodash';

import styles from './styles.module.css';

import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';
import Loading from '../form/loading';
import { GlobalErrorComponent } from '../form/globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '../form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import revalidatePin from '@/services/revalidatePin';
import { MidiaType } from '@/app/page';

export type MidiaTypeFilterType = 'img' | 'gif' | 'video' | undefined;

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
  const [midiaTypeFilter, setMidiaTypeFilter] =
    useState<MidiaTypeFilterType>(undefined);
  const { handleSuccess, msgSuccess } = useGlobalSuccess();
  const { handleError, msgError } = useGlobalError();

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
      masonry.style.scale = '0.98';
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
      <GlobalSuccessComponent successMsg={msgSuccess} />
      <GlobalErrorComponent errorMsg={msgError} />
      <div className={styles['btns-publishs-or-saves']}>
        {publishsResults.length ? (
          <div className={styles['container-options']}>
            {isUniqueUser ? (
              <MoreOptions
                pinSelectMode={pinSelectMode}
                setPinSelectMode={setPinSelectMode}
                handleError={handleError}
                handleSuccess={handleSuccess}
                isLoading={isLoading}
                pinsIdsRemoveArray={pinsIdsRemoveArray}
                refPinSelectMode={refPinSelectMode}
                setIsLoading={setIsLoading}
                setStPublishsResults={setStPublishsResults}
                token={token}
              />
            ) : null}
            <MidiaTypeOption
              userId={userId}
              handleError={handleError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStPublishsResults={setStPublishsResults}
              setMidiaTypeFilter={setMidiaTypeFilter}
              midiaTypeFilter={midiaTypeFilter}
            />
          </div>
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
            midiaTypeFilter={midiaTypeFilter}
            isUniqueUser={isUniqueUser}
          />
        ) : (
          <div className={styles['none-results']}>
            Nenhuma publicação criada{' '}
            {midiaTypeFilter && (
              <>
                do tipo{' '}
                <span style={{ fontWeight: 500 }}>
                  {upperFirst(
                    midiaTypeFilter == 'img' ? 'imagem' : midiaTypeFilter
                  )}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MoreOptions({
  setPinSelectMode,
  pinSelectMode,
  refPinSelectMode,
  setStPublishsResults,
  isLoading,
  setIsLoading,
  pinsIdsRemoveArray,
  handleError,
  handleSuccess,
  token,
}: {
  setPinSelectMode: Dispatch<SetStateAction<boolean>>;
  pinSelectMode: boolean;
  refPinSelectMode: MutableRefObject<boolean | null>;
  setStPublishsResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  pinsIdsRemoveArray: MutableRefObject<{ id?: string; key: string }[]>;
  handleError(msg: string): void;
  handleSuccess(msg: string): void;
  token: string;
}) {
  const [showContainerSelectMode, setShowContainerSelectMode] = useState(false);

  const refContainerManageMoreOptions = useRef<HTMLDivElement | null>(null);
  const refBtnManageMoreOptions = useRef<HTMLButtonElement | null>(null);

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
      handleError('Nada foi selecionado');
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
        handleError(jsonRes.error as string);
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
      handleSuccess('Selecionados excluidos');
    } catch (err) {
      handleError('Erro interno no servidor');
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

function MidiaTypeOption({
  userId,
  handleError,
  setStPublishsResults,
  isLoading,
  setIsLoading,
  setMidiaTypeFilter,
  midiaTypeFilter,
}: {
  userId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setStPublishsResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  handleError(msg: string): void;
  setMidiaTypeFilter: Dispatch<SetStateAction<MidiaTypeFilterType>>;
  midiaTypeFilter: MidiaTypeFilterType;
}) {
  const [showContainerMidiaTypeOptions, setShowContainerMidiaTypeOptions] =
    useState(false);

  const refBtnManageMoreOptions = useRef<HTMLButtonElement | null>(null);

  const handleAddAnimationClick = () => {
    refBtnManageMoreOptions.current?.setAttribute('data-click', 'true');
    setTimeout(() => {
      refBtnManageMoreOptions.current?.removeAttribute('data-click');
    }, 300);
  };

  const handleGetPinsToMidiaType = async (midiaType: MidiaTypeFilterType) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const resUserMidia = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?midiaType=${midiaType}&page=1`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );
      const dataUserMidia = await resUserMidia.json();
      if (!resUserMidia.ok) {
        handleError(dataUserMidia.error as string);
        return;
      }
      const data = dataUserMidia as MidiaType;
      const results = data.midia.results;
      setStPublishsResults(results);
      setMidiaTypeFilter(midiaType);
    } catch (err) {
      console.log(err);
      handleError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={styles['container-midiatype-options']}
      data-user-midiatype-options-active={showContainerMidiaTypeOptions}
      tabIndex={0}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setShowContainerMidiaTypeOptions(false);
          if (showContainerMidiaTypeOptions) {
            handleAddAnimationClick();
          }
        }
      }}
    >
      <button
        type="button"
        data-user-midiatype-options-active={showContainerMidiaTypeOptions}
        ref={refBtnManageMoreOptions}
        className={styles['btn-manage-midiatype-options']}
        onClick={() => {
          setShowContainerMidiaTypeOptions(state => !state);
          handleAddAnimationClick();
        }}
      >
        <svg
          height="20"
          width="20"
          viewBox="0 0 24 24"
          data-user-midiatype-options-active={showContainerMidiaTypeOptions}
        >
          <path d="M9 19.5a1.75 1.75 0 1 1 .001-3.501A1.75 1.75 0 0 1 9 19.5M22.25 16h-8.321c-.724-2.034-2.646-3.5-4.929-3.5S4.795 13.966 4.071 16H1.75a1.75 1.75 0 0 0 0 3.5h2.321C4.795 21.534 6.717 23 9 23s4.205-1.466 4.929-3.5h8.321a1.75 1.75 0 0 0 0-3.5M15 4.5a1.75 1.75 0 1 1-.001 3.501A1.75 1.75 0 0 1 15 4.5M1.75 8h8.321c.724 2.034 2.646 3.5 4.929 3.5s4.205-1.466 4.929-3.5h2.321a1.75 1.75 0 0 0 0-3.5h-2.321C19.205 2.466 17.283 1 15 1s-4.205 1.466-4.929 3.5H1.75a1.75 1.75 0 0 0 0 3.5"></path>
        </svg>
      </button>

      <div
        onClick={event => event.stopPropagation()}
        data-user-midiatype-options-active={showContainerMidiaTypeOptions}
        className={styles['user-midiatype-options']}
      >
        <button
          type="button"
          className={styles['btn-midiatype-option']}
          data-btn-midiatype-active={midiaTypeFilter == 'img' ? true : false}
          onClick={() => {
            handleGetPinsToMidiaType('img');
            setShowContainerMidiaTypeOptions(false);
          }}
        >
          Imagens
          {midiaTypeFilter === 'img' && <IsActiveIcon />}
        </button>
        <button
          type="button"
          className={styles['btn-midiatype-option']}
          data-btn-midiatype-active={midiaTypeFilter == 'video' ? true : false}
          onClick={() => {
            handleGetPinsToMidiaType('video');
            setShowContainerMidiaTypeOptions(false);
          }}
        >
          Videos
          {midiaTypeFilter === 'video' && <IsActiveIcon />}
        </button>
        <button
          type="button"
          className={styles['btn-midiatype-option']}
          data-btn-midiatype-active={midiaTypeFilter == 'gif' ? true : false}
          onClick={() => {
            handleGetPinsToMidiaType('gif');
            setShowContainerMidiaTypeOptions(false);
          }}
        >
          Gifs
          {midiaTypeFilter === 'gif' && <IsActiveIcon />}
        </button>
      </div>
    </div>
  );
}

function IsActiveIcon() {
  return (
    <svg height="12" width="12" viewBox="0 0 24 24">
      <path d="M9.17 21.75.73 12.79c-.97-1.04-.97-2.71 0-3.75a2.403 2.403 0 0 1 3.53 0l4.91 5.22L19.74 3.03c.98-1.04 2.55-1.04 3.53 0 .97 1.03.97 2.71 0 3.74L9.17 21.75z"></path>
    </svg>
  );
}
