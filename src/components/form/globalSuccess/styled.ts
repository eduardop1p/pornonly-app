import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    position: fixed;
    background-color: ${theme.colors.g_colorGray222};
    justify-content: center;
    left: 50%;
    transform: translateX(-50%);
    min-height: 45px;
    bottom: 1.5rem;
    padding: 8px 1rem;
    border-radius: 5px;
    margin-bottom: 0 !important;
    transform: translateY(125px);
    transition: transform 500ms ease-in-out;

    &[data-show-error='true'] {
      transform: translateY(0);
    }

    & > img,
    & > video {
      margin-right: 10px;
      flex: none;
      border-radius: 5px;
      object-fit: contain;
      max-height: 25px !important;
    }

    & > span {
      color: ${theme.colors.g_colorGray0};
      font-size: ${theme.font_size.font_size_0_90rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }
  `}
`;
