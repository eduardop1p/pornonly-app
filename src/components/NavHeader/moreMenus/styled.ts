import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    margin-left: 5px;
    position: relative;

    @media (max-width: 500px) {
      margin-left: 0;
    }

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
export const ContainerMenus = styled.div<TypeTheme>`
  ${({ theme }) => css`
    box-shadow: ${theme.box_shadow.box_shadow_04};
    max-height: calc(100vh / 1.3);
    width: 340px;
    background-color: ${theme.colors.g_colorGray0};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden auto;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    right: -1rem;
    border-radius: 1rem;
    bottom:;
    padding: 8px;
    top: 1.8rem;

    @media (max-width: 650px) {
      width: 300px;
    }

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
      line-height: 1.2;

      &:not(:last-child) {
        margin-bottom: 5px;

        @media (max-width: 800px) {
          margin-bottom: 0;
        }
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
        width: calc(100% - 12px);

        & > :last-child {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          width: calc(100% - 70px);

          & > h3 {
            color: ${theme.colors.g_colorGray300};
            font-weight: ${theme.font_weight.font_weight_500};
            font-size: ${theme.font_size.font_size_1rem};
            margin-bottom: 3px;
            width: calc(100% - 10px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 1.2;
          }

          & > p {
            color: ${theme.colors.g_color5f5f5f};
            font-weight: ${theme.font_weight.font_weight_400};
            font-size: ${theme.font_size.font_size_0_90rem};
            width: calc(100% - 10px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 1.2;
          }
        }
      }

      & > svg {
        flex: none;
      }
    }
  `}
`;
