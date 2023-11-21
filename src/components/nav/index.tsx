/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { deburr, upperFirst } from 'lodash';
import { useMediaQuery } from 'react-responsive';

import { Container, ContainerArrowMore, ContainerBreakMenu } from './styded';
import MoreMenus from './moreMenus';
import { UserAuthType } from '../header';

import Search from '../search';
import Logout from '../form/logout';
import { TagType } from '../header';

interface Props {
  user: UserAuthType;
  children?: ReactNode;
  tags: TagType[];
  userAvatar: ReactNode;
}

export default function Nav({ user, tags, children, userAvatar }: Props) {
  const pathName = usePathname();
  const { isAuth } = user;

  const [publishActive, setPublishActive] = useState(false);
  const [breakMenuActive, setBreakMenuActive] = useState({
    active: false,
    value: 'Página inicial',
  });

  const maxWidth1300 = useMediaQuery({ maxWidth: 1300 });
  const navMenus = ['/', '/new'];

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

  useEffect(() => {
    switch (pathName) {
      case '/new': {
        setBreakMenuActive({ active: false, value: 'New' });
        break;
      }
      default: {
        setBreakMenuActive({ active: false, value: 'Página inicial' });
        break;
      }
    }
  }, [pathName]);

  return (
    <Container>
      <div className="main-navs">
        {maxWidth1300 ? (
          <ContainerBreakMenu
            onClick={() =>
              setBreakMenuActive(state => ({ ...state, active: !state.active }))
            }
            data-break-menu-active={breakMenuActive.active}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setBreakMenuActive(state => ({ ...state, active: false }));
            }}
            className={navMenus.includes(pathName) ? 'link-active' : ''}
            tabIndex={0}
          >
            <span>{breakMenuActive.value}</span>
            <svg
              data-break-menu-active={breakMenuActive.active}
              height="12"
              width="12"
              viewBox="0 0 24 24"
            >
              <path d="M12 19.5.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
            </svg>
            <div
              className="container-more-links"
              data-break-menu-active={breakMenuActive.active}
              onClick={event => event.stopPropagation()}
            >
              <Link
                className={pathName === '/' ? 'link-active' : ''}
                href="/"
                scroll={false}
              >
                Página inicial
                {pathName === '/' && <IsActiveIcon />}
              </Link>

              <Link
                className={pathName === '/new' ? 'link-active' : ''}
                href="/new"
                scroll={false}
              >
                New
                {pathName === '/new' && <IsActiveIcon />}
              </Link>
            </div>
          </ContainerBreakMenu>
        ) : (
          <>
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
          </>
        )}

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
        {/* <CategoryTags tags={tags} /> */}
        <Link
          href="/categories"
          className={pathName.includes('/categories') ? 'link-active' : ''}
          scroll={false}
        >
          Categorias
        </Link>
        {isAuth && (
          <ContainerArrowMore
            onClick={() => setPublishActive(!publishActive)}
            data-publish-active={publishActive}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setPublishActive(false);
            }}
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
              className="container-more-links"
              data-publish-active={publishActive}
              onClick={event => event.stopPropagation()}
            >
              <Link
                className={pathName === '/publish-pin' ? 'link-active' : ''}
                href="/publish-pin"
                onClick={() => setPublishActive(false)}
              >
                Criar pin
                {pathName === '/publish-pin' && <IsActiveIcon />}
              </Link>
              <Link
                className={pathName === '/publish-pack' ? 'link-active' : ''}
                href="/publish-pack"
                onClick={() => setPublishActive(false)}
              >
                Criar pack
                {pathName === '/publish-pack' && <IsActiveIcon />}
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
          {/* <Logout /> */}
        </div>
      )}
      <MoreMenus user={user} userAvatar={userAvatar} />
    </Container>
  );
}

function IsActiveIcon() {
  return (
    <svg height="12" width="12" viewBox="0 0 24 24">
      <path d="M9.17 21.75.73 12.79c-.97-1.04-.97-2.71 0-3.75a2.403 2.403 0 0 1 3.53 0l4.91 5.22L19.74 3.03c.98-1.04 2.55-1.04 3.53 0 .97 1.03.97 2.71 0 3.74L9.17 21.75z"></path>
    </svg>
  );
}

// function CategoryTags({ tags }: { tags: TagType[] }) {
//   const pathName = usePathname();

//   const [categoryActive, setCategoryActive] = useState(false);

//   return (
//     <ContainerArrowMore
//       onClick={() => setCategoryActive(!categoryActive)}
//       data-category-active={categoryActive}
//       onBlur={event => {
//         if (!event.currentTarget.contains(event.relatedTarget))
//           setCategoryActive(false);
//       }}
//       tabIndex={1}
//     >
//       <span>Categorias</span>
//       <svg
//         data-category-active={categoryActive}
//         height="12"
//         width="12"
//         viewBox="0 0 24 24"
//         aria-hidden="true"
//         aria-label=""
//         role="img"
//       >
//         <path d="M12 19.5.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
//       </svg>
//       <div
//         className="container-more-links category"
//         data-category-active={categoryActive}
//         onClick={event => event.stopPropagation()}
//       >
//         {tags.map(val => (
//           <Link
//             key={val._id}
//             className={
//               pathName === `/category/${clearPathName(val.tag)}`
//                 ? 'link-active'
//                 : ''
//             }
//             onClick={() => setCategoryActive(false)}
//             href={`/category/${clearPathName(val.tag)}`}
//           >
//             {upperFirst(val.tag)}
//           </Link>
//         ))}
//       </div>
//     </ContainerArrowMore>
//   );
// }

// const clearPathName = (pathName: string) => {
//   return deburr(pathName.replaceAll(' ', '-').toLowerCase());
// };
