/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
// import { useMediaQuery } from 'react-responsive';
import {
  default as MasonryUi,
  // ResponsiveMasonry,
} from 'react-responsive-masonry';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname } from 'next/navigation';

import { Container, MasonryContainer } from './styled';
import { MidiaResultsType } from '@/app/page';
import ScrollTop from './scrollTop';
import { MidiaTypeFilterType } from '../userPublishs';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';
import { GlobalErrorToastify } from '../form/globalErrorToastify';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccess } from '../form/globalSuccess';
import Loading from '../form/loading';
import Pin from './pin';

interface Props {
  results: MidiaResultsType[];
  visibleUserInfo?: boolean;
  masonryPublishs?: boolean;
  // eslint-disable-next-line
  masonryPage: 'home' | 'new' | 'readHeads' | 'img' | 'video' | 'gif' | 'search' | 'user-midia' | 'user-saves' | 'tags' | 'pending';
  tags?: string[];
  search_query?: string;
  userId?: string;
  username?: string;
  midiaTypeFilter?: 'img' | 'gif' | 'video';
  token?: string;
  isAdmin?: boolean;
  isUniqueUser?: boolean;
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
  midiaTypeFilter,
  token,
  isAdmin,
  isUniqueUser,
}: Props) {
  const pathName = usePathname();

  const [columnCount] = useState(6);
  const [columnWidth, setColumnWidth] = useState(
    (window.innerWidth - 118) / columnCount
  );
  const [stResults, setStResults] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { handleError, msgError } = useGlobalError();
  const { handleServerSuccess, msgGlobalSuccess, showGlobalSuccess } =
    useGlobalSuccessTime();

  let currentPage = useRef(1);
  const midiaType = useRef<MidiaTypeFilterType>(midiaTypeFilter);
  const order = useRef<'popular' | 'desc' | 'asc'>('popular');
  let playPromise = useRef<Promise<void> | undefined>(undefined);

  useEffect(() => {
    // esse effect só vai execultar quando o results do back-end mudar
    if (
      pathName == '/search' ||
      pathName == `/${username}` ||
      pathName == `/created/${username}` ||
      pathName == `/saves/${username}`
    ) {
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
        useFetchItemsTags(
          setHasMore,
          currentPage,
          order,
          setStResults,
          tags,
          midiaType
        );
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
        useFetchItemsUserMidia(
          setHasMore,
          currentPage,
          setStResults,
          userId,
          midiaType
        );
        return;
      }
      case 'user-saves': {
        if (typeof userId === 'undefined') return;
        useFetchItemsUserSaves(
          setHasMore,
          currentPage,
          setStResults,
          userId,
          midiaType
        );
        return;
      }
      case 'pending': {
        useFetchItemsPending(
          setHasMore,
          currentPage,
          setStResults,
          token as string
        );
        return;
      }
      default:
        return;
    }
  };

  const handlePLayVideo = (
    event: MouseEvent<HTMLAnchorElement | HTMLDivElement>
  ) => {
    // if (event.target !== event.currentTarget) return event.stopPropagation();
    const currentTarget = event.currentTarget;
    const pinPLay = currentTarget.querySelector('.pin-play') as HTMLDivElement;
    const pinThumb = currentTarget.querySelector('img') as HTMLImageElement;
    const pinVideo = currentTarget.querySelector('video') as HTMLVideoElement;
    pinThumb.style.zIndex = '1';
    pinPLay.style.zIndex = '2';
    pinVideo.currentTime = 0;
    if (pinVideo.readyState >= 1) playPromise.current = pinVideo.play();
  };

  const handlePauseVideo = (
    event: MouseEvent<HTMLAnchorElement | HTMLDivElement>
  ) => {
    const currentTarget = event.currentTarget;
    const pinPLay = currentTarget.querySelector('.pin-play') as HTMLDivElement;
    const pinThumb = currentTarget.querySelector('img') as HTMLImageElement;
    const pinVideo = currentTarget.querySelector('video') as HTMLVideoElement;
    pinPLay.style.zIndex = '1';
    pinThumb.style.zIndex = '2';
    if (
      pinVideo.readyState >= 1 &&
      typeof playPromise.current !== 'undefined'
    ) {
      // eslint-disable-next-line
      playPromise.current.then(_ => pinVideo.pause());
    }
  };

  return (
    <Container>
      {currentPage.current > 2 && <ScrollTop />}
      {isLoading && <Loading />}
      <GlobalErrorToastify errorMsg={msgError} />
      <GlobalSuccess
        successMsg={msgGlobalSuccess}
        showSuccess={showGlobalSuccess}
      />
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
          <MasonryUi columnsCount={columnCount} gutter="0">
            {stResults.map(
              (midiaValue: MidiaResultsType, midiaIndex: number) => (
                <Pin
                  key={`${midiaValue._id}-${midiaIndex}`}
                  midiaValue={midiaValue}
                  midiaIndex={midiaIndex}
                  columnWidth={columnWidth}
                  handleGetElement={handleGetElement}
                  handlePLayVideo={handlePLayVideo}
                  handlePauseVideo={handlePauseVideo}
                  handleRemoveLoading={handleRemoveLoading}
                  handleVideoCompleteLoad={handleVideoCompleteLoad}
                  handleWaitingVideo={handleWaitingVideo}
                  masonryPublishs={masonryPublishs}
                  isUniqueUser={isUniqueUser}
                  visibleUserInfo={visibleUserInfo}
                  setStResults={setStResults}
                  token={token as string}
                  isAdmin={isAdmin}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  handleError={handleError}
                  handleServerSuccess={handleServerSuccess}
                />
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
  midiaType: MutableRefObject<MidiaTypeFilterType>,
  order: MutableRefObject<string>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all?order=${order.current}&page=${currentPage.current}`,
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
  tags: string[],
  midiaType: MutableRefObject<MidiaTypeFilterType>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${tags.join(',')}&midiaType=${midiaType.current}&order=${order.current}&page=${currentPage.current}`,
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
  userId: string,
  midiaType: MutableRefObject<MidiaTypeFilterType>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?midiaType=${midiaType}&page=${currentPage.current}`,
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
  userId: string,
  midiaType: MutableRefObject<MidiaTypeFilterType>
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?midiaType=${midiaType}&page=${currentPage.current}`,
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

function useFetchItemsPending(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>,
  token: string
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-pending?page=${currentPage.current}`,
        {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
