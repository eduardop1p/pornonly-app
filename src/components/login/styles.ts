import styled, { css } from 'styled-components';
import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    margin: 1rem auto 0;
    width: 550px;
    min-height: 400px;
    padding: 20px 10px 24px;
    border-radius: 2rem;
    box-shadow: ${theme.box_shadow.box_shadow_01};
    background-color: ${theme.colors.g_colorGray0};
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    & :not(:last-child) {
      margin-bottom: 1rem;
    }

    & > h1 {
      color: ${theme.colors.g_colorGray333333};
      font-size: ${theme.font_size.font_size_2rem};
      font-weight: ${theme.font_weight.font_weight_600};
    }
  `}
`;
