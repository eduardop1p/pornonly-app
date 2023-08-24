import { styled } from 'styled-components';

export const LoadingPinContainer = styled.div<{ $backgroundRamdom: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundRamdom }) => $backgroundRamdom};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  top: 0;

  & > p {
    font-size: 500;
    font-size: 14px;
    color: #fff;
  }
`;
