import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $textComment?: string;
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme, $textComment }) => css`
    display: flex;
    /* align-items: center; */

    & > .pin-user-profile {
      margin-right: ${$textComment ? '6px' : '7px'};

      & > img {
        flex: none;
        border-radius: 100%;
        object-fit: cover;
        object-position: center;
        background-color: ${theme.colors.g_colorGray100};
      }

      & > span {
        background-color: ${theme.colors.g_colore9e9e9};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        font-size: ${theme.font_size.font_size_0_75rem};
        font-weight: ${theme.font_weight.font_weight_500};
        color: ${theme.colors.g_colorGray400};
      }
    }

    & > .pin-info-and-comment-user {
      display: ${$textComment ? 'block' : 'flex'};
      flex-direction: ${$textComment ? 'row' : 'column'};

      & > div {
        margin-top: 5px;

        & > h4 {
          display: inline-block;
          font-size: ${$textComment
            ? theme.font_size.font_size_1rem
            : theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_500};
          color: ${theme.colors.g_colorGray300};

          &:hover {
            text-decoration: underline;
          }

          & > a {
            color: inherit;
          }
        }

        & > .comment {
          margin-left: 5px;
          font-size: ${theme.font_size.font_size_1rem};
          font-weight: ${theme.font_weight.font_weight_400};
          color: ${theme.colors.g_colorGray300};
        }
      }

      & > .publishs-count {
        font-size: ${theme.font_size.font_size_0_90rem};
        font-weight: ${theme.font_weight.font_weight_400};
        color: ${theme.colors.g_colorGray300};
        margin-top: 3px;
      }
    }
  `}
`;
