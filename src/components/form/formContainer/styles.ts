import styled, { css } from 'styled-components';
import { TypeTheme } from '@/utils/theme/myTheme';

export const FormContainer = styled.div<TypeTheme>`
  ${({ theme }) => css`
    margin: 7.5rem auto 3rem;
    max-width: 700px;
    min-height: 500px;
    padding: 2rem 1rem;
    border-radius: 2rem;
    /* box-shadow: ${theme.box_shadow.box_shadow_01}; */
    background-color: ${theme.colors.g_colorGray0};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    & > :not(:last-child) {
      margin-bottom: 1rem;
    }

    & > h1 {
      color: ${theme.colors.g_colorGray333333};
      font-size: ${theme.font_size.font_size_2rem};
      font-weight: ${theme.font_weight.font_weight_600};
    }

    & > form {
      width: calc(100% - 12rem);
      margin-top: 1rem;
      min-width: 240px;

      & > * {
        margin-bottom: 14px;
      }

      & > a {
        color: ${theme.colors.g_colorGray111111};
        font-size: ${theme.font_size.font_size_0_90rem};
        font-weight: ${theme.font_weight.font_weight_600};

        &:hover {
          text-decoration: underline;
        }
      }

      & > .login,
      & > .create-account,
      & > .password-reset {
        margin: 1rem auto 0;
        padding: 8px 12px;
        font-size: ${theme.font_size.font_size_1rem};
        font-weight: ${theme.font_weight.font_weight_600};
        width: 150px;
        /* width: calc(100% - 15rem); */
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        cursor: pointer;
        transition: background 100ms ease-in-out;
        background-color: ${theme.colors.g_colorRed100};
        color: ${theme.colors.g_colorGray0};

        &:hover {
          background-color: ${theme.colors.g_colorRed100Hovered};
        }
      }
    }

    & > .create-account-title,
    & > .login-title {
      font-size: ${theme.font_size.font_size_0_75rem};
      font-weight: bold;
      color: ${theme.colors.g_colorGray333333};

      & > a {
        color: inherit;
        margin-left: 5px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `}
`;
