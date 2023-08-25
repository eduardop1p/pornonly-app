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

        & > .pin-title {
          margin-top: 8px;
        }

        & > .pin {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;

          & > .video-time {
            position: absolute;
            z-index: 2;
            top: 10px;
            left: 10px;
            background-color: ${theme.colors.g_colore9e9e9};
            padding: 5px 8px;
            border-radius: 2rem;
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
            z-index: 1;

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
