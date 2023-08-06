import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .publish-and-btn {
      display: flex;
      flex-direction: column;
      margin-right: 2rem;

      & > .publish {
        border-radius: 12px;
        background-color: ${theme.colors.g_colorBgRgb_229};
        width: 270px;
        height: 495px;
        flex: none;
        padding: 1rem;
        position: relative;
        overflow: hidden;
        margin-bottom: 1rem;

        & > .preview {
          position: absolute;
          width: 100%;
          z-index: 2;
          background-color: ${theme.colors.g_colorGray400};
          left: 0;
          top: 0;

          & > button {
            position: absolute;
            cursor: pointer;
            z-index: 3;
            top: 1rem;
            right: 1rem;
            width: 48px;
            height: 48px;
            background-color: ${theme.colors.g_colorGray0};
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 100%;

            & > svg {
              flex: none;
              fill: ${theme.colors.g_colorGray111111};
            }
          }

          & > img {
            position: absolute;
            object-fit: contain;
          }
        }

        & > .border-dashed {
          border: 2px dashed ${theme.colors.g_colorGray150Hovered};
        }

        & > div {
          padding: 8px;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;

          & > input {
            display: none;
          }

          & > label {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 1;
            display: flex;
            align-items: center;
            left: 0;
            top: 0;
            justify-content: center;
            cursor: pointer;

            & > div {
              margin: 0 auto;
              max-width: 70%;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;

              & > div {
                background-color: ${theme.colors.g_color5f5f5f};
                margin-bottom: 1rem;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 100%;

                & > svg {
                  stroke-width: 2rem;
                  stroke: ${theme.colors.g_colorBgRgb_229};
                  fill: ${theme.colors.g_colorBgRgb_229};
                }
              }

              & > span {
                line-height: 1.2;
                font-size: ${theme.font_size.font_size_0_90rem};
                font-weight: ${theme.font_weight.font_weight_500};
              }
            }
          }

          & > span {
            font-size: ${theme.font_size.font_size_0_75rem};
            line-height: 1.3;
            max-width: 90%;
            margin: 0 auto;
            text-align: center;
          }
        }
      }

      & > button {
        width: 270px;
        font-size: ${theme.font_size.font_size_1rem};
        font-weight: ${theme.font_weight.font_weight_500};
        color: ${theme.colors.g_colorGray0};
        height: 45px;
        display: flex;
        background-color: ${theme.colors.g_colorRed100};
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 24px;
      }
    }

    & > .title-description-tags {
      display: flex;
      flex-direction: column;
      width: 100%;

      & > div {
        margin-bottom: 2rem;
        height: 70px;

        & > .info-input {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          margin-top: 8px;

          & > span {
            color: ${theme.colors.g_colorGray111111};
            font-weight: ${theme.font_weight.font_weight_400};
            font-size: ${theme.font_size.font_size_0_75rem};
          }
        }

        & > input,
        & > textarea {
          width: 100%;
          border: none;
          box-shadow: ${theme.box_shadow.box_shadow_05};

          &:focus {
            box-shadow: ${theme.box_shadow.box_shadow_06};
          }
        }

        & > #title {
          padding-bottom: 10px;

          font-weight: ${theme.font_weight.font_weight_700};
          font-size: ${theme.font_size.font_size_2_4rem};
        }

        & > #description {
          padding: 0 10px;
          font-size: ${theme.font_size.font_size_1rem};
          font-weight: ${theme.font_weight.font_weight_400};
          resize: none;
          overflow: hidden;
          min-height: 32px !important;
        }
      }
    }
  `}
`;
