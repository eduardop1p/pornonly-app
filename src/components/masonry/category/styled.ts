import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    width: 48px;
    height: 48px;
    border-radius: 100%;
    background-color: ${theme.colors.g_colorGray0};
    position: relative;

    @keyframes animationCategory {
      0% {
        scale: 0.95;
      }
      50% {
        scale: 0.9;
      }
      100% {
        scale: 1;
      }
    }

    &[data-category-active='true'] {
      & > button {
        background-color: ${theme.colors.g_colorGray400};

        & > svg {
          fill: ${theme.colors.g_colorGray0};
        }
      }

      & > .categories {
        visibility: visible;
        opacity: 1;
      }
    }

    & > button {
      width: 100%;
      background-color: ${theme.colors.g_colorGray0};
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 100%;
      transition: background 200ms ease-in-out;
      position: absolute;

      &:not(&[data-category-active='true']):hover {
        background-color: ${theme.colors.g_colore9e9e9};
      }

      &.click {
        animation-name: animationCategory;
        animation-duration: 300ms;
        animation-timing-function: ease-in-out;
      }

      & > svg {
        flex: none;
        cursor: inherit;
      }
    }

    & > .categories {
      display: flex;
      visibility: hidden;
      opacity: 0;
      cursor: default;
      flex-direction: column;
      align-items: flex-start;
      position: absolute;
      background-color: ${theme.colors.g_colorGray0};
      border-radius: 1rem;
      box-shadow: ${theme.box_shadow.box_shadow_04};
      width: 245px;
      height: 137px;
      top: 3.5rem;
      left: 0;
      z-index: 5;
      padding: 8px;
      /* transition-property: visibility;
      transition-delay: 300ms; */

      & > :not(:last-child) {
        margin-bottom: 5px;
      }

      & > button {
        width: 100%;
        text-align: left;
        padding: 8px;
        height: 37px;
        flex: none;
        font-weight: ${theme.font_weight.font_weight_600};
        font-size: ${theme.font_size.font_size_1rem};
        cursor: pointer;
        border-radius: 5px;
        transition: background 200ms ease-in-out;

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }
      }
    }
  `}
`;
