import { Metadata } from 'next';

import styles from './page.module.css';

import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Pornonly',
  description: 'Pononly - Aproveite do melhor conteúdo adulto aqui.',
};

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2>home</h2>
      </main>
    </>
  );
}
