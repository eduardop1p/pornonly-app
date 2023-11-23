import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.nav<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    margin-left: 12px;
    width: 100%;
    position: relative;

    & > .main-navs {
      display: flex;
      align-items: center;

      & > :not(:last-child) {
        margin-right: 5px;
      }

      & > a {
        white-space: nowrap;
        height: 48px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.g_colorGray400};
        padding: 0 1rem;
        font-weight: ${theme.font_weight.font_weight_500};
        font-size: ${theme.font_size.font_size_1rem};
        transition: background 150ms ease-in-out;

        /* @media (max-width: 1200px) {
          &[href='/'] {
            display: none;
          }
        } */

        &.link-active {
          background-color: ${theme.colors.g_colorGray400};
          color: ${theme.colors.g_colorGray0};
        }

        &:not(.link-active):hover {
          background-color: ${theme.colors.g_colorTransparentGray60};
        }
      }
    }

    & > .links-auth {
      display: flex;
      align-items: center;

      @media (max-width: 500px) {
        display: none;
      }

      & > :not(:last-child) {
        margin-right: 10px;
      }

      & > button {
        cursor: pointer;
      }
    }

    & > .links-no-auth {
      display: flex;
      align-items: center;

      @media (max-width: 500px) {
        display: none;
      }

      & > :not(:last-child) {
        margin-right: 10px;
      }

      & > a {
        padding: 8px 12px;
        font-size: ${theme.font_size.font_size_1rem};
        font-weight: ${theme.font_weight.font_weight_500};
        width: 120px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        cursor: pointer;
        transition: background 150ms ease-in-out;

        @media (max-width: 1150px) {
          width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        @media (max-width: 840px) {
          width: 40px;
          height: 40px;
          overflow: hidden;
          border-radius: 100%;
          padding: 0;
        }

        &.login {
          background-color: ${theme.colors.g_colorRed100};
          color: ${theme.colors.g_colorGray0};
          flex: none;

          &:hover {
            background-color: ${theme.colors.g_colorRed100Hovered};
          }
        }

        &.create-account {
          color: ${theme.colors.g_colorGray300};
          background-color: ${theme.colors.g_colorGray100};
          flex: none;

          &:hover {
            background-color: ${theme.colors.g_colorGray100Hovered};
          }
        }
      }
    }
  `}
`;

export const ContainerArrowMore = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: relative;
    background-color: transparent;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 5px;

    & > span {
      color: ${theme.colors.g_colorGray300};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }

    & > svg {
      margin-left: 8px;
      flex: none;
      transform: rotate(0);
      transition: transform 200ms ease-in-out;

      &[data-publish-active='true'],
      &[data-category-active='true'] {
        transform: rotate(180deg);
      }
    }

    & > .container-more-links {
      visibility: hidden;
      opacity: 0;
      width: 180px;
      background-color: ${theme.colors.g_colorGray0};
      border-radius: 1rem;
      position: absolute;
      top: 1.5rem;
      padding: 8px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: ${theme.box_shadow.box_shadow_04};
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: default;

      &.category {
        width: 350px;
        display: grid;
        grid-template-columns: repeat(3, calc(100% / 3.1));
        gap: 5px;
        justify-content: left;

        & > :first-child {
          margin-bottom: 0;
        }

        a {
          margin-right: 0 !important;
        }
      }

      &[data-publish-active='true'],
      &[data-category-active='true'] {
        visibility: visible;
        opacity: 1;
      }

      & > :first-child {
        margin-bottom: 5px;
      }

      & > a {
        color: ${theme.colors.g_colorGray400};
        font-size: ${theme.font_size.font_size_1rem};
        font-weight: ${theme.font_weight.font_weight_500};
        padding: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        border-radius: 8px;
        transition: background 200ms ease-in-out;

        &.link-active {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }
      }
    }
  `}
`;

export const ContainerBreakMenu = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: relative;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 48px;
    border-radius: 24px;
    padding: 0 1rem;
    transition: background 150ms ease-in-out;

    &[data-break-menu-active='true'] {
      background-color: ${theme.colors.g_colorTransparentGray60};
    }

    &.link-active {
      background-color: ${theme.colors.g_colorGray400};

      & > span {
        color: ${theme.colors.g_colorGray0} !important;
      }

      & > svg {
        fill: ${theme.colors.g_colorGray0} !important;
      }
    }

    &:not(&.link-active):hover {
      background-color: ${theme.colors.g_colorTransparentGray60};
    }

    & > span {
      white-space: nowrap;
      color: ${theme.colors.g_colorGray300};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }

    & > svg {
      margin-left: 8px;
      flex: none;
      transform: rotate(0);
      transition: transform 200ms ease-in-out;

      &[data-break-menu-active='true'] {
        transform: rotate(180deg);
      }
    }

    & > .container-more-links {
      visibility: hidden;
      opacity: 0;
      width: 180px;
      background-color: ${theme.colors.g_colorGray0};
      border-radius: 1rem;
      position: absolute;
      top: 3.5rem;
      left: 0;
      padding: 8px;
      box-shadow: ${theme.box_shadow.box_shadow_04};
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: default;

      &[data-break-menu-active='true'] {
        visibility: visible;
        opacity: 1;
      }

      & > :not(:last-child) {
        margin-bottom: 5px;
      }

      & > a {
        color: ${theme.colors.g_colorGray400};
        font-size: ${theme.font_size.font_size_1rem};
        font-weight: ${theme.font_weight.font_weight_500};
        padding: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        border-radius: 8px;
        transition: background 200ms ease-in-out;

        &.link-active {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }
      }
    }
  `}
`;
