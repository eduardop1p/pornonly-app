import { styled } from 'styled-components';

export const LoadingPinContainer = styled.div<{ $backgroundRamdom: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $backgroundRamdom }) => $backgroundRamdom};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 4;
  top: 0;

  & > p {
    font-size: 500;
    font-size: 14px;
    color: #fff;
  }

  @keyframes rotateLoading {
    100% {
      transform: rotate(360deg);
    }
  }
  & > svg {
    animation-name: rotateLoading;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
`;
