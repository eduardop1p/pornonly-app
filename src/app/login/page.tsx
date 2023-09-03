import { Metadata } from 'next';

import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Pornonly - Login',
  description:
    'Pononly - Faça login aqui para poder adcionar publicações e fazer comentarios em fotos.',
};

import Login from '@/components/form/login';

export default function Page() {
  return (
    <main className={styles.main}>
      <Login />
    </main>
  );
}
