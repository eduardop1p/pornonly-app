import 'server-only';

import { cookies } from 'next/headers';
import Link from 'next/link';

import styles from './styles.module.css';

import { User } from '@/app/user/[name]/page';

export default async function UserLogo() {
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
    <div className={styles.container}>
      <Link href={`/user/${data.username}`}>
        {data.username.at(0)?.toUpperCase()}
      </Link>
    </div>
  );
}
