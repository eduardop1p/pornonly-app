import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

export const Container = styled.div`
  margin: 2rem 1rem 5rem;
  display: flex;
  justify-content: center;
  position: relative;
`;

export const FormContainer = styled.form`
  flex: none;
  width: 500px;

  & > :not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const ContainerBtns = styled.div<TypeTheme>`
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.g_colorGray0};
  padding: 1rem 0;
  box-shadow: ${({ theme }) => theme.box_shadow.box_shadow_04};
  left: 0;

  & > button {
    padding: 8px 12px;
    font-size: ${({ theme }) => theme.font_size.font_size_1rem};
    font-weight: ${({ theme }) => theme.font_weight.font_weight_500};
    width: 100px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    cursor: pointer;
    transition: background 100ms ease-in-out;

    &.equal-value {
      background-color: ${({ theme }) =>
        theme.colors.g_colorGray100} !important;
      color: ${({ theme }) => theme.colors.g_color5f5f5f} !important;
      cursor: default !important;
    }
  }

  & > :first-child {
    background-color: ${({ theme }) => theme.colors.g_colorGray100};

    &:hover {
      background-color: ${({ theme }) => theme.colors.g_colorGray100Hovered};
    }
  }

  & > :last-child {
    background-color: ${({ theme }) => theme.colors.g_colorRed100};
    color: ${({ theme }) => theme.colors.g_colorGray0};
    margin-left: 1rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.g_colorRed100Hovered};
    }
  }
`;

export const ContainerLinks = styled.div<TypeTheme>`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    left: 0;
    top: 0;

    & > :first-child {
      margin-bottom: 5px;
    }

    & > a,
    & > button {
      display: inline-block;
      background-color: transparent;
      font-size: ${theme.font_size.font_size_1rem};
      font-weight: ${theme.font_weight.font_weight_500};
      color: ${theme.colors.g_colorGray300};
      cursor: pointer;
      transition: background 150ms ease-in-out;
      border-radius: 10px;
      padding: 8px;
      min-height: 37px;
      position: relative;
      cursor: pointer;

      &.link-active::before {
        content: '';
        width: 50%;
        height: 3.5px;
        border-radius: 3px;
        bottom: 0;
        left: 10px;
        position: absolute;
        background-color: ${theme.colors.g_colorGray300};
      }

      &:not(&.link-active):hover {
        background-color: ${theme.colors.g_colore9e9e9};
      }

      & > svg {
        margin-left: 1rem;
      }
    }
  `}
`;
