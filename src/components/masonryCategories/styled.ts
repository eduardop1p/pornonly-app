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

    &#masonry {
      transition: scale 200ms ease-in-out;
    }

    .pin-container {
      position: relative;
      padding: 8px;
      display: flex;
      flex-direction: column;
      /* overflow: hidden; */
      transition: all 200ms ease-in-out;
      /* break-inside: avoid-column; */

      @media (max-width: 1400px) {
        padding: 7px;
      }
      @media (max-width: 800px) {
        padding: 6px;
      }

      & > .pin {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        flex: none;

        img {
          color: ${theme.colors.g_colorGray300};
          border-radius: 1rem;
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 2;

          &::-webkit-media-controls {
            visibility: hidden;
          }
          &::-webkit-media-controls-enclosure {
            visibility: visible;
          }
        }
      }

      & > .title-category {
        color: ${theme.colors.g_colorGray300};
        font-weight: ${theme.font_weight.font_weight_500};
        font-size: ${theme.font_size.font_size_1rem};
        text-align: center;
        width: fit-content;
        display: inline-block;
        margin: 10px auto 4px;

        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }

      & > .category-filters-types {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;

        @media (max-width: 566px) {
          flex-wrap: wrap;
          justify-content: left;
        }
        @media (max-width: 460px) {
          flex-wrap: wrap;
          justify-content: center;
        }

        & > a {
          margin: 4px;
          background-color: ${theme.colors.g_colorGray300};
          color: ${theme.colors.g_colorGray0};
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_500};
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          border-radius: 10px;
          transition: scale 200ms ease-in-out;

          &:hover {
            scale: 1.05;
          }
        }
      }
    }
  `}
`;
