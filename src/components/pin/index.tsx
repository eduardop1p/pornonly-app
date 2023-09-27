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

  const handleRemoveLoading = (elementPin: Element) => {
    const loading = elementPin.parentElement?.querySelector(
      '#loading-pin'
    ) as HTMLDivElement;
    setTimeout(() => {
      loading.style.zIndex = '1';
    }, 500);
  };

  const handleVideoCompleteLoad = (video: HTMLVideoElement) => {
    handleNoWaitingVideo(video);
    handleRemoveLoading(video);
  }

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
      className={`${pinDefaultHeight >= 460 && pinDefaultHeight <= 650
        ? 'pin-one-border-container'
        : ''
        }`}
      style={{
        width: `${pinDefaultHeight < 460 ? pinAlternativeWidth : pinDefaultWidth}px`,
        height: `${pinDefaultHeight < 460 ? pinAlternativeHeigth : pinDefaultHeight}px`,
      }}
    >
      {data.midiaType === 'video' ? (
        <>
          <video
            src={data.url}
            preload="metadata"
            controls
            autoPlay
            muted
            loop
            onWaiting={event =>
              handleWaitingVideo(
                event.currentTarget as HTMLVideoElement
              )
            }
            onPlaying={event =>
              handleNoWaitingVideo(
                event.currentTarget as HTMLVideoElement
              )
            }
            onLoadedData={(event) => handleVideoCompleteLoad(event.currentTarget as HTMLVideoElement)}
          ></video>
          <WaitingPin alonePin />
          <LoadingPin />
        </>
      ) : (
        <>
          <Image src={data.url} alt={data.title} priority fill sizes="100%" onLoad={event => handleRemoveLoading(event.currentTarget)} />
          <LoadingPin />
        </>
      )}
    </Container>
  );
}
