import styled, { css } from 'styled-components';

import type { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: fixed;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.g_colorTransparentGray800};
    z-index: 10;
    inset: 0;

    & > .container-info {
      background-color: ${theme.colors.g_colorGray0};
      border-radius: 1.5rem;
      width: 500px;
      height: 200px;
      padding: 1.5rem;
      box-shadow: ${theme.box_shadow.box_shadow_04};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & > p {
        text-align: center;
        font-weight: ${theme.font_weight.font_weight_400};
        color: ${theme.colors.g_colorGray300};
        font-size: ${theme.font_size.font_size_1rem};
        line-height: 1.3;

        & > span {
          font-weight: ${theme.font_weight.font_weight_500};
        }

        &:first-child {
          margin-bottom: 5px;
        }
      }

      & > div {
        width: fit-content;
        display: flex;
        align-items: center;
        margin-top: 1rem;

        & > button {
          padding: 8px 12px;
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_400};
          width: 100px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          cursor: pointer;
          transition: background 100ms ease-in-out;
          background-color: ${theme.colors.g_colorRed100};
          color: ${theme.colors.g_colorGray0};

          &:hover {
            background-color: ${theme.colors.g_colorRed100Hovered};
          }
        }

        & > :first-child {
          margin-right: 10px;
        }
      }
    }
  `}
`;
