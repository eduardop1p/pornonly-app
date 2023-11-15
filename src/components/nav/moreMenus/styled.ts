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

export const ContainerMenus = styled.div<TypeTheme>`
  ${({ theme }) => css`
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
    bottom: -5.4rem;
    padding: 8px;

    &[data-show-menus='true'] {
      visibility: visible;
      opacity: 1;
    }

    & > a {
      color: ${theme.colors.g_colorGray400};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }

    & > * {
      padding: 8px;
      border-radius: 8px;
      transition: background 200ms ease-in-out;
      width: 100%;
      text-align: left;

      &:hover {
        background-color: ${theme.colors.g_colore9e9e9};
      }
    }
  `}
`;
