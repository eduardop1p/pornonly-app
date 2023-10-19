import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    @keyframes animationScrollTop {
      0% {
        transform: translateX(4rem);
      }
      100% {
        transform: translateX(0);
      }
    }

    animation: animationScrollTop 500ms ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 100%;
    position: fixed;
    bottom: 1rem;
    right: 1.5rem;
    z-index: 5;
    cursor: pointer;
    box-shadow: ${theme.box_shadow.box_shadow_04};
    background-color: ${theme.colors.g_colorGray0};
    /* background-color: ${theme.colors.g_colorGray100}; */
    transition: background 200ms ease-in-out;

    &:hover {
      background-color: ${theme.colors.g_colore9e9e9};

      & > svg {
        /* fill: ${theme.colors.g_colorGray0}; */
      }
    }

    & > svg {
      transform: rotate(180deg);
      flex: none;
      width: 16px;
      height: 16px;
      transition: fill 200ms ease-in-out;
    }
  `}
`;
