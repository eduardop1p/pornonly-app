import styled from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  display: flex;
  margin-top: 10px;
  padding: 0 6px;
  justify-content: space-between;

  & > button {
    height: 30px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-weight: ${({ theme }) => theme.font_weight.font_weight_500};
    font-size: ${({ theme }) => theme.font_size.font_size_0_75rem};
    cursor: pointer;
  }

  & > :first-child {
    color: ${({ theme }) => theme.colors.g_colorGray0};
    background-color: ${({ theme }) => theme.colors.g_colorRed100};
    margin-right: 10px;
  }

  & > :last-child {
    color: ${({ theme }) => theme.colors.g_colorGray300};
    background-color: ${({ theme }) => theme.colors.g_colore9e9e9};
  }
`;
