'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Container, ContainerArrowMore } from './styded';

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
    const onscroll = () => {
      if (window.scrollY > 1) {
        header?.classList.add('on-scrollY-header');
      } else {
        header?.classList.remove('on-scrollY-header');
      }
    };
    window.addEventListener('scroll', onscroll);

    return () => window.removeEventListener('scroll', onscroll);
  }, []);

  return (
    <Container>
      <div className="main-navs">
        <Link
          className={pathName === '/' ? 'link-active' : ''}
          href="/"
          scroll={false}
        >
          Página inicial
        </Link>
        <Link
          className={pathName === '/new' ? 'link-active' : ''}
          href="/new"
          scroll={false}
        >
          New
        </Link>
        <Link
          className={pathName === '/redheads' ? 'link-active' : ''}
          href="/redheads"
          scroll={false}
        >
          Ruivas
        </Link>
        <Link
          className={pathName === '/category/imgs' ? 'link-active' : ''}
          href="/category/imgs"
          scroll={false}
        >
          Imagens
        </Link>
        <Link
          className={pathName === '/category/videos' ? 'link-active' : ''}
          href="/category/videos"
          scroll={false}
        >
          Videos
        </Link>
        <Link
          className={pathName === '/category/gifs' ? 'link-active' : ''}
          href="/category/gifs"
          scroll={false}
        >
          Gifs
        </Link>
        {/* <button type="button" className='publish'>
          Categoria
        </button> */}
        {isAuth && (
          <ContainerArrowMore
            onClick={() => setPublishActive(!publishActive)}
            data-publish-active={publishActive}
            onBlur={() => setTimeout(() => setPublishActive(false), 300)}
            tabIndex={1}
          >
            <span>Criar</span>
            <svg
              data-publish-active={publishActive}
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
              className="add-pin"
              data-publish-active={publishActive}
              onClick={event => event.stopPropagation()}
            >
              <Link
                className={
                  pathName === '/publish-pin' ? 'link-active-publish' : ''
                }
                href="/publish-pin"
              >
                Criar pin
              </Link>
              <Link
                className={
                  pathName === '/publish-pack' ? 'link-active-publish' : ''
                }
                href="/publish-pack"
              >
                Criar pack
              </Link>
            </div>
          </ContainerArrowMore>
        )}
      </div>
      <Search />
      {!isAuth ? (
        <div className="links-no-auth">
          <Link className="login" href="/login">
            Login
          </Link>
          <Link className="create-account" href="/create-account">
            Criar conta
          </Link>
        </div>
      ) : (
        <div className="links-auth">
          {children}
          <Logout />
        </div>
      )}
    </Container>
  );
}
