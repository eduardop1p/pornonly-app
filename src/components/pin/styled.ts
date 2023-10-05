/* eslint-disable */
import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
      position: relative;
      flex: none;
      overflow: hidden;

      &.pin-one-border-container {
        margin: 1.2rem 0 1.2rem 1.2rem;
        align-self: center;
      }

      & > img,
      & > video {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 2;

        &::-webkit-media-controls {
          visibility: hidden;
        }
        &::-webkit-media-controls-enclosure {
          visibility: visible;
        }
      }
  `}
`;
