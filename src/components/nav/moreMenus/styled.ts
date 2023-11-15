import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    margin-left: 7px;
    position: relative;

    & > .btn-more-menus {
      cursor: pointer;
      transition:
        transform 200ms ease-in-out,
        background 200ms ease-in-out;
      height: 22px;
      width: 22px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: ${theme.colors.g_colore9e9e9};
      }

      &[data-show-menus='true'] {
        transform: rotate(180deg);
      }

      & > svg {
        flex: none;
        fill: ${theme.colors.g_color5f5f5f};
      }
    }
  `}
`;

// eslint-disable-next-line
export const ContainerMenus = styled.div<TypeTheme & { $containerMenusHeight: number }>`
  ${({ theme, $containerMenusHeight }) => css`
    box-shadow: ${theme.box_shadow.box_shadow_04};
    max-height: 600px;
    width: 320px;
    background-color: ${theme.colors.g_colorGray0};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    right: -1rem;
    border-radius: 1rem;
    bottom:;
    padding: 8px;
    bottom: ${$containerMenusHeight}px;

    &[data-show-menus='true'] {
      visibility: visible;
      opacity: 1;
    }

    & > span {
      color: ${theme.colors.g_colorGray400};
      font-size: ${theme.font_size.font_size_0_8rem};
      width: 100%;
      text-align: left;
      margin: 15px 0 15px 8px;
      font-weight: ${theme.font_weight.font_weight_400};
    }

    & > a,
    & > button {
      color: ${theme.colors.g_colorGray400};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
      padding: 8px;
      border-radius: 8px;
      transition: background 200ms ease-in-out;
      width: 100%;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 5px;
      }

      &:hover {
        background-color: ${theme.colors.g_colore9e9e9};
      }

      &.link-active {
        background-color: ${theme.colors.g_colore9e9e9};
      }

      & > svg {
        /* margin-right: 10px; */
      }
    }
  `}
`;

export const ContainerUser = styled.div<TypeTheme>`
  ${({ theme }) => css`
    width: 100%;
    height: auto;
    border-radius: 10px;
    background-color: ${theme.colors.g_colore9e9e9};
    transition: background 200ms ease-in-out;

    &:hover {
      background-color: ${theme.colors.g_colorGray150};
    }

    & > a {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: auto;

      & > .user-avatar {
        display: flex;
        align-items: center;

        & > :last-child {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          & > h3 {
            color: ${theme.colors.g_colorGray300};
            font-weight: ${theme.font_weight.font_weight_500};
            font-size: ${theme.font_size.font_size_1rem};
            margin-bottom: 5px;
          }

          & > p {
            color: ${theme.colors.g_color5f5f5f};
            font-weight: ${theme.font_weight.font_weight_400};
            font-size: ${theme.font_size.font_size_0_90rem};
          }
        }
      }

      & > svg {
        margin-right: 10px;
      }
    }
  `}
`;
