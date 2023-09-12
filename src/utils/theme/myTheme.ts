const myTheme = {
  colors: {
    g_color5f5f5f: '#5f5f5f',
    g_colo333: '#333',
    g_colore9e9e9: '#e9e9e9',
    g_colorRed0: '#ff5247',
    g_colorRed100: '#e60023',
    g_colorRedSecondary: '#cc0000',
    g_colorGray0: '#fff',
    g_colorGray50: '#fff',
    g_colorGray100: '#efefef',
    g_colorGray150: '#ddd',
    g_colorGray200: '#767676',
    g_colorGray300: '#111',
    g_colorGray222: '#222',
    g_colorGray111111: '#111111',
    g_colorGray400: ' #000',
    g_colorGray333333: ' #333333',
    g_green: '#0fa573',
    g_pine: '#0a6955',
    g_olive: '#364a4c',
    g_blue: '#0074e8',
    g_navy: '#004b91',
    g_midnight: '#133a5e',
    g_purple: '#b469eb',
    g_orchid: '#8046a5',
    g_eggplant: '#5b2677',
    g_maroon: '#6e0f3c',
    g_watermelon: '#f13535',
    g_orange: '#e3780c',
    g_colorGray0Hovered: '#f0f0f0',
    g_colorGray100Hovered: '#e2e2e2',
    g_colorGray150Hovered: '#d0d0d0',
    g_colorGray200Hovered: '#878787',
    g_colorRed100Hovered: '#ad081b',
    g_blueHovered: '#4a8ad4',
    g_colorGray0Active: '#e0e0e0',
    g_colorGray100Active: '#dadada',
    g_colorGray200Active: '#828282',
    g_colorRed100Active: '#a3081a',
    g_blueActive: '#4a85c9',
    g_colorBgRgb_229: 'rgb(239, 239, 239)',
    g_colorTransparentDarkGray: 'rgba(51,51,51,.8)',
    g_colorTransparentWhite: ' hsla(0,0%,100%,.8)',
    g_colorTransparentGray60: 'rgba(0,0,0,.06)',
    g_colorTransparentGray100: 'rgba(0,0,0,.1)',
    g_colorTransparentGray500: 'rgba(0,0,0,.1)',
    g_colorTransparentGray800: 'rgba(0,0,0,.5)',
    g_border_color01: '#cdcdcd',
  },
  font_weight: {
    font_weight_300: '300',
    font_weight_400: '400',
    font_weight_500: '500',
    font_weight_600: '600',
    font_weight_700: '700',
  },
  font_size: {
    font_size_1rem: '1rem',
    font_size_1_25rem: '1.25rem',
    font_size_2rem: '2rem',
    font_size_3_75rem: '3.75rem',
    font_size_0_90rem: '0.90rem',
    font_size_0_75rem: '0.75rem',
    font_size_0_7rem: '0.7rem',
    font_size_2_5rem: '2.5rem',
  },
  box_shadow: {
    box_shadow_01: '0px 0px 15px -3px rgba(0,0,0,0.1)',
    box_shadow_02: '0 0 0 4px rgb(0 132 255/.5)',
    box_shadow_03: 'rgba(0, 0, 0, 0.1) 0px 8px 8px -8px',
    box_shadow_04: '0 0 8px rgba(0,0,0,.1)',
    box_shadow_05: 'rgba(142, 142, 142, 0.5) 0px 1px 0px 0px',
    box_shadow_06: 'rgb(0, 116, 232) 0px 2px 0px 0px',
    box_shadow_07: 'rgba(0, 0, 0, 0.1) 0px 1px 20px 0px',
  },
};

export interface TypeTheme {
  theme: typeof myTheme;
}
export { myTheme };
