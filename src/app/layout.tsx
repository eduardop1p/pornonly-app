import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import StyledComponentsRegistry from '@/lib/registry';
import HomeUserNoAuth from '@/templates/home';
import AppContext from '@/utils/context/appContext';
import AppTheme from '@/utils/theme/themeProvider';

export const metadata: Metadata = {
  title: 'Pornonly',
  description: 'Pononly - Crie sua conta ou faça login.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = cookies().has('token');

  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/assets/svgs/logo.svg" sizes="32x32" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <AppTheme>
            <AppContext>{isAuth ? children : <HomeUserNoAuth />}</AppContext>
          </AppTheme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
