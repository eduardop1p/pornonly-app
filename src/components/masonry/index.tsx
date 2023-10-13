/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
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
  // eslint-disable-next-line
  masonryPage: 'home' | 'new' | 'readHeads' | 'search' | 'user-midia' | 'user-saves' | 'tags';
  tags?: string[];
  search_query?: string;
  userId?: string;
}

export default function Masonry({
  results,
  visibleUserInfo,
  masonryPublishs = false,
  masonryPage,
  tags,
  search_query,
  userId,
}: Props) {
  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState(
    (window.innerWidth - 132) / columnCount
  );
  const [stResults, setStResults] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  let currentPage = useRef(1);

  useEffect(() => {
    // esse effect só vai execultar quando o results do back-end mudar
    if (location.pathname == '/search') {
      setStResults(results);
      setHasMore(true);
      currentPage.current = 1;
    }
    // console.log('update results');
  }, [results]);

  useEffect(() => {
    const prevWindowWidth = window.innerWidth;
    const onresize = () => {
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

    window.addEventListener('resize', onresize);

    return () => removeEventListener('resize', onresize);
  }, [columnCount]);

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

  const handleManageNextPage = () => {
    switch (masonryPage) {
      case 'home': {
        useFetchItemsHome(setHasMore, currentPage, setStResults);
        return;
      }
      case 'new': {
        useFetchItemsNew(setHasMore, currentPage, setStResults);
        return;
      }
      case 'tags': {
        if (typeof tags === 'undefined') return;
        useFetchItemsTags(setHasMore, currentPage, setStResults, tags);
        return;
      }
      case 'readHeads': {
        if (typeof tags === 'undefined') return;
        useFetchItemsReadHeads(setHasMore, currentPage, setStResults, tags);
        return;
      }
      case 'search': {
        if (typeof search_query === 'undefined') return;
        useFetchItemsSearch(
          setHasMore,
          currentPage,
          setStResults,
          search_query
        );
        return;
      }
      case 'user-midia': {
        if (typeof userId === 'undefined') return;
        useFetchItemsUserMidia(setHasMore, currentPage, setStResults, userId);
        return;
      }
      case 'user-saves': {
        if (typeof userId === 'undefined') return;
        useFetchItemsUserSaves(setHasMore, currentPage, setStResults, userId);
        return;
      }
      default:
        return;
    }
  };

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
        next={handleManageNextPage}
        hasMore={hasMore}
        loader={null}
        endMessage={<span className="no-more-results">{`Isso é tudo`}</span>}
        style={{ overflow: 'hidden' }}
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

function useFetchItemsHome(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>
) {
  const fetchItems = async () => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  return fetchItems();
}

function useFetchItemsNew(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-day?page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}

function useFetchItemsTags(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  tags: string[]
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${tags.join(',')}&page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}

function useFetchItemsReadHeads(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  tags: string[]
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${tags.join(',')}&page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}

function useFetchItemsSearch(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  search_query: string
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search?search_query=${search_query}&page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}

function useFetchItemsUserMidia(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  userId: string
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}

function useFetchItemsUserSaves(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  userId: string
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?page=${currentPage.current}`,
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
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}
