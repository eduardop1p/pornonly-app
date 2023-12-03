/* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { useMediaQuery } from 'react-responsive';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import WaitingPin from '../masonry/waitingPin';
import LoadingPin from '../masonry/LoadingPin';

interface Props {
  data: MidiaResultsType;
}

export default function Pin({ data }: Props) {
  if (typeof window === 'undefined') return;

  const pinProportion = +data.width / +data.height;
  const [newHeight, setNewHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);

  const maxWidth1400 = useMediaQuery({ maxWidth: 1400 });
  const maxWidth1300 = useMediaQuery({ maxWidth: 1300 });
  const maxWidth1000 = useMediaQuery({ maxWidth: 1000 });
  const maxWidth600 = useMediaQuery({ maxWidth: 600 });
  const maxWidth480 = useMediaQuery({ maxWidth: 480 });

  const handleOnResize = useCallback(() => {
    const localNewWidth =
      window.innerWidth -
      (maxWidth1400
        ? maxWidth1300
          ? maxWidth1000
            ? maxWidth600
              ? maxWidth480
                ? 48
                : 64
              : 80
            : 480
          : 530
        : 580);
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
  }, [
    pinProportion,
    data,
    maxWidth1400,
    maxWidth1300,
    maxWidth1000,
    maxWidth600,
    maxWidth480,
  ]);

  useEffect(() => {
    handleOnResize();
  }, [handleOnResize]);

  const handleVideoFullScreen = () => {
    let video = document.querySelector('#pin video') as HTMLVideoElement;
    console.log(video);
    if (!video) return;
    let isFullScreen = document.fullscreenElement;

    if (!isFullScreen) {
      video.style.objectFit = 'cover';
    } else {
      video.style.objectFit = 'contain';
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleOnResize);
    document.addEventListener('fullscreenchange', handleVideoFullScreen);

    return () => {
      window.removeEventListener('resize', handleOnResize);
      document.removeEventListener('fullscreenchange', handleVideoFullScreen);
    };
  }, [handleOnResize]);

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
            alt={data.title ? data.title : 'no title'}
            priority
            fill
            sizes="100%"
            onLoad={handleRemoveLoading}
            onError={handleRemoveLoading}
          />
        </>
      )}
    </Container>
  );
}
