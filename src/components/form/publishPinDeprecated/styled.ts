import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    & > form {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      & > .publish-and-btn {
        display: flex;
        flex-direction: column;
        margin-right: 2rem;
        flex: none;
        width: 270px;

        & > .publish {
          border-radius: 12px;
          background-color: ${theme.colors.g_colorBgRgb_229};
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

            & > .progress-pin-upload {
              position: absolute;
              left: 50%;
              width: 100%;
              background-color: ${theme.colors.g_colorTransparentGray800};
              height: 100%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 3;
              display: flex;
              align-items: center;
              justify-content: center;

              circle {
                stroke-width: 4.3px;
              }

              & > .upload-progress-value {
                font-size: ${theme.font_size.font_size_1rem};
                font-weight: ${theme.font_weight.font_weight_500};
                position: absolute;
                color: ${theme.colors.g_colorGray0};
              }
            }

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

            & > img,
            & > video {
              width: 100%;
              height: 100%;
              position: absolute;
              object-fit: contain;
              inset: 0;

              &::-webkit-media-controls {
                visibility: hidden;
              }
              &::-webkit-media-controls-enclosure {
                visibility: visible;
              }
            }
          }

          & > .border-dashed {
            border: 2px dashed ${theme.colors.g_colorGray150Hovered};
          }

          & > .border-dashed-no-upload-file {
            border: 2px dashed ${theme.colors.g_colorRed100};

            & > span {
              color: ${theme.colors.g_colorRed100};
            }
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

              & > .upload-photo {
                margin: 0 auto;
                max-width: 70%;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;

                &.no-file-upload {
                  & > div {
                    animation-name: noImgUpload;
                    animation-duration: 100ms;
                    animation-iteration-count: 1;
                    animation-timing-function: linear;
                    background-color: ${theme.colors.g_colorRed100};

                    @keyframes noImgUpload {
                      0% {
                        transform: translateX(10px);
                      }
                      50% {
                        transform: translateX(-10px);
                      }
                      100% {
                        transform: translateX(0px);
                      }
                    }
                  }

                  & > span {
                    color: ${theme.colors.g_colorRed100};
                  }
                }

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
          width: 100%;
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
          transition: background 200ms ease-in-out;

          &:hover {
            background-color: ${theme.colors.g_colorRed100Hovered};
          }
        }
      }

      & > .title-description-tags {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;

        & > div:not(.user) {
          min-height: 70px;
        }

        & > .add-tags {
          margin-top: 1rem;

          & > .container-input-tags {
            width: 100%;
            padding-bottom: 10px;
            box-shadow: ${theme.box_shadow.box_shadow_05};
            display: flex;
            align-items: center;
            justify-content: left;
            flex-wrap: wrap;
            position: relative;

            &[data-tags-focus='true'] {
              box-shadow: ${theme.box_shadow.box_shadow_06};
            }

            & > input {
              border: none;
              font-size: ${theme.font_size.font_size_1rem};
              font-weight: ${theme.font_weight.font_weight_400};
              margin-top: 8px;
            }

            & > span {
              margin-right: 10px;
              background-color: ${theme.colors.g_colore9e9e9};
              color: ${theme.colors.g_colorGray400};
              font-weight: ${theme.font_weight.font_weight_500};
              font-size: ${theme.font_size.font_size_0_90rem};
              padding: 8px 12px;
              border-radius: 2rem;
              position: relative;
              white-space: nowrap;
              margin-top: 8px;

              & > svg {
                position: absolute;
                border-radius: 100%;
                cursor: pointer;
                top: -5px;
                right: -3px;
                padding: 5px;
                background-color: ${theme.colors.g_colore9e9e9};
                fill: ${theme.colors.g_colorRed100};
              }
            }

            & > button {
              appearance: none;
              background: transparent;
              cursor: pointer;
              flex: none;
              position: absolute;
              right: 0;

              & > svg {
                fill: ${theme.colors.g_color5f5f5f};
                opacity: 0.7;
              }
            }
          }
        }

        & > .user {
          margin-bottom: 2rem;
        }

        .info-input {
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

        & > .add-title,
        & > .add-description {
          & > #title,
          & > textarea {
            width: 100%;
            border: none;
            box-shadow: ${theme.box_shadow.box_shadow_05};
            color: ${theme.colors.g_colorGray400};

            &:focus {
              box-shadow: ${theme.box_shadow.box_shadow_06};
            }
          }

          & > #title {
            padding-bottom: 10px;

            font-weight: ${theme.font_weight.font_weight_700};
            font-size: ${theme.font_size.font_size_2_5rem};
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
    }
  `}
`;
