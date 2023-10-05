/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { upperFirst } from 'lodash';

import { MasonryContainer } from './styled';
import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import videoDuration from '@/config/calcDuration';
import LoadingPin from './LoadingPin';
import WaitingPin from './waitingPin';
import UserPin from './userPin';

interface Props {
  results: MidiaResultsType[];
  visibleUserInfo?: boolean;
  masonryPublishs?: boolean;
}

export default function Masonry({
  results,
  visibleUserInfo,
  masonryPublishs = false,
}: Props) {
  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState(
    (window.innerWidth - 132) / columnCount
  );

  useEffect(() => {
    const prevWindowWidth = window.innerWidth;

    window.onresize = () => {
      const newWindowWidth = window.innerWidth;
      if (newWindowWidth != prevWindowWidth) {
        document.querySelectorAll('.pin').forEach((el: Element) => {
          const pin = el as HTMLDivElement;
          const newPinWidth = newWindowWidth / 6.5;
          const newPinHeigth =
            (newPinWidth * pin.clientHeight) / pin.clientWidth;
          pin.style.width = `${newPinWidth.toFixed(0)}px`;
          pin.style.height = `${newPinHeigth.toFixed(0)}px`;
          setColumnWidth(newPinWidth);
        });
      }
    };
  }, []);

  const handleRemoveLoading = useCallback((elementPin: Element) => {
    const loading = elementPin.parentElement?.querySelector(
      '#loading-pin'
    ) as HTMLDivElement;
    setTimeout(() => {
      loading.style.zIndex = '1';
    }, 100);
  }, []);

  const handleAddDurationVideo = useCallback(
    (videoTime: HTMLSpanElement, duration: string) => {
      videoTime.innerText = duration;
    },
    []
  );

  const handleNoWaitingVideo = useCallback((video: HTMLVideoElement) => {
    const parentVideo = video.parentElement;
    const waitingPin = parentVideo?.querySelector(
      '#waiting-pin'
    ) as HTMLDivElement;
    waitingPin.classList.remove('waiting');
  }, []);

  const handleVideoCompleteLoad = useCallback(
    (video: HTMLVideoElement, midiaIndex: number) => {
      const videoTime = video.parentElement?.querySelector(
        '.video-time'
      ) as HTMLSpanElement;
      handleAddDurationVideo(videoTime, videoDuration(video.duration));
      handleNoWaitingVideo(video);
      handleRemoveLoading(video);
    },
    [handleAddDurationVideo, handleNoWaitingVideo, handleRemoveLoading]
  );

  const handleVideoPlay = useCallback((video: HTMLVideoElement) => {
    const videoTime = video.parentElement?.querySelector(
      '.video-time'
    ) as HTMLSpanElement;
    videoTime.classList.add('hidden-video-time');
  }, []);

  const handleWaitingVideo = useCallback((video: HTMLVideoElement) => {
    const parentVideo = video.parentElement;
    const waitingPin = parentVideo?.querySelector(
      '#waiting-pin'
    ) as HTMLDivElement;
    waitingPin.classList.add('waiting');
  }, []);

  return (
    <MasonryContainer
      $columnWidth={columnWidth}
      $columnCount={columnCount}
      id="masonry"
    >
      {results.map((midiaValue: MidiaResultsType, midiaIndex: number) =>
        midiaValue.midiaType === 'video' ? (
          <div
            // eslint-disable-next-line
            className={`pin-container ${masonryPublishs ? 'pin-publishs-container' : ''}`}
            key={midiaValue._id}
            data-index={
              typeof midiaValue.index != 'undefined' ? midiaValue.index : false
            }
          >
            <Link
              href={`/pin/${midiaValue._id}`}
              className="pin"
              style={{
                width: `${columnWidth.toFixed(0)}px`,
                height: `${calHeight({
                  customWidth: columnWidth,
                  originalHeight: midiaValue.height,
                  originalWidth: midiaValue.width,
                })}px`,
              }}
            >
              <span className="video-time">0:00</span>
              <video
                src={midiaValue.url}
                controls
                preload="metadata"
                onWaiting={event => handleWaitingVideo(event.currentTarget)}
                onPlaying={event => handleNoWaitingVideo(event.currentTarget)}
                onPlay={event => handleVideoPlay(event.currentTarget)}
                onLoadedData={event =>
                  handleVideoCompleteLoad(event.currentTarget, midiaIndex)
                }
              ></video>
              <LoadingPin />
              <WaitingPin />
            </Link>
            {visibleUserInfo && (
              <div className="pin-title-and-user">
                <Link
                  href={`/pin/${midiaValue._id}`}
                  title={upperFirst(midiaValue.title)}
                  className="pin-title"
                >
                  {upperFirst(midiaValue.title)}
                </Link>
                <Link
                  className="pin-original-user"
                  href={`/${midiaValue.userId.username}`}
                >
                  <UserPin {...midiaValue.userId} />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div
            key={midiaValue._id}
            // eslint-disable-next-line
            className={`pin-container ${masonryPublishs ? 'pin-publishs-container' : ''}`}
            data-index={
              typeof midiaValue.index != 'undefined' ? midiaValue.index : false
            }
          >
            <Link
              href={`/pin/${midiaValue._id} `}
              className="pin"
              style={{
                width: `${columnWidth.toFixed(0)}px`,
                height: `${calHeight({
                  customWidth: columnWidth,
                  originalHeight: midiaValue.height,
                  originalWidth: midiaValue.width,
                })}px`,
              }}
            >
              <Image
                src={midiaValue.url}
                alt={midiaValue.title}
                priority
                fill
                sizes="100%"
                onLoadingComplete={element => handleRemoveLoading(element)}
                onError={event => handleRemoveLoading(event.currentTarget)}
              />
              <LoadingPin />
            </Link>
            {visibleUserInfo && (
              <div className="pin-title-and-user">
                <Link
                  href={`/pin/${midiaValue._id} `}
                  title={upperFirst(midiaValue.title)}
                  className="pin-title"
                >
                  {upperFirst(midiaValue.title)}
                </Link>
                <Link
                  className="pin-original-user"
                  href={`/${midiaValue.userId.username} `}
                >
                  <UserPin {...midiaValue.userId} />
                </Link>
              </div>
            )}
          </div>
        )
      )}
    </MasonryContainer>
  );
}
