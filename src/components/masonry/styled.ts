import { styled, css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $columnWidth: number;
  $columnCount: number;
}

export const MasonryContainer = styled.div<TypeTheme & Props>`
  ${({ theme, $columnCount, $columnWidth }) => css`
    display: block;
    padding: 0 1rem;
    column-count: ${$columnCount};
    column-width: ${$columnWidth.toFixed(0)}px;
    column-gap: 1rem;
    width: 100%;

    &#masonry {
      transition: scale 200ms ease-in-out;
    }

    & > .pin-container {
      position: relative;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      /* overflow: hidden; */
      transition: all 200ms ease-in-out;
      break-inside: avoid-column;

      &.selected {
        scale: 0.95;
        border-radius: 1rem;
        position: relative;
        cursor: pointer;

        &::before {
          content: '';
          z-index: 4;
          width: 100%;
          height: 100%;
          background-color: ${theme.colors.g_colorTransparentWhite};
          position: absolute;
        }

        &::after {
          content: '';
          width: 30px;
          height: 60px;
          left: 35%;
          top: 50%;
          transform: rotate(42deg) translate(-35%, -50%);
          position: absolute;
          border-right: 8px solid ${theme.colors.g_colorGray400};
          border-bottom: 8px solid ${theme.colors.g_colorGray400};
          border-radius: 5px;
          z-index: 4;
        }
      }

      & > .select-pin {
        z-index: 2;
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      & > .pin-title-and-user {
        padding: 8px 6px 0;
        display: block;

        & > .pin-title {
          color: ${theme.colors.g_colorGray300};
          font-weight: ${theme.font_weight.font_weight_600};
          font-size: ${theme.font_size.font_size_0_90rem};
          width: fit-content;
          height: 1rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1; /* Define o número máximo de linhas exibidas */
          text-overflow: ellipsis;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }

        & > .pin-original-user {
          display: inline-block;
          width: fit-content;
          margin-top: 7px;
          margin-left: -2px;

          &:hover {
            h4 {
              text-decoration: underline;
            }
          }
        }
      }

      & > .pin {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        flex: none;

        & > .video-time {
          position: absolute;
          z-index: 3;
          color: ${theme.colors.g_colorGray300};
          top: 10px;
          left: 10px;
          background-color: ${theme.colors.g_colore9e9e9};
          padding: 5px 8px;
          border-radius: 3rem;
          font-size: ${theme.font_size.font_size_0_7rem};
          font-weight: ${theme.font_weight.font_weight_500};

          &.hidden-video-time {
            visibility: hidden;
            opacity: 0;
          }
        }

        & > img,
        & > video {
          color: ${theme.colors.g_colorGray300};
          border-radius: 1rem;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;

          &::-webkit-media-controls {
            visibility: hidden;
          }
          &::-webkit-media-controls-enclosure {
            visibility: visible;
          }
        }
      }
    }
  `}
`;
