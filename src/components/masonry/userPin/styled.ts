import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;


    & > * {
      flex: none;
    }

    & > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
      margin-right: 6px;
      background-color: ${theme.colors.g_colorGray100};
    }

    & > span {
      margin-right: 6px;
      width: 32px;
      height: 32px;
      background-color: ${theme.colors.g_colore9e9e9};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      font-size: ${theme.font_size.font_size_0_75rem};
      font-weight: ${theme.font_weight.font_weight_500};
      color: ${theme.colors.g_colorGray400};
    }

    & > h4 {
      font-size: ${theme.font_size.font_size_0_90rem};
      font-weight: ${theme.font_weight.font_weight_400};
      color: ${theme.colors.g_colorGray300};
      height: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: calc(100% - 32px);
      display: flex;
      align-items: center;
  `}
`;

export const ContainerLink = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    width: fit-content;

    &:hover {
      h4 {
        text-decoration: underline;
      }
    }

    & > img {
      flex: none;
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
      background-color: ${theme.colors.g_colorGray100};
    }

    & > span {
      background-color: ${theme.colors.g_colore9e9e9};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      font-size: ${theme.font_size.font_size_0_75rem};
      font-weight: ${theme.font_weight.font_weight_500};
      color: ${theme.colors.g_colorGray400};
    }

    & > div {
      margin-left: 6px;
      display: flex;
      flex-direction: column;

      & > h4 {
        display: flex;
        align-items: center;
        font-size: ${theme.font_size.font_size_0_90rem};
        font-weight: ${theme.font_weight.font_weight_500};
        color: ${theme.colors.g_colorGray300};
      }

      & > .publishs-count {
        font-size: ${theme.font_size.font_size_0_90rem};
        font-weight: ${theme.font_weight.font_weight_400};
        color: ${theme.colors.g_colorGray300};
        margin-top: 3px;
      }
    }
  `}
`;
