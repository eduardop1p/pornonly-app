/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import styles from './styles.module.css';

interface Props {
  photos: any;
}

export default function MasonryPin({ photos }: Props) {
  const newPhotos = [];
  const photosArrayLenght = Math.ceil(photos.length / 6);
  for (let i = 0; i < photos.length; i += photosArrayLenght) {
    newPhotos.push(photos.slice(i, i + photosArrayLenght));
  }

  const handleLoadImg = (img: HTMLImageElement) => {
    const parent = img.parentElement as HTMLDivElement;
    const aspectoRatio = img.naturalWidth / img.naturalHeight;
    const parentWidth = parent.clientWidth;

    parent.style.width = `${parentWidth}px`;
    parent.style.height = `${parentWidth / aspectoRatio}px`;
  };

  // usar calc no width
  return (
    <div className={styles.masonry}>
      {newPhotos.map((arrays: any, index: number) => (
        <div key={index} className={styles['masonry-column']}>
          {arrays.map((value: any) => (
            <div key={value.id} className={styles['pin-container']}>
              <Image
                className={styles.pin}
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
    </div>
  );
}
