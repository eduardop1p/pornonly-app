import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Pornonly - Criar conta',
  description: 'Pononly - Crie uma conta e aproveite o maximo do nosso site.',
};

import CreateAccount from '@/components/form/createAccount';

export default function Page() {
  const isAuth = cookies().has('token');

  return (
    <main className={styles.main}>
      <CreateAccount isAuth={isAuth} />
    </main>
  );
}
