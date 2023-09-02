// import { upperFirst } from 'lodash';
import { ReactNode } from 'react';

import Header from '@/components/header';

import styles from './styles.module.css';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
    </>
  );
}
