import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $showComments: boolean;
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme, $showComments }) => css`
    position: relative;

    & > .title-and-icon {
      display: flex;
      align-items: center;

      & > h2 {
        font-size: ${theme.font_size.font_size_1_25rem};
        font-weight: ${theme.font_weight.font_weight_500};
        color: ${theme.colors.g_colorGray300};
      }

      & > .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        cursor: pointer;

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        & > svg {
          flex: none;
          transition: rotate 200ms ease-in-out;
          rotate: ${!$showComments ? '-90deg' : '0'};
        }
      }
    }

    & > .comments-and-users {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      position: absolute;
      width: 100%;
      height: calc(100% - 155px);
      overflow-y: auto;
      /* padding-bottom: 1rem; */

      &[data-show-comments='false'] {
        display: none;
      }

      & > :not(:last-child) {
        margin-bottom: 1rem;
        margin-right: 10px;
      }

      & > .pin-no-comments {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -40%);
        width: calc(100% - 2rem);
        display: flex;
        flex-direction: column;
        align-items: center;

        & > svg {
          flex: none;
          margin-bottom: 5px;
          fill: ${theme.colors.g_color5f5f5f};
        }

        & > span {
          text-align: center;
          font-weight: ${theme.font_weight.font_weight_400};
          font-size: ${theme.font_size.font_size_1rem};
          color: ${theme.colors.g_color5f5f5f};
        }
      }
    }

    & > .add-comments {
      position: absolute;
      bottom: 0;
      background-color: ${theme.colors.g_colorGray0};
      display: flex;
      padding-top: 8px;
      flex-direction: column;
      width: 100%;
      border-top: 1px solid ${theme.colors.g_colorBgRgb_229};

      & > .comments-count {
        font-size: ${theme.font_size.font_size_1_25rem};
        font-weight: ${theme.font_weight.font_weight_600};
        color: ${theme.colors.g_colorGray300};
        margin-bottom: 1rem;
      }
    }
  `}
`;
