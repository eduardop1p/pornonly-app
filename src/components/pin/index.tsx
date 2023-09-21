/* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import WaitingPin from '../masonry/waitingPin';
// import Loading from './loading';

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

  const handleVideoCompleteLoad = (video: HTMLVideoElement) => {
    handleNoWaitingVideo(video)
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
      id="id-pin-default-container"
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
            onLoadedMetadata={(event) => handleVideoCompleteLoad(event.currentTarget as HTMLVideoElement)}
          ></video>
          <WaitingPin alonePin />
          {/* <Loading /> */}
        </>
      ) : (
        <Image src={data.url} alt={data.title} priority fill sizes="100%" />
      )}
    </Container>
  );
}
