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

  const [columnCount] = useState(5);
  const [columnWidth] = useState((window.innerWidth - 102) / columnCount);
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

  useEffect(() => {
    const onresize = () => {
      const newWindowWidth = window.innerWidth - 102;
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
    };

    window.addEventListener('resize', onresize);

    return () => removeEventListener('resize', onresize);
  }, [columnCount]);

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
