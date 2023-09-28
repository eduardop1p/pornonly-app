import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  display: flex;
  /* align-items: center; */

  .pin-info-and-comment-user {
    margin-top: 3px;
    position: relative;

    .responses-comments-container {
      margin-top: 1rem;
      margin-left: 3rem;
      /* position: relative; */
      display: flex;
      flex-direction: column;

      & > :not(:last-child) {
        margin-bottom: 14px;
      }

      & > .container-response-input {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: flex-end;
        width: 100%;

        & > input {
          margin-bottom: 10px;
          width: 100%;
        }

        & > div {
          display: flex;

          & > :first-child {
            margin-right: 10px;
          }

          & > button {
            cursor: pointer;
          }
        }
      }
    }
  }
`;

export const ContainerComment = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;

    .pin-user-profile {
      margin-right: 6px;

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

    & > div {
      .comment-username-and-commet {
        & > h4 {
          display: inline-block;
          font-size: ${theme.font_size.font_size_1rem};
          font-weight: ${theme.font_weight.font_weight_600};
          color: ${theme.colors.g_colorGray300};

          &:hover {
            text-decoration: underline;
          }

          & > a {
            color: inherit;
            font-weight: inherit;
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

      & > .container-comment-manage {
        display: flex;
        align-items: center;

        & > :not(:last-child) {
          margin-right: 14px;
        }

        & > .response-comment {
          color: ${theme.colors.g_color5f5f5f};
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_600};
          cursor: pointer;
        }

        & > .likes-container {
          display: flex;
          align-items: center;

          & > button {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 16px;
            height: 16px;

            & > svg {
              flex: none;
              width: 100%;
              height: 100%;
              display: inline-block;

              &.yes-like {
                fill: ${theme.colors.g_colorRed100};
              }
              &.no-like {
                fill: ${theme.colors.g_color5f5f5f};
              }
            }
          }

          & > span {
            color: ${theme.colors.g_color5f5f5f};
            font-size: ${theme.font_size.font_size_0_90rem};
            font-weight: ${theme.font_weight.font_weight_500};
            margin-left: 5px;
          }
        }

        & > span {
          font-size: ${theme.font_size.font_size_0_90rem};
          font-weight: ${theme.font_weight.font_weight_400};
          color: ${theme.colors.g_colorGray200};
          display: inline-block;
        }

        & > .user-manage-comment {
          position: relative;

          & > button {
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

          & > .manage-comment {
            width: 180px;
            background-color: ${theme.colors.g_colorGray0};
            border-radius: 1rem;
            position: absolute;
            top: 1.8rem;
            padding: 8px;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: ${theme.box_shadow.box_shadow_04};
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: default;

            &[data-show-manage-comment='false'] {
              display: none;
            }

            & > button {
              color: ${theme.colors.g_colorRed100};
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
      }
    }
  `}
`;
