'use client';

import { useState } from 'react';

import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';
import styles from './styles.module.css';

export default function UserPublishsSaves({
  publishsResults,
  savesResults,
}: {
  publishsResults: MidiaResultsType[];
  savesResults: MidiaResultsType[];
}) {
  const [showPublish, setShowPublish] = useState(true);
  const [showSaves, setShowSaves] = useState(false);

  const handleClickShowPublishs = () => {
    setShowPublish(true);
    setShowSaves(false);
  };

  const handleClickShowSaves = () => {
    setShowSaves(true);
    setShowPublish(false);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['btns-publishs-or-saves']}>
        <button
          type="button"
          onClick={handleClickShowPublishs}
          data-active-btn={showPublish}
        >
          Criados
        </button>
        <button
          type="button"
          onClick={handleClickShowSaves}
          data-active-btn={showSaves}
        >
          Salvos
        </button>
      </div>

      <div className={styles['publishs-or-saves']}>
        <div data-active={showPublish}>
          {publishsResults.length ? (
            <Masonry
              results={publishsResults}
              justifyContent="left"
              visibleUserInfo={false}
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
              justifyContent="left"
              visibleUserInfo={true}
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
