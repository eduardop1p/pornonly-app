import { Metadata } from 'next';

import styles from './styles.module.css';

import PasswordReset from '@/components/form/passwordReset';

export const metadata: Metadata = {
  title: 'Pornonly - Redefinir senha',
};

export default function Page() {
  return (
    <main className={styles.main}>
      <PasswordReset />
    </main>
  );
}
