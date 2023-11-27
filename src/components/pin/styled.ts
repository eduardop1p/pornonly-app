/* eslint-disable */
import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
      position: relative;
      flex: none;
      overflow: hidden;
      border-radius: 1rem;

      img,
      video {
        border-radius: 1rem;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
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
