'use client';

import { useState, useEffect, useCallback, useRef, FocusEvent } from 'react';

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
  const [showContainerSelectMode, setShowContainerSelectMode] = useState(false);
  const [pinSelectMode, setPinSelectMode] = useState(false);

  const refBtnManageMoreOptions = useRef<HTMLDivElement | null>(null);
  const pinsIdsRemoveArray = useRef<string[]>([]);
  const refPinSelectMode = useRef<boolean | null>(null);
  refPinSelectMode.current = pinSelectMode;

  const handleGetAllPin = useCallback(() => {
    return document.querySelectorAll('.pin-publishs-container');
  }, []);

  const handleSelectPin = useCallback(
    (pinElement: HTMLDivElement) => {
      pinElement.onclick = event => {
        const currentTarget = event.currentTarget as HTMLDivElement;
        const link = currentTarget.querySelector('.pin') as HTMLAnchorElement;
        const pinId = link.href.split('/').pop() as string;
        if (!currentTarget.classList.contains('selected')) {
          pinsIdsRemoveArray.current.push(pinId);
          currentTarget.classList.add('selected');
        } else {
          pinsIdsRemoveArray.current = pinsIdsRemoveArray.current.filter(
            id => id != pinId
          );
          currentTarget.classList.remove('selected');
        }
      };
    },
    [pinsIdsRemoveArray]
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
      !refBtnManageMoreOptions.current?.contains(event.relatedTarget) &&
      !refPinSelectMode.current
    ) {
      setShowContainerSelectMode(false);
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['btns-publishs-or-saves']}>
        {showPublish && (
          <div
            className={styles['btn-manage-more-options']}
            ref={refBtnManageMoreOptions}
            data-user-options-active={showContainerSelectMode}
            tabIndex={0}
            onBlur={handleOnBlur}
            onClick={() => setShowContainerSelectMode(!showContainerSelectMode)}
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
                <button type="button" className={styles['btn-user-delete-pin']}>
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
          {publishsResults.length ? (
            <Masonry
              results={publishsResults}
              justifyContent="left"
              visibleUserInfo={false}
              masonryPublishs
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
