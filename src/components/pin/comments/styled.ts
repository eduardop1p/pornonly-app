import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $showComments: boolean;
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme }) => css`
    /* position: relative; */
    /* overflow: hidden; */

    & > .container-comments-scrollab {
      padding: 0 2rem;

      @media (max-width: 1400px) {
        padding: 0 1.5rem;
      }

      & > .btn-to-comments {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        left: 50%;
        top: 58%;
        transform: translate(-50%, -58%);
        cursor: pointer;
        text-align: center;
        font-weight: ${theme.font_weight.font_weight_400};
        font-size: ${theme.font_size.font_size_1rem};
        color: ${theme.colors.g_color5f5f5f};
        transition: color 200ms ease-in-out;

        @media (max-width: 1000px) {
          display: none;
        }

        &:hover {
          color: ${theme.colors.g_colorGray300};

          & > svg {
            transform: scale(1.05);
            fill: ${theme.colors.g_colorGray300};
          }
        }

        & > svg {
          flex: none;
          margin-bottom: 5px;
          fill: ${theme.colors.g_color5f5f5f};
          transition:
            transform 200ms ease-in-out,
            fill 200ms ease-in-out;
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

export const ContainerCommentsAndUsers = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    top: 0;
    width: 100%;
    height: calc(100% - 151px);
    overflow: hidden auto;
    background-color: ${theme.colors.g_colorGray0};
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 300ms ease-in-out,
      visibility 300ms ease-in-out;

    @media (max-width: 1000px) {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 3;
      background-color: ${theme.colors.g_colorTransparentGray800};
      overflow: hidden;
    }

    &[data-show-comments='true'] {
      opacity: 1;
      visibility: visible;
    }

    & > .container-fixed-comments {
      width: 100%;
      height: 100%;
      background-color: ${theme.colors.g_colorGray0};
      overflow: hidden;
      transform: translateX(100%);
      transition: transform 300ms ease-in-out;

      &[data-show-comments='true'] {
        /* visibility: visible; */
        transform: translateX(0);
      }

      @media (max-width: 1000px) {
        position: absolute;
        top: 25%;
        height: 75%;
        z-index: 3;
      }

      & > .container-show-comments {
        padding-left: 1.5rem;

        @media (max-width: 1000px) {
          padding-top: 10px;
        }
      }

      & > .comments-pin {
        padding-left: 1.5rem;
        height: calc(100% - 45px);
        overflow: hidden auto;

        @media (max-width: 1000px) {
          height: calc(100% - 198px);
        }

        .container-comments {
          margin-right: 1rem;

          &:not(p) {
            margin-bottom: 1rem;
          }
        }

        .pin-no-comments {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 2rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

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
    }
  `}
`;

export const ContainerAddComments = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: absolute;
    bottom: 0;
    background-color: ${theme.colors.g_colorGray0};
    display: flex;
    padding-top: 8px;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid ${theme.colors.g_colorBgRgb_229};

    @media (max-width: 1000px) {
      position: static;

      &[data-fixed='true'] {
        position: sticky;
        bottom: 0;
        left: 0;
        height: fit-content;
      }
    }

    & > div {
      padding: 0 2rem 2rem;

      @media (max-width: 1400px) {
        padding: 0 1.5rem 1.5rem;
      }

      & > .commet-title-and-likes {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

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

export const ConatinerShowComments = styled.div<TypeTheme & Props>`
  ${({ theme, $showComments }) => css`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    transition-property: padding-left;
    /* transition-delay: 220ms;

    @media (max-width: 1000px) {
      padding-left: ${$showComments ? '1rem' : '0'};
    } */

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
  `}
`;
