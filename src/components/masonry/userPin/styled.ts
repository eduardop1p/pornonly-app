import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    margin-top: 6px;
    margin-left: -2px;

    & > * {
      flex: none;
    }

    & > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
      margin-right: 5px;
      background-color: ${theme.colors.g_colorGray100};
    }

    & > span {
      margin-right: 5px;
      width: 32px;
      height: 32px;
      background-color: ${theme.colors.g_colore9e9e9};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      font-size: ${theme.font_size.font_size_0_75rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }

    & > h4 {
      font-size: ${theme.font_size.font_size_0_90rem};
      font-weight: ${theme.font_weight.font_weight_400};
      color: ${theme.colors.g_colorGray300};
      height: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  `}
`;
