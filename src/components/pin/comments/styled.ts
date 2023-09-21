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
      margin-top: 1.5rem;
      position: absolute;
      width: 100%;
      overflow-y: auto;
      /* height: 275px; */
      /* padding-bottom: 1rem; */

      &[data-show-comments='false'] {
        display: none;
      }

      & > :not(:last-child) {
        margin-bottom: 1.2rem;
        margin-right: 10px;
      }
    }
  `}
`;
