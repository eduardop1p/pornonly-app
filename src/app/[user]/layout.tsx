// import { upperFirst } from 'lodash';
import { ReactNode } from 'react';
import NotFoundPage from '../not-found';

import { cookies } from 'next/headers';

import Header from '@/components/header';

import styles from './styles.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  const token = cookies().get('token')?.value;

  return token ? (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
    </>
  ) : (
    <NotFoundPage />
  );
}
