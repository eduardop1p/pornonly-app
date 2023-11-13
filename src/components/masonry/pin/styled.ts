import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: relative;
    padding: 8px;
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
    transition: all 200ms ease-in-out;
    /* break-inside: avoid-column; */

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
      z-index: 3;
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    & > .pin-title-and-user {
      padding: 8px 6px 0;
      display: block;
      width: 100%;

      & > .pin-title {
        color: ${theme.colors.g_colorGray300};
        font-weight: ${theme.font_weight.font_weight_600};
        font-size: ${theme.font_size.font_size_0_90rem};
        width: 100%;
        line-height: 1.2;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* Define o número máximo de linhas exibidas */
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      & > .pin-original-user {
        display: inline-block;
        width: 100%;
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

      &.pin-pending {
        &::before {
          content: '';
          position: absolute;
          background-color: ${theme.colors.g_colore9e9e9};
          opacity: 0.8;
          z-index: 3;
          width: 100%;
          height: 100%;
        }

        & > .title-pending {
          position: absolute;
          z-index: 3;
          right: 10px;
          top: 10px;
          /* transform: translate(-50%, -50%); */
          color: ${theme.colors.g_colorGray0};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          height: 40px;
          border-radius: 1.5rem;
          background-color: ${theme.colors.g_colorRed100};
          font-weight: ${theme.font_weight.font_weight_500};
          font-size: ${theme.font_size.font_size_0_90rem};
        }
      }

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

      & > .playing-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 3;
        transform: translate(-50%, -50%);
        fill: ${theme.colors.g_colorGray0};
      }

      img,
      video {
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
  `}
`;
