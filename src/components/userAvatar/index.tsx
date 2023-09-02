import 'server-only';

import Image from 'next/image';
import { cookies } from 'next/headers';
import Link from 'next/link';
// import { notFound } from 'next/navigation';

import styles from './styles.module.css';

import { User } from '@/app/[usernameparam]/page';

interface Props {
  containerWidth: number;
  containerHeight: number;
}

export default async function UserAvatar({
  containerWidth,
  containerHeight,
}: Props) {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });
  if (!response.ok) {
    return;
  }
  const user = (await response.json()) as User;
  const { profilePhoto } = user;

  return (
    <div
      className={styles.container}
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      <Link href={`/${user.username}`}>
        {profilePhoto.length ? (
          <Image
            src={profilePhoto[0].url}
            alt={user.username}
            fill
            priority
            sizes="100%"
          />
        ) : (
          user.username?.at(0)?.toUpperCase()
        )}
      </Link>
    </div>
  );
}
