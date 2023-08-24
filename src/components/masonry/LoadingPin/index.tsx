import { LoadingPinContainer } from './styled';

export default function LoadingPin() {
  const backgrounds = [
    '#333',
    '#eb3b3e',
    '#111',
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
    // '#f8f8f8',
  ];
  const indexBgRamdom = Math.floor(Math.random() * backgrounds.length);

  return (
    <LoadingPinContainer $backgroundRamdom={backgrounds[indexBgRamdom]}>
      {/* <p>Carregando...</p> */}
    </LoadingPinContainer>
  );
}
