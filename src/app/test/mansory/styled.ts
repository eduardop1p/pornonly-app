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
    padding: 0 1rem;
    /* width: 100%; */

    & > :not(:last-child) {
      margin-right: ${$marginColumn};
    }

    & > .masonry-column {
      width: calc(100% / ${$columnWidth});
      flex: none;

      & > .pin-container {
        position: relative;
        margin-bottom: ${$marginColumn};

        & > .pin {
          border-radius: 1rem;
        }
      }
    }
  `}
`;
