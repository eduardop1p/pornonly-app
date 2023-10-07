'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import styles from './styles.module.css';

import Search from '../search';
import Logout from '../form/logout';

interface Props {
  isAuth: boolean;
  children?: ReactNode;
}

export default function Nav({ isAuth, children }: Props) {
  const [publishActive, setPublishActive] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const header = document.querySelector('header');
    window.onscroll = () => {
      if (window.scrollY > 1) {
        header?.classList.add('on-scrollY-header');
      } else {
        header?.classList.remove('on-scrollY-header');
      }
    };
  }, []);

  return (
    <>
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
        {/* <button type="button" className={styles.publish}>
          Categoria
        </button> */}
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
            {children}
            <Logout />
          </div>
        )}
      </nav>
    </>
  );
}
