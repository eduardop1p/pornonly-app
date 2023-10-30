import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div<TypeTheme>`
  height: 100%;

  & > .container-created-title {
    display: flex;
    width: 100%;

    & > .container-new-pin-and-title {
      display: flex;
      flex-direction: column;
      width: 100%;

      & > .container-pin-title {
        width: 100%;
        height: 81px;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid ${({ theme }) => theme.colors.g_border_color01};

        & > .pin-title {
          font-weight: ${({ theme }) => theme.font_weight.font_weight_600};
          font-size: ${({ theme }) => theme.font_size.font_size_1_25rem};
        }
      }
    }
  }
`;

export const ContainerNewPin = styled.div<TypeTheme>`
  width: calc(100% - 15rem);
  margin: 0 auto;
  height: 100%;
  /* overflow: hidden auto; */
  padding: 1rem 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  & > .container-file-img-current {
    position: relative;
    flex: none;
    width: 342px;
    height: auto;
    /* height: calc(100vh - 5rem); */

    & > button {
      position: absolute;
      cursor: pointer;
      z-index: 3;
      top: 1rem;
      right: 1rem;
      width: 48px;
      height: 48px;
      background-color: ${({ theme }) => theme.colors.g_colorGray0};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;

      & > svg {
        flex: none;
        fill: ${({ theme }) => theme.colors.g_colorGray111111};
      }
    }

    img,
    video {
      width: 100%;
      height: auto !important;
      border-radius: 2rem;

      &::-webkit-media-controls {
        visibility: hidden;
      }
      &::-webkit-media-controls-enclosure {
        visibility: visible;
      }
    }
  }

  & > .file-upload {
    flex: none;
    width: 375px;
    height: 453px;
    border: 2px dashed ${({ theme }) => theme.colors.g_colorGray150Hovered};
    background-color: ${({ theme }) => theme.colors.g_colore9e9e9};
    border-radius: 2rem;
    position: relative;

    & > label {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: transparent;
      z-index: 2;
      inset: 0;
      cursor: pointer;

      & > input[type='file'] {
        width: 100%;
        height: 100%;
        display: none;
      }
    }

    & > .container-suggestion-and-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;

      & > svg {
        margin-bottom: 1rem;
      }

      & > span {
        color: ${({ theme }) => theme.colors.g_colorGray300};
        font-size: ${({ theme }) => theme.font_size.font_size_1rem};
        font-weight: ${({ theme }) => theme.font_weight.font_weight_400};
        line-height: 1.2;
        text-align: center;
      }
    }

    & > .warning-file {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: calc(100% - 2rem);
      color: ${({ theme }) => theme.colors.g_colorGray300};
      font-size: ${({ theme }) => theme.font_size.font_size_0_90rem};
      font-weight: ${({ theme }) => theme.font_weight.font_weight_400};
    }
  }
`;

export const ContainerFormNewPin = styled.form<TypeTheme>`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  width: 100%;
  position: relative;

  &[data-hidden-form='true'] {
    pointer-events: none;
    cursor: default;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: ${({ theme }) => theme.colors.g_colorBgRgb_255};
      height: 100%;
      z-index: 2;
      pointer-events: none;
      cursor: default;
    }
  }

  & > :not(:last-child) {
    margin-bottom: 2rem;
  }

  & > .container-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;

    & > label {
      color: ${({ theme }) => theme.colors.g_colorGray400};
      font-size: ${({ theme }) => theme.font_size.font_size_0_90rem};
      font-weight: ${({ theme }) => theme.font_weight.font_weight_400};
      margin-bottom: 10px;
    }

    & > .container-show-tags-and-input {
      width: 100%;
    }

    & > input,
    & > textarea,
    & > .container-show-tags-and-input > input {
      border-radius: 1rem;
      width: 100%;
      background-color: transparent;
      border: 2px solid ${({ theme }) => theme.colors.g_border_color01};
      font-size: ${({ theme }) => theme.font_size.font_size_1rem};
      font-weight: ${({ theme }) => theme.font_weight.font_weight_400};
      color: ${({ theme }) => theme.colors.g_colorGray111111};

      &[data-input-error='true'] {
        border: 2px solid ${({ theme }) => theme.colors.g_colorRed100};
      }

      &:focus {
        box-shadow: ${({ theme }) => theme.box_shadow.box_shadow_02};
      }
    }

    & > input,
    & > .container-show-tags-and-input > input {
      height: 48px;
      padding: 8px 1rem;
    }

    & > textarea {
      min-height: 104px !important;
      padding: 1rem;
      resize: none;
      overflow: hidden;
    }
  }
`;

export const ContainerShowTags = styled.div<TypeTheme>`
  ${({ theme }) => css`
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.g_colorGray0};
    top: -13rem;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 220px;
    box-shadow: ${theme.box_shadow.box_shadow_04};
    border-radius: 1rem;
    overflow: hidden;

    & > .container-search-tags {
      height: 100%;
      width: 100%;
      overflow: hidden auto;

      & > span {
        width: 100%;
        display: inline-block;
        text-align: left;
        padding: 1rem 1rem 6px 1rem;
        color: ${theme.colors.g_color5f5f5f};
        font-weight: ${theme.font_weight.font_weight_400};
        font-size: ${theme.font_size.font_size_0_75rem};
      }

      & > div {
        width: 100%;
        padding: 10px 1rem;
        cursor: pointer;

        &:hover {
          background-color: ${theme.colors.g_colore9e9e9};
        }

        & > button {
          cursor: inherit;
          color: ${theme.colors.g_colorGray111111};
          font-weight: ${theme.font_weight.font_weight_500};
          font-size: ${theme.font_size.font_size_1rem};
        }
      }
    }
  `}
`;

export const ContainerSelectedTags = styled.div<TypeTheme>`
  ${({ theme }) => css`
    width: 100%;
    margin-left: 2px;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;

    & > :not(:last-child) {
      margin-right: 12px;
    }

    & > .pin-tag {
      width: fit-content;
      background-color: ${theme.colors.g_colorGray111111};
      padding: 8px 1rem;
      border-radius: 2rem;
      height: 40px;
      display: flex;
      margin-top: 1rem;
      align-items: center;
      justify-content: center;

      & > span {
        color: ${theme.colors.g_colorGray0};
        font-weight: ${theme.font_weight.font_weight_500};
        font-size: ${theme.font_size.font_size_1rem};
        white-space: nowrap;
      }

      & > button {
        cursor: pointer;
        margin-left: 10px;
        margin-top: 3px;

        & > svg {
          fill: ${theme.colors.g_colorGray0};
        }
      }
    }
  `}
`;

export const ContainerCreatedPinsList = styled.div<TypeTheme>`
  border-radius: 1rem;
  cursor: pointer;
  padding: 10px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* transition: background 100ms ease-in-out; */
  margin-bottom: 10px;

  &.selected {
    background-color: ${({ theme }) => theme.colors.g_colorGray300};
  }

  &:not(&.selected):hover {
    background-color: ${({ theme }) => theme.colors.g_colorGray150};
    /* background-color: ${({ theme }) =>
      theme.colors.g_colorGray150Hovered}; */
  }

  & > .container-img-preview-and-title {
    display: flex;
    align-items: center;
    margin-right: 10px;

    & > .img-preview {
      flex: none;
      width: 72px;
      height: 72px;
      position: relative;
      border-radius: 1rem;
      overflow: hidden;
      margin-right: 10px;

      & > img,
      & > video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    & > span {
      color: ${({ theme }) => theme.colors.g_colorGray300};
      font-size: ${({ theme }) => theme.font_size.font_size_1rem};
      font-weight: ${({ theme }) => theme.font_weight.font_weight_400};

      &.selected {
        color: ${({ theme }) => theme.colors.g_colorGray0};
      }
    }
  }

  & > .more-options {
    flex: none;
    position: relative;
    z-index: 2;

    & > .btn-more-options {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      transition: background 150ms ease-in-out;

      @keyframes animationCategory {
        0% {
          scale: 0.95;
        }
        50% {
          scale: 0.9;
        }
        100% {
          scale: 1;
        }
      }

      &.click {
        animation-name: animationCategory;
        animation-duration: 300ms;
        animation-timing-function: ease-in-out;
      }

      &:not(&.selected):hover {
        background-color: ${({ theme }) => theme.colors.g_colorGray150Hovered};
      }

      &.selected {
        & > svg {
          fill: ${({ theme }) => theme.colors.g_colorGray0};
        }
      }

      & > svg {
        flex: none;
      }
    }

    & > .container-delete-created-pin {
      position: absolute;
      bottom: -3.5rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${({ theme }) => theme.colors.g_colorGray0};
      padding: 8px;
      border-radius: 1rem;
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: left;
      box-shadow: ${({ theme }) => theme.box_shadow.box_shadow_04};
      transition: background 200ms ease-in-out;

      & > button {
        padding: 8px 10px;
        color: ${({ theme }) => theme.colors.g_colorGray300};
        font-size: ${({ theme }) => theme.font_size.font_size_1rem};
        font-weight: ${({ theme }) => theme.font_weight.font_weight_600};
        width: 100%;
        cursor: pointer;
        text-align: left;
        border-radius: 10px;

        &:hover {
          background-color: ${({ theme }) => theme.colors.g_colore9e9e9};
        }
      }
    }
  }
`;

export const ContainerPublishsCreated = styled.div<TypeTheme>`
  ${({ theme }) => css`
    border-right: 1px solid ${theme.colors.g_border_color01};
    min-height: 100vh;
    width: 80px;
    transition: width 100ms ease-in-out;
    align-items: center;
    display: flex;
    flex-direction: column;

    &.btn-active {
      width: 400px;
    }

    & > .container-btns-created-pins {
      margin-bottom: 1rem;
      width: 100%;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid ${theme.colors.g_border_color01};
      height: fit-content;

      & > .btns-drafts-show {
        display: flex;
        flex-direction: column;
        width: 100%;

        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          & > .container-created-pins {
            display: flex;
            align-items: center;

            & > * {
              white-space: nowrap;
              font-size: ${theme.font_size.font_size_1_25rem};
              color: ${theme.colors.g_colorGray300};
            }
            & > h2 {
              font-weight: ${theme.font_weight.font_weight_600};
            }

            & > span {
              margin-left: 5px;
              font-weight: ${theme.font_weight.font_weight_400};
            }
          }
        }

        & > .btn-add-new-publish-pin {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          background-color: ${theme.colors.g_colore9e9e9};
          border-radius: 1.5rem;
          text-align: center;
          padding: 0 8px;
          height: 40px;
          cursor: pointer;
          font-size: ${theme.font_size.font_size_1rem};
          color: ${theme.colors.g_colorGray300};
          font-weight: ${theme.font_weight.font_weight_600};
          transition: background 150ms ease-in-out;

          &:hover {
            background-color: ${theme.colors.g_colorGray100Hovered};
          }
        }
      }

      & > .btns-drafts-hidden {
        display: flex;
        flex-direction: column;

        & > :first-child {
          margin-bottom: 2rem;
        }
      }
    }

    & > .container-created-pins-list {
      width: calc(100% - 1rem);
    }
  `}
`;

export const ContainerBtnPublishsCreated = styled.button<TypeTheme>`
  width: 48px;
  height: 48px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 150ms ease-in-out;

  & > svg {
    flex: none;
    transition: transform 200ms ease-in-out;

    &.btn-active {
      transform: rotate(-180deg);
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.g_colore9e9e9};
  }
`;

export const ContainerBntPublish = styled.button<TypeTheme>`
  ${({ theme }) => css`
    background-color: ${theme.colors.g_colorRed100};
    color: ${theme.colors.g_colorGray0};
    font-size: ${theme.font_size.font_size_1rem};
    font-weight: ${theme.font_weight.font_weight_600};
    padding: 8px 12px;
    border-radius: 24px;
    min-width: 60px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 150ms ease-in-out;

    &:hover {
      background-color: ${theme.colors.g_colorRed100Hovered};
    }
  `}
`;
