import { styled, css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $columnWidth: number;
  $marginColumn: string;
}

export const MasonryContainer = styled.div<TypeTheme & Props>`
  ${({ $marginColumn, $columnWidth }) => css`
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    width: 100%;

    & > :not(:last-child) {
      margin-right: ${$marginColumn};
    }

    & > .masonry-column {
      width: ${$columnWidth.toFixed(0)}px;
      flex: none;

      & > .pin-container {
        position: relative;
        margin-bottom: ${$marginColumn};
        display: flex;
        flex-direction: column;

        & > .pin-title {
          margin-top: 8px;
        }

        & > .pin {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;

          & > img,
          & > video {
            border-radius: 1rem;
          }
        }
      }
    }
  `}
`;
