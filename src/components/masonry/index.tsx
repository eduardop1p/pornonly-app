/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
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
}

export default function Masonry({
  results,
  justifyContent,
  visibleUserInfo,
}: Props) {
  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState(window.innerWidth / 6.5);
  const [newResults, setNewResults] = useState<any[]>([]);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      const resultsLength = Math.ceil(results.length / columnCount);
      for (let i = 0; i < results.length; i += resultsLength) {
        setNewResults(state => [...state, results.slice(i, i + resultsLength)]);
      }
      setInitialRender(false);
    }
  }, [columnCount, results, initialRender]);

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

  const handleRemoveLoading = (elementPin: Element) => {
    const loading = elementPin.nextSibling as HTMLDivElement;
    setTimeout(() => {
      loading.style.zIndex = '1';
    }, 500);
  };

  const handleVideoCompleteLoad = (
    video: HTMLVideoElement,
    resultIndex: number,
    midiaIndex: number
  ) => {
    handleAddDurationVideo(
      resultIndex,
      midiaIndex,
      videoDuration(video.duration)
    );
    handleNoWaitingVideo(video);
    handleRemoveLoading(video);
  };

  const handleAddDurationVideo = (
    resultIndex: number,
    midiaIndex: number,
    duration: string
  ) => {
    const updateNewResults = [...newResults];
    updateNewResults[resultIndex][midiaIndex].duration = duration;
    setNewResults(updateNewResults);
  };

  const handleVideoPlay = (video: HTMLVideoElement) => {
    const videoTime = video.previousSibling as HTMLSpanElement;
    videoTime.classList.add('hidden-video-time');
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
    <MasonryContainer
      $columnWidth={columnWidth}
      $marginColumn="1rem"
      $justifyContent={justifyContent}
    >
      {newResults.map((midia, resultIndex: number) => (
        <div key={resultIndex} className="masonry-column">
          {midia.map((midiaValue: MidiaResultsType, midiaIndex: number) =>
            midiaValue.midiaType === 'video' ? (
              <div className="pin-container" key={midiaValue._id}>
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
                  <span className="video-time">{midiaValue.duration}</span>
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
                    onLoadedMetadata={event =>
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
              <div key={midiaValue._id} className="pin-container">
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
