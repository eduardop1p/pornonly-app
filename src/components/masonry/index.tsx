/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { MasonryContainer } from './styled';
import { MidiaResults } from '@/app/page';
import calHeight from '@/config/calcHeight';
import videoDuration from '@/config/calcDuration';
import LoadingPin from './LoadingPin';

export default function Masonry({ results }: { results: MidiaResults[] }) {
  const [columnCount] = useState(6);
  const [columnWidth] = useState(window.innerWidth / 6.5);
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

  const handleRemoveLoading = (elementPin: Element) => {
    elementPin.nextSibling?.remove();
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

  const handleHidderDuration = (video: HTMLVideoElement) => {
    const videoTime = video.previousSibling as HTMLSpanElement;
    videoTime.classList.add('hidden-video-time');
  };

  return (
    <MasonryContainer $columnWidth={columnWidth} $marginColumn="1rem">
      {newResults.map((midia, resultIndex: number) => (
        <div key={resultIndex} className="masonry-column">
          {midia.map((midiaValue: MidiaResults, midiaIndex: number) =>
            midiaValue.midiaType === 'video' ? (
              <div className="pin-container" key={midiaValue._id}>
                <div className="pin">
                  <span className="video-time">{midiaValue.duration}</span>
                  <video
                    src={midiaValue.url}
                    width={+columnWidth.toFixed(0)}
                    preload="auto"
                    onPlay={event =>
                      handleHidderDuration(
                        event.currentTarget as HTMLVideoElement
                      )
                    }
                    onLoadedData={event =>
                      handleVideoCompleteLoad(
                        event.currentTarget as HTMLVideoElement,
                        resultIndex,
                        midiaIndex
                      )
                    }
                    onError={event =>
                      handleVideoCompleteLoad(
                        event.currentTarget as HTMLVideoElement,
                        resultIndex,
                        midiaIndex
                      )
                    }
                    height={calHeight({
                      customWidth: columnWidth,
                      originalHeight: midiaValue.height,
                      originalWidth: midiaValue.width,
                    })}
                    controls={true}
                  ></video>
                  <LoadingPin />
                </div>
                <h4 className="pin-title">{midiaValue.title}</h4>
              </div>
            ) : (
              <div key={midiaValue._id} className="pin-container">
                <div className="pin">
                  <Image
                    src={midiaValue.url}
                    alt={midiaValue.title}
                    width={+columnWidth.toFixed(0)}
                    onLoadingComplete={element => handleRemoveLoading(element)}
                    height={calHeight({
                      customWidth: columnWidth,
                      originalHeight: midiaValue.height,
                      originalWidth: midiaValue.width,
                    })}
                    priority
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
