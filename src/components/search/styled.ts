import styled, { css } from 'styled-components';
import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.form<TypeTheme>`
  ${({ theme }) => css`
    min-width: 260px;
    width: 100%;
    position: relative;
    margin: 0 10px;
    background-color: ${theme.colors.g_colore9e9e9};
    display: flex;
    align-items: center;
    height: 48px;
    border-radius: 24px;
    box-shadow: none;
    padding-left: 1rem;

    &[data-focus-search='true'] {
      box-shadow: ${theme.box_shadow.box_shadow_02};

      & > svg {
        display: none;
      }
    }

    & > svg {
      display: inline-block;
      margin-right: 8px;
      fill: ${theme.colors.g_color5f5f5f};
      flex: none;
      visibility: visible;
    }

    & > input {
      width: 100%;
      border: none;
      background-color: transparent;
      font-size: 1rem;
      color: ${theme.colors.g_colo333};
      font-weight: ${theme.font_weight.font_weight_400};
    }

    & > .titles-suggestions-container {
      position: absolute;
      left: 0;
      top: 2.8rem;
      background-color: ${theme.colors.g_colorGray0};
      width: 100%;
      z-index: -1;
      border-radius: 0 0 1rem 1rem;
      display: flex;
      flex-direction: column;
      padding-top: 2rem;
      padding-bottom: 1rem;

      &[data-show-suggestion='false'] {
        display: none;
      }

      & > :not(:last-child) {
        margin-bottom: 10px;
      }

      & > .titles-suggestions {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 10px 2rem;

        &:hover,
        &.selected {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        & > svg {
          flex: none;
          width: 14px;
          height: 14px;
          margin-right: 1.5rem;
        }

        & > span {
          color: ${theme.colors.g_colorGray300};
          font-weight: ${theme.font_weight.font_weight_500};
          font-size: ${theme.font_size.font_size_1rem};
        }
      }
    }
  `}
`;
