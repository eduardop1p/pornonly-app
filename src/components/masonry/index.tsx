/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import { useMediaQuery } from 'react-responsive';
import { default as MasonryUi } from 'react-responsive-masonry';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname } from 'next/navigation';
import calHeight from '@/config/calcHeight';

import { Container, MasonryContainer } from './styled';
import { MidiaResultsType } from '@/app/page';
import ScrollTop from './scrollTop';
import { MidiaTypeFilterType } from '../userPublishs';
import { GlobalSuccessComponent } from '../form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import { GlobalErrorComponent } from '../form/globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
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
  if (typeof window === 'undefined') return;

  const pathName = usePathname();

  const maxWidth1400 = useMediaQuery({ maxWidth: 1400 });
  const maxWidth1100 = useMediaQuery({ maxWidth: 1100 });
  const maxWidth800 = useMediaQuery({ maxWidth: 800 });
  const maxWidth600 = useMediaQuery({ maxWidth: 600 });

  const handleWindowInnerWidth = useCallback(() => {
    return maxWidth1400
      ? maxWidth1100
        ? maxWidth800
          ? maxWidth600
            ? 46
            : 58
          : 78
        : 92
      : 118;
  }, [maxWidth1400, maxWidth1100, maxWidth800, maxWidth600]);

  const columnCount = maxWidth1400
    ? maxWidth1100
      ? maxWidth800
        ? maxWidth600
          ? 2
          : 3
        : 4
      : 5
    : 6;
  const columnWidth =
    (window.innerWidth - handleWindowInnerWidth()) / columnCount;
  const [stResults, setStResults] = useState(
    results.map(val => ({
      ...val,
      newWidth: columnWidth.toFixed(2),
      newHeight: calHeight({
        customWidth: +columnWidth.toFixed(2),
        originalHeight: +val.height,
        originalWidth: +val.width,
      }).toFixed(2),
    }))
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();

  let currentPage = useRef(1);
  let midiaType = useRef<MidiaTypeFilterType>(midiaTypeFilter);
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
      setStResults(
        results.map(val => ({
          ...val,
          newWidth: columnWidth.toFixed(2),
          newHeight: calHeight({
            customWidth: +columnWidth.toFixed(2),
            originalHeight: +val.height,
            originalWidth: +val.width,
          }).toFixed(2),
        }))
      );
      setHasMore(true);
      currentPage.current = 1;
      midiaType.current = undefined;
      order.current = 'popular';
    }
    // console.log('update results');
  }, [results, username, pathName, columnWidth]);

  const handleOnresize = useCallback(() => {
    const newWindowWidth = window.innerWidth - handleWindowInnerWidth();
    const newWColumnWidth = newWindowWidth / columnCount;
    setStResults(state =>
      state.map(val => ({
        ...val,
        newWidth: newWColumnWidth.toFixed(2),
        newHeight: calHeight({
          customWidth: +newWColumnWidth.toFixed(2),
          originalHeight: +val.height,
          originalWidth: +val.width,
        }).toFixed(2),
      }))
    );
  }, [columnCount, handleWindowInnerWidth]);

  useEffect(() => {
    handleOnresize();
  }, [columnCount, handleOnresize]);

  useEffect(() => {
    window.addEventListener('resize', handleOnresize);

    return () => removeEventListener('resize', handleOnresize);
  }, [columnCount, handleOnresize]);

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

  const handleManageNextPage = async () => {
    switch (masonryPage) {
      case 'home': {
        await useFetchItemsHome(
          setHasMore,
          currentPage,
          midiaType,
          order,
          setStResults
        );
        handleOnresize();
        return;
      }
      case 'new': {
        await useFetchItemsNew(setHasMore, currentPage, setStResults);
        handleOnresize();
        return;
      }
      case 'img': {
        midiaType.current = 'img';
        await useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        handleOnresize();
        return;
      }
      case 'video': {
        midiaType.current = 'video';
        await useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        handleOnresize();
        return;
      }
      case 'gif': {
        midiaType.current = 'gif';
        await useFetchItemsMidiaType(
          setHasMore,
          currentPage,
          order,
          midiaType,
          setStResults
        );
        handleOnresize();
        return;
      }
      case 'tags': {
        if (typeof tags === 'undefined') return;
        await useFetchItemsTags(
          setHasMore,
          currentPage,
          order,
          setStResults,
          tags,
          midiaType
        );
        handleOnresize();
        return;
      }
      case 'readHeads': {
        if (typeof tags === 'undefined') return;
        await useFetchItemsReadHeads(
          setHasMore,
          currentPage,
          order,
          setStResults,
          tags
        );
        handleOnresize();
        return;
      }
      case 'search': {
        if (typeof search_query === 'undefined') return;
        await useFetchItemsSearch(
          setHasMore,
          currentPage,
          setStResults,
          search_query
        );
        handleOnresize();
        return;
      }
      case 'user-midia': {
        if (typeof userId === 'undefined') return;
        midiaType.current = midiaTypeFilter;
        await useFetchItemsUserMidia(
          setHasMore,
          currentPage,
          setStResults,
          userId,
          midiaType
        );
        handleOnresize();
        return;
      }
      case 'user-saves': {
        if (typeof userId === 'undefined') return;
        midiaType.current = midiaTypeFilter;
        await useFetchItemsUserSaves(
          setHasMore,
          currentPage,
          setStResults,
          userId,
          midiaType
        );
        handleOnresize();
        return;
      }
      case 'pending': {
        await useFetchItemsPending(
          setHasMore,
          currentPage,
          setStResults,
          token as string
        );
        handleOnresize();
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
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess} />
      <MasonryContainer id="masonry">
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
                  handleSuccess={handleSuccess}
                />
              )
            )}
          </MasonryUi>
        </InfiniteScroll>
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
      console.log(results);
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
      alert(err);
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
      alert(err);
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
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?midiaType=${midiaType.current}&page=${currentPage.current}`,
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
      setStResults(state => [
        ...state,
        ...results.map((value, index: number) => ({ ...value, index })),
      ]);
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
        `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?midiaType=${midiaType.current}&page=${currentPage.current}`,
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
