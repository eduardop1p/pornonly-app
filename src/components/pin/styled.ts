/* eslint-disable */
import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
      position: relative;
      flex: none;

      &.pin-one-border-container {
        margin: 1.2rem 0 1.2rem 1.2rem;
        align-self: center;

        & > img,
        & > video {
          border-radius: 1rem;
        }
      }

      & > img,
      & > video {
        width: 100%;
        height: 100%;

        &::-webkit-media-controls {
          visibility: hidden;
        }
        &::-webkit-media-controls-enclosure {
          visibility: visible;
        }
      }
  `}
`;
