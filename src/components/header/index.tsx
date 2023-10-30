import 'server-only';

import Link from 'next/link';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import Logo from '../logo';
import Nav from '../Nav';
import UserAvatar from '../userAvatar';

interface TagsType {
  midiaTags: TagType[];
}

export interface TagType {
  _id: string;
  tag: string;
}

export default async function Header() {
  const isAuth = cookies().has('token');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-tags-category`,
    {
      method: 'GET',
    }
  );
  const data = (await res.json()) as TagsType;
  const results = data.midiaTags;

  return (
    <header className={styles['header-container']}>
      <Link className={styles['logo-title']} href="/">
        <Logo />
        <h2>Pornonly</h2>
      </Link>
      <Nav isAuth={isAuth} tags={results}>
        <UserAvatar containerWidth={25} containerHeight={25} />
      </Nav>
    </header>
  );
}
