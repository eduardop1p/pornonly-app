import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

import styles from './page.module.css';

import Header from '@/components/header';
import PublishPin from '@/components/form/publishPin';
import { User } from '../user/[name]/page';

export const metadata: Metadata = {
  title: 'Pornonly - Criar pin',
  description: 'Crie seu pin personalizado aqui mesmo na pornonly.',
};

export default function Publish() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles['container-publish']}>
          <PublishPin>
            <UserAvatarName />
          </PublishPin>
        </div>
      </main>
    </>
  );
}

async function UserAvatarName() {
  const token = cookies().get('token')?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // cache: 'no-cache',
  });
  const data = (await response.json()) as User;

  return (
    <div className={styles['container-user']}>
      <Link href={`/user/${data.username}`} className={styles['user-avatar']}>
        {data.username.at(0)?.toUpperCase()}
      </Link>
      <h3>{data.username}</h3>
    </div>
  );
}
