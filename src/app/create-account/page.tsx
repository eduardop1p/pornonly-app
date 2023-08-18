import { Metadata } from 'next';

import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Pornonly - Criar conta',
  description: 'Pononly - Crie uma conta e aproveite o maximo do nosso site.',
};

import Header from '@/components/header';
import CreateAccount from '@/components/form/createAccount';

export default function Page() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <CreateAccount />
      </main>
    </>
  );
}
