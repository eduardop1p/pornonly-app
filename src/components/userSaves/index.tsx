'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { upperFirst } from 'lodash';

import styles from './styles.module.css';

import Loading from '../form/loading';
import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';
import { MidiaType } from '@/app/page';
import type { MidiaTypeFilterType } from '../userPublishs';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import { GlobalError } from '../form/globalError';

export default function UserSaves({
  savesResults,
  userId,
  username,
}: {
  savesResults: MidiaResultsType[];
  userId: string;
  username: string;
}) {
  const pathName = usePathname();
  const [midiaTypeFilter, setMidiaTypeFilter] =
    useState<MidiaTypeFilterType>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [stSavesResults, setStSavesResults] = useState(savesResults);
  const { handleServerError, msgGlobalError, showGlobalError } =
    useGlobalErrorTime();

  const handlePathName = (pathName: string) => {
    return `/${pathName}/${username}`;
  };

  return (
    <div className={styles['container']}>
      {isLoading && <Loading />}
      <GlobalError showError={showGlobalError} errorMsg={msgGlobalError} />

      <div className={styles['btns-publishs-or-saves']}>
        {savesResults.length ? (
          <div className={styles['container-options']}>
            <MidiaTypeOption
              userId={userId}
              handleServerError={handleServerError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setStSavesResults={setStSavesResults}
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
        {stSavesResults.length ? (
          <Masonry
            results={stSavesResults}
            visibleUserInfo={true}
            userId={userId}
            masonryPage="user-saves"
            username={username}
            midiaTypeFilter={midiaTypeFilter}
          />
        ) : (
          <div className={styles['none-results']}>
            Nenhuma publicação salva{' '}
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

function MidiaTypeOption({
  userId,
  handleServerError,
  setStSavesResults,
  isLoading,
  setIsLoading,
  setMidiaTypeFilter,
  midiaTypeFilter,
}: {
  userId: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setStSavesResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  handleServerError(msg: string): void;
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
        `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?midiaType=${midiaType}&page=1`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );
      const dataUserMidia = await resUserMidia.json();
      if (!resUserMidia.ok) {
        handleServerError(dataUserMidia.error as string);
        return;
      }
      const data = dataUserMidia as MidiaType;
      const results = data.midia.results;
      setStSavesResults(results);
      setMidiaTypeFilter(midiaType);
    } catch (err) {
      console.log(err);
      handleServerError('Erro interno no servidor');
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
        </button>
      </div>
    </div>
  );
}
