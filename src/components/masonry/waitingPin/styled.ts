import styled from 'styled-components';

export const WaitingContainer = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  display: none;
  background: transparent;
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.waiting {
    display: inline-block;
  }

  @keyframes loadingAn {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  & > .loading {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(0.5);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */

    & > div {
      position: absolute;
      width: 50px;
      height: 50px;
      border: 8px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: loadingAn 1s linear infinite;
      top: 50px;
      left: 50px;
      box-sizing: content-box;
    }
  }
`;
