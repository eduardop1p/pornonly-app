import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const ContainerSuccess = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: fixed;
    left: 50%;
    bottom: 1rem;
    z-index: 10;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 340px;
    border-radius: 10px;
    padding: 10px;
    background-color: ${theme.colors.g_colorGray300};
    transition:
      transform 200ms ease-in-out,
      opacity 200ms linear;
    transform: translate(-50%, 66px);
    margin: 0 !important;

    &[data-show-success='true'] {
      transform: translate(-50%, 0);
    }
    &[data-show-success='false'] {
      opacity: 0;
      /* visibility: hidden; */
    }

    & > img,
    & > video {
      flex: none;
      position: relative;
      border-radius: 5px;
      margin-right: 8px;
      width: auto;
      height: 30px !important;
    }

    & > span {
      text-align: center;
      /* white-space: nowrap; */
      color: ${theme.colors.g_colorGray0};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }
  `}
`;
