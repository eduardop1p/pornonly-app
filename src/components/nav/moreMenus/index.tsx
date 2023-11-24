import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { SetStateAction, Dispatch, ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

import { Container, ContainerMenus, ContainerUser } from './styled';

import Logout from '@/components/form/logout';
import { UserAuthType } from '@/components/header';
import PornonlyTitle from '@/components/pornonlyTilte';

export default function MoreMenus({
  user,
  userAvatar,
}: {
  user: UserAuthType;
  userAvatar: ReactNode;
}) {
  const [showMenus, setShowMenus] = useState(false);

  return (
    <Container
      tabIndex={0}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setShowMenus(false);
      }}
    >
      <button
        type="button"
        className="btn-more-menus"
        data-show-menus={showMenus}
        onClick={() => setShowMenus(!showMenus)}
      >
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M12 19.5.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
        </svg>
      </button>
      <Menus
        showMenus={showMenus}
        setShowMenus={setShowMenus}
        user={user}
        userAvatar={userAvatar}
      />
    </Container>
  );
}

function Menus({
  showMenus,
  user,
  setShowMenus,
  userAvatar,
}: {
  showMenus: boolean;
  user: UserAuthType;
  setShowMenus: Dispatch<SetStateAction<boolean>>;
  userAvatar: ReactNode;
}) {
  const { isAuth, username, email } = user;
  const pathName = usePathname();

  const maxWidth720 = useMediaQuery({ maxWidth: 720 });
  const maxWidth440 = useMediaQuery({ maxWidth: 440 });

  return (
    <ContainerMenus
      data-show-menus={showMenus}
      onClick={event => event.stopPropagation()}
      id="container-menus"
    >
      {maxWidth720 && <PornonlyTitle marginBottom0={isAuth} />}
      {isAuth && (
        <>
          <span>Atualmente em</span>
          <User
            username={username}
            email={email}
            userAvatar={userAvatar}
            setShowMenus={setShowMenus}
          />
        </>
      )}
      {isAuth && maxWidth440 && (
        <>
          <span style={{ margin: '15px 0 5px 8px' }}>Criar</span>
          <Link
            className={pathName === '/publish-pin' ? 'link-active' : ''}
            href="/publish-pin"
            onClick={() => setShowMenus(state => !state)}
          >
            Criar pin
            {pathName === '/publish-pin' && <IsActiveIcon />}
          </Link>
          <Link
            className={pathName === '/publish-pack' ? 'link-active' : ''}
            href="/publish-pack"
            onClick={() => setShowMenus(state => !state)}
          >
            Criar pack
            {pathName === '/publish-pack' && <IsActiveIcon />}
          </Link>
        </>
      )}
      {isAuth && <span style={{ margin: '10px 0 10px 8px' }}>Mais opções</span>}
      {isAuth && (
        <Link
          href={`/settings/${username}`}
          className={pathName === `/settings/${username}` ? 'link-active' : ''}
          onClick={() => setShowMenus(state => !state)}
        >
          Configurações
          {pathName === `/settings/${username}` && <IsActiveIcon />}
        </Link>
      )}
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/privacy-policy`}
        target="_blank"
      >
        Política de privacidade
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/cookies-policy`}
        target="_blank"
      >
        Política de cookies
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/terms-service`}
        target="_blank"
      >
        Termos de serviço
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/report-bugs`}
        target="_blank"
      >
        Reportar bugs
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/compliments-improvements`}
        target="_blank"
      >
        Elogios e sugestões de melhorias
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_PORNONLY_POLICY_URL}/request-content-pack`}
        target="_blank"
      >
        Pedir pack de conteúdos
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M20.97 12a2 2 0 0 1-1.99-2V7.81l-7.07 7.1a2 2 0 1 1-2.83-2.83L16.16 5h-2.17a2 2 0 0 1 0-4H23l-.03 9a2 2 0 0 1-2 2zM6.75 4a1.25 1.25 0 1 1 0 2.5H3.5v14h14v-3.26a1.25 1.25 0 1 1 2.5 0v4.51c0 .69-.56 1.25-1.25 1.25H2.25C1.56 23 1 22.44 1 21.75V5.25C1 4.56 1.56 4 2.25 4z"></path>
        </svg>
      </Link>
      <Link
        href="/create-account"
        className={pathName === '/create-account' ? 'link-active' : ''}
        onClick={() => setShowMenus(state => !state)}
      >
        {isAuth ? 'Criar nova conta' : 'Criar conta'}
        {pathName === '/create-account' && <IsActiveIcon />}
      </Link>
      {!isAuth && (
        <Link
          href="/login"
          className={pathName === '/login' ? 'link-active' : ''}
          onClick={() => setShowMenus(state => !state)}
        >
          Login
          {pathName === '/login' && <IsActiveIcon />}
        </Link>
      )}
      {isAuth && <Logout setShowMenus={setShowMenus} />}
    </ContainerMenus>
  );
}

function User({
  username,
  email,
  userAvatar,
  setShowMenus,
}: {
  username: string;
  email: string;
  userAvatar: ReactNode;
  setShowMenus: Dispatch<SetStateAction<boolean>>;
}) {
  const handleFormatText = (value: string) => {
    return value.length > 21 ? `${value.slice(0, 21)}...` : value;
  };

  return (
    <ContainerUser>
      <Link href={`/${username}`} onClick={() => setShowMenus(state => !state)}>
        <div className="user-avatar">
          {userAvatar}
          <div>
            <h3>{handleFormatText(username)}</h3>
            <p>{handleFormatText(email)}</p>
          </div>
        </div>
        <svg height="12" width="12" viewBox="0 0 24 24">
          <path d="M9.17 21.75.73 12.79c-.97-1.04-.97-2.71 0-3.75a2.403 2.403 0 0 1 3.53 0l4.91 5.22L19.74 3.03c.98-1.04 2.55-1.04 3.53 0 .97 1.03.97 2.71 0 3.74L9.17 21.75z"></path>
        </svg>
      </Link>
    </ContainerUser>
  );
}

function IsActiveIcon() {
  return (
    <svg height="12" width="12" viewBox="0 0 24 24">
      <path d="M9.17 21.75.73 12.79c-.97-1.04-.97-2.71 0-3.75a2.403 2.403 0 0 1 3.53 0l4.91 5.22L19.74 3.03c.98-1.04 2.55-1.04 3.53 0 .97 1.03.97 2.71 0 3.74L9.17 21.75z"></path>
    </svg>
  );
}
