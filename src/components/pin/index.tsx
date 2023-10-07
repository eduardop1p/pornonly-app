/* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useState } from 'react';
import ReactPlayer from 'react-player'

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

  const handleVideoCompleteLoad = () => {
    handleNoWaitingVideo();
    handleRemoveLoading();
  };

  const handleWaitingVideo = () => {
    const waitingPin = document.querySelector(
      '#waiting-pin'
    ) as HTMLDivElement;
    waitingPin.classList.add('waiting');
  };

  const handleNoWaitingVideo = () => {
    const waitingPin = document.querySelector(
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
          <ReactPlayer
            url={data.url}
            controls
            playing
            muted
            loop
            onReady={() => handleVideoCompleteLoad()}
            onBuffer={() => handleWaitingVideo()}
          />
          <WaitingPin alonePin />
          {pinIsLoading && <LoadingPin>
            <svg
              height="40"
              width="40"
              viewBox="0 0 24 24"
              aria-label="A carregar"
              role="img"
            >
              <path d="M15 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-6-6c-.83 0-1.5-.67-1.5-1.5S8.17 7.5 9 7.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path>
            </svg>
          </LoadingPin>}
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
          {pinIsLoading && <LoadingPin>
            <svg
              height="40"
              width="40"
              viewBox="0 0 24 24"
              aria-label="A carregar"
              role="img"
            >
              <path d="M15 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-6-6c-.83 0-1.5-.67-1.5-1.5S8.17 7.5 9 7.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path>
            </svg>
          </LoadingPin>}
        </>
      )}
    </Container>
  );
}
