import { useRef, ReactNode } from 'react';

import { LoadingPinContainer } from './styled';

export default function LoadingPin({ children }: { children?: ReactNode }) {
  const backgrounds = useRef([
    '#333',
    '#010101',
    '#756048',
    '#66100c',
    '#636361',
    '#4a4f7d',
    '#ee9540',
    '#40372d',
    '#5b4743',
    '#606072',
    '#3a5065',
    '#b59074',
    '#e9e9e9',
    '#e5ddc8',
    '#24302a',
    '#3c517e',
    '#263644',
    '#dcdcd9',
    '#262e38',
    '#2a0e25',
    '#282535',
    '#f6ead5',
    '#312110',
    '#44473b',
    '#838383',
    '#656565',
    '#454545',
    '#5a4026',
    '#a9523a',
  ]);
  const indexBgRamdom = useRef(
    Math.floor(Math.random() * backgrounds.current.length)
  );

  return (
    <LoadingPinContainer
      $backgroundRamdom={backgrounds.current[indexBgRamdom.current]}
      id="loading-pin"
    >
      {children}
    </LoadingPinContainer>
  );
}
