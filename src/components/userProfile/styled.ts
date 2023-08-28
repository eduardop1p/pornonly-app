import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    & > .profile-container {
      background-color: ${theme.colors.g_colorTransparentGray800};
      position: fixed;
      width: 100%;
      height: 100vh;
      display: none;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      z-index: 7;

      &[data-show-add-photo-profile='true'] {
        display: flex;
      }

      & > .profile {
        background-color: ${theme.colors.g_colorGray0};
        width: 540px;
        border-radius: 1rem;
        /* height: 500px; */
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        & > h1 {
          font-weight: ${theme.font_weight.font_weight_500};
          font-size: ${theme.font_size.font_size_2rem};
          margin-bottom: 1.5rem;
        }

        & > span {
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_400};
          margin: 1rem 0;
        }

        & > .btns-profile {
          display: flex;
          align-items: center;
          margin-top: 5px;

          & > button {
            height: 40px;
            width: 130px;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 12px;
            font-size: ${theme.font_size.font_size_1rem};
            font-weight: ${theme.font_weight.font_weight_500};
            border-radius: 24px;
            cursor: pointer;
            transition: background 200ms ease-in-out;
          }

          & > .profile-update {
            margin-right: 1rem;
            background-color: ${theme.colors.g_colorRed100};
            color: ${theme.colors.g_colorGray0};

            &:hover {
              background-color: ${theme.colors.g_colorRed100Hovered};
            }
          }

          & > .profile-delete {
            background-color: ${theme.colors.g_colore9e9e9};
            color: ${theme.colors.g_colorGray300};
          }
        }
      }
    }
  `}
`;
