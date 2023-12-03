import { Metadata } from 'next';

import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Pornonly - Login',
  description:
    'Pononly - Faça login para poder adcionar novos pins e fazer comentarios.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL_SITE}/login`,
  },
};

import Login from '@/components/form/login';

export default function Page() {
  return (
    <main className={styles.main}>
      <Login />
    </main>
  );
}
