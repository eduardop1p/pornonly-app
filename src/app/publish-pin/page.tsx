import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './page.module.css';

import PublishPin from '@/components/form/publishPin';

export const metadata: Metadata = {
  title: 'Pornonly - Criar pin',
  description: 'Crie seu pin personalizado aqui mesmo na pornonly.',
};

export default function Page() {
  const token = cookies().get('token')?.value as string;
  return (
    <main className={styles.main}>
      <PublishPin token={token} />
    </main>
  );
}
