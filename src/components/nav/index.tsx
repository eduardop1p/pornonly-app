/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { ReactNode, useState, useEffect, } from 'react';
import { usePathname } from 'next/navigation';
import { deburr, upperFirst } from 'lodash';
import { useMediaQuery } from 'react-responsive';
import type { Dispatch, SetStateAction } from 'react';

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

const breakMenuActiveInitalState = {
  active: false,
  value: 'Página inicial',
  routeActive: false,
};

export default function Nav({ user, tags, children, userAvatar }: Props) {
  const { isAuth } = user;

  const [breakMenuActive, setBreakMenuActive] = useState(
    breakMenuActiveInitalState
  );
  const maxWidth840 = useMediaQuery({ maxWidth: 840 });

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
        <Menu
          breakMenuActive={breakMenuActive}
          setBreakMenuActive={setBreakMenuActive}
          isAuth={isAuth}
        />
      </div>
      <Search />
      {!isAuth ? (
        <div className="links-no-auth">
          <Link className="login" href="/login">
            {!maxWidth840 ? 'Login' : 'L'}
          </Link>
          <Link className="create-account" href="/create-account">
            {!maxWidth840 ? 'Criar conta' : 'C'}
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

function Menu({
  setBreakMenuActive,
  breakMenuActive,
  isAuth,
}: {
  setBreakMenuActive: Dispatch<
    SetStateAction<typeof breakMenuActiveInitalState>
  >;
  breakMenuActive: typeof breakMenuActiveInitalState;
  isAuth: boolean;
}) {
  const pathName = usePathname();

  const [publishActive, setPublishActive] = useState(false);

  const maxWidth1370 = useMediaQuery({ maxWidth: 1370 });
  const maxWidth1325 = useMediaQuery({ maxWidth: 1325 });
  const maxWidth1240 = useMediaQuery({ maxWidth: 1240 });
  const maxWidth1100 = useMediaQuery({ maxWidth: 1100 });
  const maxWidth1015 = useMediaQuery({ maxWidth: 1015 });
  const maxWidth950 = useMediaQuery({ maxWidth: 950 });

  useEffect(() => {
    if (pathName.includes('/categories')) {
      if (maxWidth950) {
        setBreakMenuActive({
          active: false,
          value: 'Categorias',
          routeActive: true,
        });
      } else {
        setBreakMenuActive({
          active: false,
          value: 'Página inicial',
          routeActive: false,
        });
      }
      return;
    }

    switch (pathName) {
      case '/new': {
        if (maxWidth1370) {
          setBreakMenuActive({
            active: false,
            value: 'New',
            routeActive: true,
          });
        } else {
          setBreakMenuActive(breakMenuActiveInitalState);
        }
        break;
      }
      case '/redheads': {
        if (maxWidth1325) {
          setBreakMenuActive({
            active: false,
            value: 'Ruivas',
            routeActive: true,
          });
        } else {
          setBreakMenuActive(breakMenuActiveInitalState);
        }
        break;
      }
      case '/category/imgs': {
        if (maxWidth1240) {
          setBreakMenuActive({
            active: false,
            value: 'Imagens',
            routeActive: true,
          });
        } else {
          setBreakMenuActive(breakMenuActiveInitalState);
        }
        break;
      }
      case '/category/videos': {
        if (maxWidth1100) {
          setBreakMenuActive({
            active: false,
            value: 'Videos',
            routeActive: true,
          });
        } else {
          setBreakMenuActive(breakMenuActiveInitalState);
        }
        break;
      }
      case '/category/gifs': {
        if (maxWidth1015) {
          setBreakMenuActive({
            active: false,
            value: 'Gifs',
            routeActive: true,
          });
        } else {
          setBreakMenuActive(breakMenuActiveInitalState);
        }
        break;
      }
      case '/': {
        setBreakMenuActive({
          active: false,
          value: 'Página inicial',
          routeActive: true,
        });
        break;
      }
      default: {
        setBreakMenuActive(breakMenuActiveInitalState);
        break;
      }
    }
  }, [
    pathName,
    maxWidth1370,
    maxWidth1325,
    maxWidth1240,
    maxWidth1100,
    maxWidth1015,
    maxWidth950,
    setBreakMenuActive,
  ]);

  return (
    <>
      {maxWidth1370 && (
        <ContainerBreakMenu
          onClick={() =>
            setBreakMenuActive(state => ({ ...state, active: !state.active }))
          }
          data-break-menu-active={breakMenuActive.active}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setBreakMenuActive(state => ({ ...state, active: false }));
          }}
          className={
            (pathName.includes(breakMenuActive.value.toLocaleLowerCase()) ||
              pathName === '/' ||
              pathName === '/redheads') &&
              breakMenuActive.routeActive
              ? 'link-active'
              : ''
          }
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
            {maxWidth1325 && (
              <Link
                className={pathName === '/redheads' ? 'link-active' : ''}
                href="/redheads"
                scroll={false}
              >
                Ruivas
                {pathName === '/redheads' && <IsActiveIcon />}
              </Link>
            )}
            {maxWidth1240 && (
              <Link
                className={pathName === '/category/imgs' ? 'link-active' : ''}
                href="/category/imgs"
                scroll={false}
              >
                Imagens
                {pathName === '/category/imgs' && <IsActiveIcon />}
              </Link>
            )}
            {maxWidth1100 && (
              <Link
                className={pathName === '/category/videos' ? 'link-active' : ''}
                href="/category/videos"
                scroll={false}
              >
                Videos
                {pathName === '/category/videos' && <IsActiveIcon />}
              </Link>
            )}
            {maxWidth1015 && (
              <Link
                className={pathName === '/category/gifs' ? 'link-active' : ''}
                href="/category/gifs"
                scroll={false}
              >
                Gifs
                {pathName === '/category/gifs' && <IsActiveIcon />}
              </Link>
            )}
            {maxWidth950 && (
              <Link
                className={
                  pathName.includes('/categories') ? 'link-active' : ''
                }
                href="/categories"
                scroll={false}
              >
                Categorias
                {pathName.includes('/categories') && <IsActiveIcon />}
              </Link>
            )}
          </div>
        </ContainerBreakMenu>
      )}
      {!maxWidth1370 && (
        <Link
          className={pathName === '/' ? 'link-active' : ''}
          href="/"
          scroll={false}
        >
          Página inicial
        </Link>
      )}
      {!maxWidth1370 && (
        <Link
          className={pathName === '/new' ? 'link-active' : ''}
          href="/new"
          scroll={false}
        >
          New
        </Link>
      )}
      {!maxWidth1325 && (
        <Link
          className={pathName === '/redheads' ? 'link-active' : ''}
          href="/redheads"
          scroll={false}
        >
          Ruivas
        </Link>
      )}
      {!maxWidth1240 && (
        <Link
          className={pathName === '/category/imgs' ? 'link-active' : ''}
          href="/category/imgs"
          scroll={false}
        >
          Imagens
        </Link>
      )}
      {!maxWidth1100 && (
        <Link
          className={pathName === '/category/videos' ? 'link-active' : ''}
          href="/category/videos"
          scroll={false}
        >
          Videos
        </Link>
      )}
      {!maxWidth1015 && (
        <Link
          className={pathName === '/category/gifs' ? 'link-active' : ''}
          href="/category/gifs"
          scroll={false}
        >
          Gifs
        </Link>
      )}
      {!maxWidth950 && (
        <Link
          href="/categories"
          className={pathName.includes('/categories') ? 'link-active' : ''}
          scroll={false}
        >
          Categorias
        </Link>
      )}

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
    </>
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
