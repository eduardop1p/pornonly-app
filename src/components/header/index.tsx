import 'server-only';

import Link from 'next/link';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import Logo from '../logo';
import Nav from '../Nav';
import UserAvatar from '../userAvatar';

export default function Header() {
  const isAuth = cookies().has('token');

  return (
    <header className={styles['header-container']}>
      <Link className={styles['logo-title']} href="/">
        <Logo />
        <h2>Pornonly</h2>
      </Link>
      <Nav isAuth={isAuth}>
        <UserAvatar containerWidth={25} containerHeight={25} />
      </Nav>
    </header>
  );
}
