import 'server-only';

import Image from 'next/image';
import { cookies } from 'next/headers';
import Link from 'next/link';
// import { notFound } from 'next/navigation';

import styles from './styles.module.css';

import { UserType } from '@/app/[usernameparam]/page';

interface Props {
  noLink?: boolean;
  containerWidth: number;
  containerHeight: number;
}

export default async function UserAvatar({
  noLink,
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
  const user = (await response.json()) as UserType;
  const { profilePhoto } = user;

  return (
    <div
      // eslint-disable-next-line
      className={`${styles.container} ${noLink ? styles['container-no-link'] : ''}`}
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }}
    >
      {noLink ? (
        <div className={styles['container-profile']}>
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
        </div>
      ) : (
        <Link
          href={`/${user.username}`}
          className={styles['container-profile-link']}
        >
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
      )}
    </div>
  );
}
