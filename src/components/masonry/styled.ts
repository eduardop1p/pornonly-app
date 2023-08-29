import { styled, css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $columnWidth: number;
  $marginColumn: string;
}

export const MasonryContainer = styled.div<TypeTheme & Props>`
  ${({ theme, $marginColumn, $columnWidth }) => css`
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
        overflow: hidden;

        & > .pin-title-and-user {
          padding: 7px 6px 0;

          & > .pin-title {
            color: ${theme.colors.g_colorGray300};
            font-weight: ${theme.font_weight.font_weight_600};
            font-size: ${theme.font_size.font_size_0_90rem};
            width: 100%;
            height: 1rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1; /* Define o número máximo de linhas exibidas */
            text-overflow: ellipsis;
            cursor: default;
          }

          & > a {
            display: inline-block;
            width: fit-content;
          }
        }

        & > .pin {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;

          & > .video-time {
            position: absolute;
            z-index: 3;
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
    }
  `}
`;
