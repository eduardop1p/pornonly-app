import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $showComments: boolean;
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme, $showComments }) => css`
    position: relative;
    overflow: hidden;

    & > .title-and-icon {
      display: flex;
      align-items: center;

      & > h2 {
        font-size: ${theme.font_size.font_size_1_25rem};
        font-weight: ${theme.font_weight.font_weight_500};
        color: ${theme.colors.g_colorGray300};
      }

      & > .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        cursor: pointer;

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        & > svg {
          flex: none;
          transition: rotate 200ms ease-in-out;
          rotate: ${!$showComments ? '-90deg' : '0'};
        }
      }
    }

    & > .comments-and-users {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      position: absolute;
      width: 100%;
      height: calc(100% - 183px);
      overflow-y: auto;
      /* padding-bottom: 1rem; */

      &[data-show-comments='false'] {
        display: none;
      }

      & > .container-comments {
        margin-right: 1rem;
      }

      & > :not(:last-child) {
        margin-bottom: 1rem;
      }

      & > .pin-no-comments {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -40%);
        width: calc(100% - 2rem);
        display: flex;
        flex-direction: column;
        align-items: center;

        & > svg {
          flex: none;
          margin-bottom: 5px;
          fill: ${theme.colors.g_color5f5f5f};
        }

        & > span {
          text-align: center;
          font-weight: ${theme.font_weight.font_weight_400};
          font-size: ${theme.font_size.font_size_1rem};
          color: ${theme.colors.g_color5f5f5f};
        }
      }
    }

    & > .add-comments {
      position: absolute;
      bottom: 0;
      background-color: ${theme.colors.g_colorGray0};
      display: flex;
      padding-top: 8px;
      flex-direction: column;
      width: 100%;
      border-top: 1px solid ${theme.colors.g_colorBgRgb_229};

      & > .commet-title-and-likes {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        & > .comments-count {
          font-size: ${theme.font_size.font_size_1_25rem};
          font-weight: ${theme.font_weight.font_weight_600};
          color: ${theme.colors.g_colorGray300};
        }

        & > div {
          display: flex;
          align-items: center;

          & > span {
            color: ${theme.colors.g_colorGray300};
            font-size: ${theme.font_size.font_size_1rem};
            font-weight: ${theme.font_weight.font_weight_500};
          }
        }
      }
    }
  `}
`;

export const LikeContainer = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.g_colore9e9e9};
    margin-left: 12px;
    border-radius: 100%;

    &[data-is-like='true'] {
      background-color: ${theme.colors.g_colorRed4};
    }

    & > button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 24px;
      height: 24px;

      & > svg {
        flex: none;
        width: 100%;
        height: 100%;
        display: inline-block;

        @keyframes like-animaton {
          0%,
          to {
            transform: scale(1);
          }
          15% {
            transform: scale(1.2);
          }
          30% {
            transform: scale(0.95);
          }
          45%,
          80% {
            transform: scale(1);
          }
        }

        &.yes-like {
          fill: ${theme.colors.g_colorRed100};
          animation-name: like-animaton;
          animation-duration: 800ms;
          animation-timing-function: linear;
        }
        &.no-like {
          color: ${theme.colors.g_colorGray300};
        }
      }
    }

    /*

    [data-like-animaton='true'] {
      animation-name: 'likeAnimaton';
      animation-duration: 1s;
      animation-timing-function: linear;
    }

    & > svg {
      width: 100%;
      height: 100%;

      & > path {
        cursor: pointer;
      }
    } */
  `}
`;
