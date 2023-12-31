/* eslint-disable @typescript-eslint/no-unused-vars */
import 'server-only';

import Link from 'next/link';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

import styles from './styles.module.css';

import Logo from '../logo';
import NavHeader from '../NavHeader';
import UserAvatar from '../userAvatar';
import { UserTokenType } from '@/app/publish-pin/page';

interface TagsType {
  midiaTags: TagType[];
}

export interface TagType {
  _id: string;
  tag: string;
}

export interface UserAuthType {
  isAuth: boolean;
  email: string;
  username: string;
}

export default async function Header() {
  const isAuth = cookies().has('token');
  const token = cookies().get('token')?.value;
  let user: UserAuthType = { isAuth, email: '', username: '' };
  if (isAuth && token && process.env.TOKEN_SECRET) {
    const userVerify = verify(token, process.env.TOKEN_SECRET) as UserTokenType;
    user = { isAuth, ...userVerify } as UserAuthType;
  }

  return (
    <header className={styles['header-container']}>
      <Link className={styles['logo-title']} href="/">
        <Logo />
        <h2>Pornonly</h2>
      </Link>
      <NavHeader
        user={user}
        userAvatar={
          <UserAvatar containerWidth={60} containerHeight={60} noLink />
        }
      >
        <UserAvatar containerWidth={25} containerHeight={25} />
      </NavHeader>
    </header>
  );
}
