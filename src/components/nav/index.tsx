'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './styles.module.css';

import Search from '../search';
import Loading from '../loadingClient';
import { GlobalErrorClient as GlobalError } from '../globalErrorClient';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';

interface Props {
  isAuth: boolean;
}

export default function Nav({ isAuth }: Props) {
  const pathName = usePathname();
  const redirect = useRouter();

  const [publishActive, setPublishActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL_API}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      redirect.refresh();
      redirect.push('/login');
    } catch {
      handleServerError('O logout falhou. Tente novalmente.');
    } finally {
      setIsLoading(false);
    }
  };

  // 'O logout falhou. Tente novalmente.'

  return (
    <>
      {isLoading && <Loading />}
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
      <nav className={styles.nav}>
        <Link
          className={pathName === '/' ? styles['link-active'] : ''}
          href="/"
        >
          Página inicial
        </Link>
        <Link
          className={pathName === '/new' ? styles['link-active'] : ''}
          href="/new"
        >
          new
        </Link>
        {isAuth && (
          <button
            className={styles.publish}
            type="button"
            onClick={() => setPublishActive(!publishActive)}
            data-publish-active={publishActive}
            onBlur={() => setTimeout(() => setPublishActive(false), 300)}
            tabIndex={1}
          >
            <span>Criar</span>
            <svg
              height="12"
              width="12"
              viewBox="0 0 24 24"
              aria-hidden="true"
              aria-label=""
              role="img"
            >
              <path d="M12 19.5.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
            </svg>
            <div
              className={styles['add-pin']}
              onClick={event => event.stopPropagation()}
            >
              <Link
                className={
                  pathName === '/publish-pin'
                    ? styles['link-active-publish']
                    : ''
                }
                href="/publish-pin"
              >
                Criar pin
              </Link>
              <Link
                className={
                  pathName === '/publish-pack'
                    ? styles['link-active-publish']
                    : ''
                }
                href="/publish-pack"
              >
                Criar pack
              </Link>
            </div>
          </button>
        )}
        <Search />
        {!isAuth ? (
          <div className={styles['links-no-auth']}>
            <Link className={styles.login} href="/login">
              Login
            </Link>
            <Link className={styles['create-account']} href="/create-account">
              Criar conta
            </Link>
          </div>
        ) : (
          <div className={styles['links-auth']}>
            <span>user</span>
            <button type="button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
