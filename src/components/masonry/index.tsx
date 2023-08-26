/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { MasonryContainer } from './styled';
import { MidiaResults } from '@/app/page';
import calHeight from '@/config/calcHeight';
import videoDuration from '@/config/calcDuration';
import LoadingPin from './LoadingPin';
import WaitingPin from './waitingPin';

export default function Masonry({ results }: { results: MidiaResults[] }) {
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
    window.onresize = () => {
      const windowWidth = window.innerWidth;
      document.querySelectorAll('.pin').forEach((el: Element) => {
        const pin = el as HTMLDivElement;
        const newPinWidth = windowWidth / 6.5;
        const newPinHeigth = (newPinWidth * pin.clientHeight) / pin.clientWidth;
        pin.style.width = `${newPinWidth.toFixed(0)}px`;
        pin.style.height = `${newPinHeigth.toFixed(0)}px`;
        setColumnWidth(newPinWidth);
      });
    };
  }, []);

  const handleRemoveLoading = (elementPin: Element) => {
    const loading = elementPin.nextSibling as HTMLDivElement;
    loading.style.zIndex = '-1';
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
    <MasonryContainer $columnWidth={columnWidth} $marginColumn="1rem">
      {newResults.map((midia, resultIndex: number) => (
        <div key={resultIndex} className="masonry-column">
          {midia.map((midiaValue: MidiaResults, midiaIndex: number) =>
            midiaValue.midiaType === 'video' ? (
              <div className="pin-container" key={midiaValue._id}>
                <div
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
                </div>
                <h4 className="pin-title">{midiaValue.title}</h4>
              </div>
            ) : (
              <div key={midiaValue._id} className="pin-container">
                <div
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
                </div>
                <h4 className="pin-title">{midiaValue.title}</h4>
              </div>
            )
          )}
        </div>
      ))}
    </MasonryContainer>
  );
}
