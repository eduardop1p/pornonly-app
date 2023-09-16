import styled, { css } from 'styled-components';

import { TypeTheme } from '@/utils/theme/myTheme';

interface Props {
  $midiaType?: 'video' | 'img' | 'gif';
}

export const Container = styled.div<TypeTheme & Props>`
  ${({ theme, $midiaType }) => css`
    display: flex;
    align-items: center;
    position: fixed;
    background-color: ${theme.colors.g_colorGray222};
    justify-content: center;
    left: 50%;
    transform: translate(-50%, 125px);
    min-height: 45px;
    bottom: 1.5rem;
    padding: 8px 1rem;
    border-radius: 10px;
    margin-bottom: 0 !important;
    transition: transform 500ms ease-in-out;
    z-index: 5;

    &[data-show-success='true'] {
      transform: translate(-50%, 0);
    }

    & > img {
      margin-right: 7px;
      flex: none;
      position: relative;
      border-radius: 5px;
      width: auto;
      height: 28px !important;
      display: ${$midiaType === 'video' ? 'none' : 'inline-block'};
    }
    & > video {
      margin-right: 7px;
      flex: none;
      position: relative;
      border-radius: 5px;
      width: auto;
      height: 28px !important;
      display: ${$midiaType !== 'video' ? 'none' : 'inline-block'};
    }

    & > span {
      color: ${theme.colors.g_colorGray0};
      font-size: ${theme.font_size.font_size_0_90rem};
      font-weight: ${theme.font_weight.font_weight_500};
    }
  `}
`;
