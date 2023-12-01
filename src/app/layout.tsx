import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import GoogleAnalytics from '@/components/googleAnalytics';

import StyledComponentsRegistry from '@/lib/registry';

import AppTheme from '@/utils/theme/themeProvider';
import AppContext from '@/utils/appContextUser/appContext';

const Header = dynamic(() => import('@/components/header'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Pornonly',
  description: 'Pononly - Aproveite do melhor conteúdo adulto aqui.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/assets/svgs/logo.svg" sizes="32x32" />
      </head>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}
      <body>
        <StyledComponentsRegistry>
          <AppTheme>
            <AppContext>
              <Header />
              {children}
            </AppContext>
          </AppTheme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
