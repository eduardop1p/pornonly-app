/* eslint-disable prettier/prettier */
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';

interface Props {
  data: MidiaResultsType;
}

export default function Pin({ data }: Props) {
  const [pinDefaultWidth] = useState(500);
  const [pinDefaultHeight] = useState(
    calHeight({
      customWidth: pinDefaultWidth,
      originalWidth: data.width,
      originalHeight: data.height,
    })
  );

  const [pinAlternativeWidth] = useState(800);
  const [pinAlternativeHeigth] = useState(
    calHeight({
      customWidth: pinAlternativeWidth,
      originalWidth: data.width,
      originalHeight: data.height,
    })
  );

  return (
    <Container
      className={`${pinDefaultHeight >= 460 && pinDefaultHeight <= 650
        ? 'pin-one-border-container'
        : ''
        }`}
      style={{
        width: `${pinDefaultHeight < 460 ? pinAlternativeWidth : pinDefaultWidth}px`,
        height: `${pinDefaultHeight < 460 ? pinAlternativeHeigth : pinDefaultHeight}px`,
      }}
    >
      {data.midiaType === 'video' ? (
        <video
          src={data.url}
          preload="metadata"
          controls
          autoPlay
          muted
          loop
        ></video>
      ) : (
        <Image src={data.url} alt={data.title} priority fill sizes="100%" />
      )}
    </Container>
  );
}
