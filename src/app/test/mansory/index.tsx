'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

import { MasonryContainer } from './styled';

interface Props {
  photos: any;
}

export default function MasonryPin({ photos }: Props) {
  const [columnCount] = useState(6);
  const [columnWidth] = useState(6.5);

  const newPhotos = [];
  const photosArrayLength = Math.ceil(photos.length / columnCount);
  for (let i = 0; i < photos.length; i += photosArrayLength) {
    newPhotos.push(photos.slice(i, i + photosArrayLength));
  }

  const handleLoadImg = useCallback(
    (img: HTMLImageElement) => {
      const parent = img.parentElement as HTMLDivElement;
      const windowWidth = window.innerWidth;
      const aspectoRatio = img.naturalWidth / img.naturalHeight;
      const parentWidth = windowWidth / columnWidth;
      const parentHeight = parentWidth / aspectoRatio;

      // parent.style.width = `${parentWidth.toFixed(2)}px`;
      parent.style.width = `100%`;
      parent.style.height = `${parentHeight.toFixed(2)}px`;
    },
    [columnWidth]
  );

  useEffect(() => {
    window.onresize = () => {
      document.querySelectorAll('.pin').forEach((img: Element) => {
        handleLoadImg(img as HTMLImageElement);
      });
    };
  }, [handleLoadImg]);

  return (
    <div>
      <h2
        style={{
          textAlign: 'center',
          margin: '2rem 0',
          fontFamily: 'monospace',
          fontSize: '1.5rem',
        }}
      >
        Masonry gallery
      </h2>
      <MasonryContainer $columnWidth={columnWidth} $marginColumn="1rem">
        {newPhotos.map((arrays: any, index: number) => (
          <div key={index} className="masonry-column">
            {arrays.map((value: any) => (
              <div key={value.id} className="pin-container">
                <Image
                  className="pin"
                  src={value.src.medium}
                  alt={value.alt}
                  fill
                  sizes="100%"
                  onLoadingComplete={img => handleLoadImg(img)}
                />
              </div>
            ))}
          </div>
        ))}
      </MasonryContainer>
    </div>
  );
}
