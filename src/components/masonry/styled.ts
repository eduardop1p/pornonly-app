import { styled, css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $columnWidth: number;
  $columnCount: number;
}

export const Container = styled.div`
  padding: 0 3px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const MasonryContainer = styled.div<TypeTheme & Props>`
  ${({ theme, $columnCount, $columnWidth }) => css`
    /* column-count: ${$columnCount};
    column-width: ${$columnWidth.toFixed(0)}px;
    column-gap: 1rem; */
    width: 100%;

    & > .category-and-order {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 8px 0;
    }

    &#masonry {
      transition: scale 200ms ease-in-out;
    }

    .no-more-results {
      position: absolute;
      margin-top: 10px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-weight: ${theme.font_weight.font_weight_400};
      font-size: ${theme.font_size.font_size_1rem};
    }
  `}
`;
