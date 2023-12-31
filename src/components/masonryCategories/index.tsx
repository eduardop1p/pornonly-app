/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { deburr } from 'lodash';
import {
  default as MasonryUi,
  ResponsiveMasonry,
} from 'react-responsive-masonry';

import { Container, MasonryContainer } from './styled';
import calHeight from '@/config/calcHeight';
import LoadingPin from '../masonry/LoadingPin';
import { CategoryType } from '@/app/categories/page';

interface Props {
  results: CategoryType[];
}

export default function MasonryCategories({ results }: Props) {
  if (typeof window === 'undefined') return;

  const maxWidth1400 = useMediaQuery({ maxWidth: 1400 });
  const maxWidth1100 = useMediaQuery({ maxWidth: 1100 });
  const maxWidth800 = useMediaQuery({ maxWidth: 800 });
  const maxWidth600 = useMediaQuery({ maxWidth: 600 });

  const handleWindowInnerWidth = useCallback(() => {
    return maxWidth1400 ? (maxWidth1100 ? (maxWidth800 ? 46 : 64) : 78) : 102;
  }, [maxWidth1400, maxWidth1100, maxWidth800]);

  const columnCount = maxWidth1400
    ? maxWidth1100
      ? maxWidth800
        ? 2
        : 3
      : 4
    : 5;

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

  const handleGetElement = (id: string, index: number) => {
    return document.querySelector(`#pin-${id}-${index}`);
  };

  const clearPathName = (pathName: string) => {
    return deburr(pathName.replaceAll(' ', '-').toLowerCase());
  };
  return (
    <Container>
      <MasonryContainer
        $columnWidth={columnWidth}
        $columnCount={columnCount}
        id="masonry"
      >
        {/* <ResponsiveMasonry> */}
        <MasonryUi columnsCount={columnCount} gutter="0">
          {stResults.map((midiaValue: CategoryType, midiaIndex: number) => (
            <div
              key={`${midiaValue._id}-${midiaIndex}`}
              className="pin-container"
              style={{ width: '100%' }}
            >
              <Link
                href={`/categories/${clearPathName(midiaValue.tag)}`}
                className="pin"
                id={`pin-${midiaValue._id}-${midiaIndex}`}
                style={{
                  width: '100%',
                  height: `${midiaValue.newHeight}px`,
                }}
              >
                <Image
                  src={midiaValue.url}
                  alt={midiaValue.title}
                  priority
                  fill
                  sizes="100%"
                  onLoad={() =>
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
              <Link
                href={`/categories/${clearPathName(midiaValue.tag)}`}
                className="title-category"
              >
                {midiaValue.tag}
              </Link>
              <div className="category-filters-types">
                <Link
                  href={`/categories/${clearPathName(
                    midiaValue.tag
                  )}?midiaType=img`}
                >
                  Imagens
                </Link>
                <Link
                  href={`/categories/${clearPathName(
                    midiaValue.tag
                  )}?midiaType=video`}
                >
                  Videos
                </Link>
                <Link
                  href={`/categories/${clearPathName(
                    midiaValue.tag
                  )}?midiaType=gif`}
                >
                  Gifs
                </Link>
              </div>
            </div>
          ))}
        </MasonryUi>
        {/* </ResponsiveMasonry> */}
      </MasonryContainer>
    </Container>
  );
}
