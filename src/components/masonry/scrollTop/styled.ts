import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 35px;
    border-radius: 2rem 2rem 0 0;
    position: fixed;
    bottom: 0;
    right: 1rem;
    z-index: 4;
    background-color: ${theme.colors.g_colore9e9e9};
    cursor: pointer;

    & > svg {
      transform: rotate(180deg);
      flex: none;
      width: 18px;
      height: 18px;
    }
  `}
`;
