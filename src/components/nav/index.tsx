'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './styles.module.css';

import Search from '../search';

interface Props {
  isAuth: boolean;
}

export default function Nav({ isAuth }: Props) {
  const pathName = usePathname();

  return (
    <nav className={styles.nav}>
      <Link className={pathName === '/' ? styles['link-active'] : ''} href="/">
        Página inicial
      </Link>
      <Link
        className={pathName === '/new' ? styles['link-active'] : ''}
        href="/new"
      >
        new
      </Link>
      <Search />
      {!isAuth && (
        <div className={styles['links-no-auth']}>
          <Link className={styles.login} href="/login">
            Login
          </Link>
          <Link className={styles['create-account']} href="/create-account">
            Criar conta
          </Link>
        </div>
      )}
    </nav>
  );
}
