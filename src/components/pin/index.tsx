// /* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import WaitingPin from '../masonry/waitingPin';
import LoadingPin from '../masonry/LoadingPin';

interface Props {
  data: MidiaResultsType;
}

export default function Pin({ data }: Props) {
  const pinProportion = data.width / data.height;
  const [newHeight, setNewHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [initialRender, setInitialRender] = useState(true);

  const calcPinContainerHeight = useCallback(() => {
    // const documentHeight = document.documentElement.clientHeight;
    // console.log(documentHeight);
    // const pinContainer = document.querySelector(
    //   '#pin-container'
    // ) as HTMLDivElement;
    // pinContainer.style.height = `${documentHeight}px`;

    const localNewHeight = document.documentElement.clientHeight - 128;
    const localNewWidth = Math.round(localNewHeight * pinProportion);
    setNewHeight(localNewHeight);
    setNewWidth(localNewWidth);
    if (localNewWidth > 800) {
      setNewWidth(800);
      setNewHeight(
        calHeight({
          customWidth: 800,
          originalHeight: data.height,
          originalWidth: data.width,
        })
      );
    }
  }, [data, pinProportion]);

  useEffect(() => {
    window.addEventListener('resize', calcPinContainerHeight);

    return () => window.removeEventListener('resize', calcPinContainerHeight);
  }, [calcPinContainerHeight]);

  useEffect(() => {
    if (initialRender) {
      calcPinContainerHeight();
      setInitialRender(false);
    }
  }, [calcPinContainerHeight, initialRender]);

  const [pinIsLoading, setPinIsLoading] = useState(true);

  const handleRemoveLoading = () => {
    setPinIsLoading(false);
  };

  const handleVideoCompleteLoad = () => {
    handleNoWaitingVideo();
    handleRemoveLoading();
  };

  const handleWaitingVideo = () => {
    const waitingPin = document.querySelector('#waiting-pin') as HTMLDivElement;
    waitingPin.classList.add('waiting');
  };

  const handleNoWaitingVideo = () => {
    const waitingPin = document.querySelector('#waiting-pin') as HTMLDivElement;
    waitingPin.classList.remove('waiting');
  };

  return (
    <Container
      style={{
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      }}
      id="pin"
    >
      {pinIsLoading && newHeight && newWidth && (
        <LoadingPin>
          <svg
            height="40"
            width="40"
            viewBox="0 0 24 24"
            aria-label="A carregar"
            role="img"
          >
            <path d="M15 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-6-6c-.83 0-1.5-.67-1.5-1.5S8.17 7.5 9 7.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path>
          </svg>
        </LoadingPin>
      )}
      {data.midiaType === 'video' ? (
        <>
          <ReactPlayer
            url={data.url}
            width="100%"
            height="100%"
            controls
            playing
            muted
            loop
            onReady={() => handleVideoCompleteLoad()}
            onBuffer={() => handleWaitingVideo()}
          />
          <WaitingPin alonePin />
        </>
      ) : (
        <>
          <Image
            src={data.url}
            alt={data.title}
            priority
            fill
            sizes="100%"
            onLoadingComplete={handleRemoveLoading}
            onError={handleRemoveLoading}
          />
        </>
      )}
    </Container>
  );
}
