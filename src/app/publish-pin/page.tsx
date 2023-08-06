import { Metadata } from 'next';

import styles from './page.module.css';

import Header from '@/components/header';
import PublishPin from '@/components/publishPin';

export const metadata: Metadata = {
  title: 'Pornonly - Criar pin',
  description: 'Crie seu pin personalizado aqui mesmo na pornonly.',
};

export default function Publish() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles['container-publish']}>
          <PublishPin />
        </div>
      </main>
    </>
  );
}
