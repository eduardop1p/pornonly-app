/* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import WaitingPin from '../masonry/waitingPin';
import LoadingPin from '../masonry/LoadingPin';

interface Props {
  data: MidiaResultsType;
}

export default function Pin({ data }: Props) {
  const [pinIsLoading, setPinIsLoading] = useState(true);
  const minWidthVerticalBox = 500;

  const [pinDefaultWidth] = useState(500);
  const [pinDefaultHeight] = useState(
    calHeight({
      customWidth: pinDefaultWidth,
      originalWidth: data.width,
      originalHeight: data.height,
    })
  );

  const [pinAlternativeWidth] = useState(800);
  const [pinAlternativeHeigth] = useState(
    calHeight({
      customWidth: pinAlternativeWidth,
      originalWidth: data.width,
      originalHeight: data.height,
    })
  );

  const handleRemoveLoading = () => {
    setPinIsLoading(false);
  };

  const handleVideoCompleteLoad = (video: HTMLVideoElement) => {
    handleNoWaitingVideo(video);
    handleRemoveLoading();
  };

  const handleWaitingVideo = (video: HTMLVideoElement) => {
    const parentVideo = video.parentElement;
    const waitingPin = parentVideo?.querySelector(
      '#waiting-pin'
    ) as HTMLDivElement;
    waitingPin.classList.add('waiting');
  };

  const handleNoWaitingVideo = (video: HTMLVideoElement) => {
    const parentVideo = video.parentElement;
    const waitingPin = parentVideo?.querySelector(
      '#waiting-pin'
    ) as HTMLDivElement;
    waitingPin.classList.remove('waiting');
  };

  return (
    <Container
      className={
        // eslint-disable-next-line
        `${pinDefaultHeight >= minWidthVerticalBox && pinDefaultHeight <= 650 ? 'pin-one-border-container' : ''}`
      }
      style={{
        width: `${pinDefaultHeight < minWidthVerticalBox ? pinAlternativeWidth : pinDefaultWidth}px`,
        height: `${pinDefaultHeight < minWidthVerticalBox ? pinAlternativeHeigth : pinDefaultHeight}px`,
        borderRadius:
          pinDefaultHeight < minWidthVerticalBox
            ? '2rem 2rem 0 0'
            : pinDefaultHeight > 650
              ? '2rem 0 0 2rem'
              : '1rem',
      }}
    >
      {data.midiaType === 'video' ? (
        <>
          <video
            src={data.url}
            preload="auto"
            controls
            autoPlay
            muted
            loop
            onWaiting={event =>
              handleWaitingVideo(event.currentTarget as HTMLVideoElement)
            }
            onPlaying={event =>
              handleNoWaitingVideo(event.currentTarget as HTMLVideoElement)
            }
            onLoadedData={event =>
              handleVideoCompleteLoad(event.currentTarget as HTMLVideoElement)
            }
          ></video>
          <WaitingPin alonePin />
          {pinIsLoading && <LoadingPin />}
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
          {pinIsLoading && <LoadingPin />}
        </>
      )}
    </Container>
  );
}
