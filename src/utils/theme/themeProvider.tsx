'use client';

import { ThemeProvider } from 'styled-components';
import { ReactNode } from 'react';

import { myTheme } from './myTheme';

export default function AppTheme({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={myTheme}>{children}</ThemeProvider>;
}
