import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.form<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    position: relative;

    & > input {
      width: 100%;
      background-color: ${theme.colors.g_colore9e9e9};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_400};
      border: 1px solid ${theme.colors.g_colore9e9e9};
      padding: 15px 3.2rem 15px 20px;
      height: 52px;
      border-radius: 2rem;

      &:focus {
        background-color: transparent;
        border: 1px solid ${theme.colors.g_colorGray150Hovered};
      }
    }

    & > .send-comment {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background-color: ${theme.colors.g_colorRed100};
      width: 40px;
      height: 40px;
      border-radius: 100%;
      right: 6px;
      z-index: 2;
      cursor: pointer;

      & > svg {
        flex: none;
        fill: ${theme.colors.g_colorGray0};
      }
    }
  `}
`;
