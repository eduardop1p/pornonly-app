/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { upperFirst } from 'lodash';
import ReactPlayer from 'react-player';
import {
  default as MasonryUi,
  ResponsiveMasonry,
} from 'react-responsive-masonry';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [stResults, setStResults] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  let currentPage = useRef(1);

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
  }, [columnCount]);

  useEffect(() => {
    window.document.body.id = 'scrollableDiv';
  }, []);

  const fetchItems = async () => {
    currentPage.current += 1;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all?page=${currentPage.current}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );

    const data = await res.json();
    const results = data.midia.results as MidiaResultsType[];
    if (!results.length) {
      setHasMore(false);
      return;
    }
    setStResults(state => [...state, ...results]);
  };

  const handleRemoveLoading = useCallback((element: Element) => {
    const loading = element.querySelector('#loading-pin') as HTMLDivElement;
    setTimeout(() => {
      loading.style.display = 'none';
    }, 100);
  }, []);

  const handleAddDurationVideo = useCallback(
    (videoTime: HTMLSpanElement, duration: string) => {
      videoTime.innerText = duration;
    },
    []
  );

  const handleNoWaitingVideo = useCallback((element: Element) => {
    const waitingPin = element.querySelector('#waiting-pin') as HTMLDivElement;
    waitingPin.classList.remove('waiting');
  }, []);

  const handleVideoCompleteLoad = useCallback(
    (element: Element) => {
      const videoTime = element.querySelector('.video-time') as HTMLSpanElement;
      const videoDurationC = element.querySelector('video')?.duration as number;
      handleAddDurationVideo(videoTime, videoDuration(videoDurationC));
      handleNoWaitingVideo(element);
      handleRemoveLoading(element);
    },
    [handleAddDurationVideo, handleNoWaitingVideo, handleRemoveLoading]
  );

  const handleVideoPlay = useCallback((element: Element) => {
    const videoTime = element.querySelector('.video-time') as HTMLSpanElement;
    videoTime.classList.add('hidden-video-time');
  }, []);

  const handleWaitingVideo = useCallback((element: Element) => {
    const waitingPin = element.querySelector('#waiting-pin') as HTMLDivElement;
    waitingPin.classList.add('waiting');
  }, []);

  return (
    <MasonryContainer
      $columnWidth={columnWidth}
      $columnCount={columnCount}
      id="masonry"
    >
      {/* <ResponsiveMasonry> */}
      <InfiniteScroll
        dataLength={stResults.length}
        scrollThreshold={0.7}
        next={fetchItems}
        scrollableTarget="scrollableDiv"
        hasMore={hasMore}
        loader={null}
        endMessage={
          <span className="no-more-results">Não há mais nada por aqui</span>
        }
      >
        <MasonryUi columnsCount={6}>
          {stResults.map((midiaValue: MidiaResultsType, midiaIndex: number) =>
            midiaValue.midiaType === 'video' ? (
              <div
                // eslint-disable-next-line
                className={`pin-container ${masonryPublishs ? 'pin-publishs-container' : ''}`}
                key={`${midiaValue._id}-${midiaIndex}`}
                data-index={
                  typeof midiaValue.index != 'undefined'
                    ? midiaValue.index
                    : false
                }
              >
                <Link
                  href={`/pin/${midiaValue._id}`}
                  className="pin"
                  id={`pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`}
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
                  <ReactPlayer
                    url={midiaValue.url}
                    controls
                    width="100%"
                    height="100%"
                    onPlay={() =>
                      handleVideoPlay(
                        document.querySelector(
                          `#pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`
                        ) as HTMLElement
                      )
                    }
                    onReady={() =>
                      handleVideoCompleteLoad(
                        document.querySelector(
                          `#pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`
                        ) as HTMLElement
                      )
                    }
                    onBuffer={() =>
                      handleWaitingVideo(
                        document.querySelector(
                          `#pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`
                        ) as HTMLElement
                      )
                    }
                  />
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
                  href={`/pin/${midiaValue._id} `}
                  className="pin"
                  id={`pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`}
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
                    onLoadingComplete={() =>
                      handleRemoveLoading(
                        document.querySelector(
                          `#pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`
                        ) as HTMLElement
                      )
                    }
                    onError={() =>
                      handleRemoveLoading(
                        document.querySelector(
                          `#pin-${midiaValue._id}-${midiaValue.midiaType}-${midiaIndex}`
                        ) as HTMLElement
                      )
                    }
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
        </MasonryUi>
      </InfiniteScroll>
      {/* </ResponsiveMasonry> */}
    </MasonryContainer>
  );
}
