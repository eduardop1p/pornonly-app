import styled, { css } from 'styled-components';
import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.form<TypeTheme>`
  ${({ theme }) => css`
    width: 100%;
    position: relative;
    margin: 0 1rem;
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
  `}
`;
