import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    justify-content: space-between;

    & > .more-options {
      position: relative;

      & > .btn-more-options {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        border-radius: 100%;
        transition: background 150ms ease-in-out;

        &:hover {
          background-color: ${theme.colors.g_colorBgRgb_229};
        }

        &[data-btn-more-options-active='true'] {
          background-color: ${theme.colors.g_colorGray400};

          & > svg {
            fill: ${theme.colors.g_colorGray0};
          }
        }
      }

      & > .container-more-options {
        visibility: hidden;
        opacity: 0;
        width: 180px;
        background-color: ${theme.colors.g_colorGray0};
        border-radius: 1rem;
        position: absolute;
        top: 3.4rem;
        padding: 8px 10px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: ${theme.box_shadow.box_shadow_04};
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: default;

        &[data-more-options-active='true'] {
          visibility: visible;
          opacity: 1;
        }

        & > :not(:last-child) {
          margin-bottom: 5px;
        }

        & > button {
          color: ${theme.colors.g_colorGray400};
          font-size: ${theme.font_size.font_size_1rem};
          font-weight: ${theme.font_weight.font_weight_500};
          padding: 8px;
          width: 100%;
          text-align: left;
          border-radius: 8px;
          transition: background 200ms ease-in-out;

          &:hover {
            background-color: ${theme.colors.g_colore9e9e9};
            cursor: pointer;
          }
        }
      }
    }

    & > .btn-pin-save {
      cursor: pointer;
      color: ${theme.colors.g_colorGray0};
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
      padding: 14px 1rem;
      border-radius: 2rem;
      background-color: ${theme.colors.g_colorRed100};
      transition: background 150ms ease-in-out;

      &:hover {
        background-color: ${theme.colors.g_colorRed100Hovered};
      }
    }
  `}
`;
