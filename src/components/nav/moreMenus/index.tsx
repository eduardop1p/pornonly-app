import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Container, ContainerMenus } from './styled';

import Logout from '@/components/form/logout';

export default function MoreMenus({
  isAuth,
  token,
}: {
  isAuth: boolean;
  token?: string;
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
      <Menus showMenus={showMenus} isAuth={isAuth} token={token} />
    </Container>
  );
}

function Menus({
  showMenus,
  isAuth,
  token,
}: {
  showMenus: boolean;
  isAuth: boolean;
  token?: string;
}) {
  return (
    <ContainerMenus
      data-show-menus={showMenus}
      onClick={event => event.stopPropagation()}
    >
      {isAuth && (
        <Link
          href={`/settings/jobis`}
        // className={
        //   pathName === `/settings/${currentUsername}` ? 'link-active' : ''
        // }
        >
          Configurações
        </Link>
      )}
      {isAuth && <Logout />}
    </ContainerMenus>
  );
}
