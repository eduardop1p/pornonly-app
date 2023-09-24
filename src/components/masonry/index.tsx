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
  justifyContent: 'center' | 'left';
  visibleUserInfo?: boolean;
  masonryPublishs?: boolean;
}

export default function Masonry({
  results,
  justifyContent,
  visibleUserInfo,
  masonryPublishs = false,
}: Props) {
  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState((window.innerWidth - 16) / 6);
  const [newResults, setNewResults] = useState<any[]>([]);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    // if (initialRender) {
    setNewResults([]);
    const resultsLength = Math.ceil(results.length / columnCount);
    for (let i = 0; i < results.length; i += resultsLength) {
      setNewResults(state => [...state, results.slice(i, i + resultsLength)]);
    }
    // setInitialRender(false);
    // }
  }, [columnCount, results, initialRender]);
  console.log(newResults);

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
    const loading = elementPin.nextSibling as HTMLDivElement;
    setTimeout(() => {
      loading.style.zIndex = '1';
    }, 500);
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
    (video: HTMLVideoElement, resultIndex: number, midiaIndex: number) => {
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
    const videoTime = video.previousSibling as HTMLSpanElement;
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
      $marginColumn="1rem"
      $justifyContent={justifyContent}
      id="masonry"
    >
      {newResults.map((midia, resultIndex: number) => (
        <div key={resultIndex} className="masonry-column">
          {midia.map((midiaValue: MidiaResultsType, midiaIndex: number) =>
            midiaValue.midiaType === 'video' ? (
              <div
                // eslint-disable-next-line
                className={`pin-container ${masonryPublishs ? 'pin-publishs-container' : ''}`}
                key={midiaValue._id}
                data-index={
                  typeof midiaValue.index != 'undefined'
                    ? midiaValue.index
                    : false
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
                    controls={true}
                    preload="metadata"
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
                    onPlay={event =>
                      handleVideoPlay(event.currentTarget as HTMLVideoElement)
                    }
                    onLoadedData={event =>
                      handleVideoCompleteLoad(
                        event.currentTarget as HTMLVideoElement,
                        resultIndex,
                        midiaIndex
                      )
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
                  typeof midiaValue.index != 'undefined'
                    ? midiaValue.index
                    : false
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
                  <Image
                    src={midiaValue.url}
                    alt={midiaValue.title}
                    priority
                    fill
                    sizes="100%"
                    onLoadingComplete={element => handleRemoveLoading(element)}
                  />
                  <LoadingPin />
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
            )
          )}
        </div>
      ))}
    </MasonryContainer>
  );
}
