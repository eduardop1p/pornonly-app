import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const ContainerError = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: fixed;
    bottom: 1rem;
    left: 50%;
    z-index: 10;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 340px;
    border-radius: 10px;
    padding: 10px;
    background-color: ${theme.colors.g_colorRed100};
    transition:
      transform 200ms ease-in-out,
      opacity 200ms linear;
    transform: translate(-50%, 66px);
    margin: 0 !important;

    &[data-show-error='true'] {
      transform: translate(-50%, 0);
    }
    &[data-show-error='false'] {
      opacity: 0;
      /* visibility: hidden; */
    }

    & > span {
      text-align: center;
      color: ${theme.colors.g_colorGray0};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }
  `}
`;
