import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';

interface Props {
  $comment?: ResultsCommentsType;
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme, $comment }) => css`
    display: flex;
    /* align-items: center; */

    & > .pin-user-profile {
      margin-right: ${$comment ? '6px' : '7px'};

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
      margin-top: 3px;
      display: ${$comment ? 'block' : 'flex'};
      flex-direction: ${$comment ? 'row' : 'column'};

      & > div {
        & > h4 {
          display: inline-block;
          font-size: ${$comment
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
          line-height: 1.2;
        }
      }

      & > .publishs-count {
        font-size: ${theme.font_size.font_size_0_90rem};
        font-weight: ${theme.font_weight.font_weight_400};
        color: ${theme.colors.g_colorGray300};
        margin-top: 3px;
      }

      & > .createin-comment {
        display: flex;
        align-items: center;

        & > button {
          margin-left: 1rem;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background-color: ${theme.colors.g_colore9e9e9};
          }
        }

        & > span {
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_400};
          color: ${theme.colors.g_colorGray200};
          display: inline-block;
        }
      }
    }
  `}
`;
