/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

import { MasonryContainer } from './styled';
import { MidiaResults } from '@/app/page';
import calHeight from '@/config/calcHeight';
import LoadingPin from './LoadingPin';

export default function Masonry({ results }: { results: MidiaResults[] }) {
  const [columnCount] = useState(6);
  const [columnWidth] = useState(window.innerWidth / 6.5);

  const newResults = [];
  const resultsLength = Math.ceil(results.length / columnCount);
  for (let i = 0; i < results.length; i += resultsLength) {
    newResults.push(results.slice(i, i + resultsLength));
  }

  // const handleLoadImg = useCallback(
  //   (img: HTMLImageElement) => {
  //     const parent = img.parentElement as HTMLDivElement;
  //     const windowWidth = window.innerWidth;
  //     const aspectoRatio = img.naturalWidth / img.naturalHeight;
  //     const parentWidth = windowWidth / columnWidth;
  //     const parentHeight = parentWidth / aspectoRatio;

  //     // parent.style.width = `${parentWidth.toFixed(2)}px`;
  //     parent.style.width = `100%`;
  //     parent.style.height = `${parentHeight.toFixed(2)}px`;
  //   },
  //   [columnWidth]
  // );

  // useEffect(() => {
  //   window.onresize = () => {
  //     document.querySelectorAll('.pin').forEach((img: Element) => {
  //       handleLoadImg(img as HTMLImageElement);
  //     });
  //   };
  // }, [handleLoadImg]);

  const handleRemoveLoading = (elementPin: Element) => {
    elementPin.nextSibling?.remove();
  };

  return (
    <MasonryContainer $columnWidth={columnWidth} $marginColumn="1rem">
      {newResults.map((midia: any[], index: number) => (
        <div key={index} className="masonry-column">
          {midia.map((midiaValue: MidiaResults) =>
            midiaValue.midiaType === 'video' ? (
              <div className="pin-container" key={midiaValue._id}>
                <div className="pin">
                  <video
                    src={midiaValue.url}
                    width={+columnWidth.toFixed(0)}
                    preload="metadata"
                    onLoadedData={event =>
                      handleRemoveLoading(event.currentTarget)
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
