/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
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
import { usePathname } from 'next/navigation';

import { Container, MasonryContainer } from './styled';
import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import LoadingPin from './LoadingPin';
import WaitingPin from './waitingPin';
import UserPin from './userPin';
import ScrollTop from './scrollTop';
import Category from './category';

interface Props {
  results: MidiaResultsType[];
  visibleUserInfo?: boolean;
  masonryPublishs?: boolean;
  // eslint-disable-next-line
  masonryPage: 'home' | 'new' | 'readHeads' | 'img' | 'video' | 'gif' | 'search' | 'user-midia' | 'user-saves' | 'tags';
  tags?: string[];
  search_query?: string;
  userId?: string;
  username?: string;
}

export default function Masonry({
  results,
  visibleUserInfo,
  masonryPublishs = false,
  masonryPage,
  tags,
  search_query,
  userId,
  username,
}: Props) {
  const pathName = usePathname();

  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState(
    (window.innerWidth - 118) / columnCount
  );
  const [stResults, setStResults] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  let currentPage = useRef(1);
  const midiaType = useRef<'img' | 'gif' | 'video' | undefined>(undefined);
  const order = useRef<'popular' | 'desc' | 'asc'>('popular');

  useEffect(() => {
    // esse effect só vai execultar quando o results do back-end mudar
    if (pathName == '/search' || pathName == `/${username}`) {
      setStResults(results);
      setHasMore(true);
      currentPage.current = 1;
      midiaType.current = undefined;
      order.current = 'popular';
    }
    // console.log('update results');
  }, [results, username, pathName]);

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

  const handleRemoveLoading = useCallback((element: Element | null) => {
    const loading = element?.querySelector('#loading-pin') as HTMLDivElement;
    loading.style.display = 'none';
  }, []);

  const handleNoWaitingVideo = useCallback((element: Element | null) => {
    const waitingPin = element?.querySelector('#waiting-pin');
    waitingPin?.classList.remove('waiting');
  }, []);

  const handleVideoCompleteLoad = useCallback(
    (element: Element | null) => {
      handleNoWaitingVideo(element);
      // handleRemoveLoading(element);
    },
    [handleNoWaitingVideo]
  );

  const handleVideoPlay = useCallback((element: Element | null) => {
    // const videoTime = element?.querySelector('.video-time');
    // videoTime?.classList.add('hidden-video-time');
  }, []);

  const handleWaitingVideo = useCallback((element: Element | null) => {
    const waitingPin = element?.querySelector('#waiting-pin');
    waitingPin?.classList.add('waiting');
  }, []);

  const handleGetElement = (id: string, index: number) => {
    return document.querySelector(`#pin-${id}-${index}`);
  };

  const handleManageNextPage = () => {
    switch (masonryPage) {
      case 'home': {
        useFetchItemsHome(
          setHasMore,
          currentPage,
          midiaType,
          order,
          setStResults
        );
        return;
      }
      case 'new': {
        useFetchItemsNew(setHasMore, currentPage, setStResults);
        return;
      }
      case 'img': {
        midiaType.current = 'img';
        useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        return;
      }
      case 'video': {
        midiaType.current = 'video';
        useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        return;
      }
      case 'gif': {
        midiaType.current = 'gif';
        useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        return;
      }
      case 'tags': {
        if (typeof tags === 'undefined') return;
        useFetchItemsTags(setHasMore, currentPage, order, setStResults, tags);
        return;
      }
      case 'readHeads': {
        if (typeof tags === 'undefined') return;
        useFetchItemsReadHeads(
          setHasMore,
          currentPage,
          order,
          setStResults,
          tags
        );
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

  const handlePLayVideo = (event: MouseEvent<HTMLAnchorElement>) => {
    // if (event.target !== event.currentTarget) return event.stopPropagation();
    const currentTarget = event.currentTarget;
    const pinPLay = currentTarget.querySelector('.pin-play') as HTMLDivElement;
    const pinThumb = currentTarget.querySelector('img') as HTMLImageElement;
    const pinVideo = currentTarget.querySelector('video') as HTMLVideoElement;
    pinThumb.style.zIndex = '1';
    pinPLay.style.zIndex = '2';
    pinVideo.currentTime = 0;
    if (pinVideo.readyState >= 1) pinVideo.play();
  };

  const handlePauseVideo = (event: MouseEvent<HTMLAnchorElement>) => {
    const currentTarget = event.currentTarget;
    const pinPLay = currentTarget.querySelector('.pin-play') as HTMLDivElement;
    const pinThumb = currentTarget.querySelector('img') as HTMLImageElement;
    const pinVideo = currentTarget.querySelector('video') as HTMLVideoElement;
    pinPLay.style.zIndex = '1';
    pinThumb.style.zIndex = '2';
    if (pinVideo.readyState >= 1) pinVideo.pause();
  };

  return (
    <Container>
      {currentPage.current > 2 && <ScrollTop />}
      {/* <div className="category-and-order">
        <Category setStResults={setStResults} midiaType={midiaType} />
      </div> */}
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
          <MasonryUi columnsCount={6} gutter="0">
            {stResults.map(
              (midiaValue: MidiaResultsType, midiaIndex: number) =>
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
                      id={`pin-${midiaValue._id}-${midiaIndex}`}
                      onMouseEnter={handlePLayVideo}
                      onMouseLeave={handlePauseVideo}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={30}
                        height={30}
                        viewBox="0 0 384 512"
                        className="playing-icon"
                      >
                        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                      </svg>
                      <Image
                        src={midiaValue.thumb ? midiaValue.thumb : ''}
                        alt={midiaValue.title}
                        priority
                        fill
                        sizes="100%"
                        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                        onLoadingComplete={() =>
                          handleRemoveLoading(
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                        onError={() =>
                          handleRemoveLoading(
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                      />
                      <ReactPlayer
                        url={midiaValue.url}
                        controls={false}
                        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                        width="100%"
                        height="100%"
                        className="pin-play"
                        // playing
                        muted
                        loop
                        onPlay={() =>
                          handleVideoPlay(
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                        onReady={() =>
                          handleVideoCompleteLoad(
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                        onBuffer={() =>
                          handleWaitingVideo(
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                      />
                      <LoadingPin />
                      {/* <WaitingPin /> */}
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
                    key={`${midiaValue._id}-${midiaIndex}`}
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
                      id={`pin-${midiaValue._id}-${midiaIndex}`}
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
                            handleGetElement(midiaValue._id, midiaIndex)
                          )
                        }
                        onError={() =>
                          handleRemoveLoading(
                            handleGetElement(midiaValue._id, midiaIndex)
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
    </Container>
  );
}

function useFetchItemsHome(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  midiaType: MutableRefObject<'img' | 'video' | 'gif' | undefined>,
  order: MutableRefObject<string>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all?midiaType=${midiaType.current}&order=${order.current}&page=${currentPage.current}`,
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

function useFetchItemsMidiaType(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  order: MutableRefObject<string>,
  midiaType: MutableRefObject<'img' | 'video' | 'gif' | undefined>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>
) {
  // console.log(currentPage.current);
  // console.log(midiaType.current);
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-type/${midiaType.current}?order=${order.current}&page=${currentPage.current}`,
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
  order: MutableRefObject<string>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  tags: string[]
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${tags.join(',')}&order=${order.current}&page=${currentPage.current}`,
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
  order: MutableRefObject<string>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  tags: string[]
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${tags.join(',')}&order=${order.current}&page=${currentPage.current}`,
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
