/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

import UserProfile from '@/components/userProfile';
import { MidiaType } from '../page';

import styles from './styles.module.css';

interface Props {
  params: { user: string };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePhoto: ProfilePhoto[];
  createIn: string;
}
export interface ProfilePhoto {
  _id: string;
  userId: unknown[];
  url: string;
}

// pato borrachudo admin
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = cookies().get('token')?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });
  const data = (await response.json()) as User;
  if (params.user !== data.username) {
    notFound();
  }

  return {
    title: `Pornonly - ${data.username}`,
  };
}

export default async function Page({ params }: Props) {
  const token = cookies().get('token')?.value;

  const user = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });
  const userData = (await user.json()) as User;
  const { profilePhoto, username, email } = userData;

  const userMidia = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid?page=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );
  const { midia } = (await userMidia.json()) as MidiaType;
  const userTotalMidia = midia.results;

  return (
    <div className={styles['user-info']}>
      <UserProfile
        token={token as string}
        photo={{
          profilePhoto,
          username,
        }}
      >
        <div className={styles['user-avatar']}>
          {profilePhoto.length ? (
            <Image
              src={profilePhoto[0].url}
              alt={username}
              fill
              priority
              sizes="100%"
            />
          ) : (
            <span>{username?.at(0)?.toUpperCase()}</span>
          )}
        </div>
      </UserProfile>
      <h1 className={styles['user-username']}>{username}</h1>
      <span className={styles['user-email']}>{email}</span>
      <span className={styles['user-total-midia']}>
        {userTotalMidia.length} publicações
      </span>
      <div className={`${styles.settings} ${styles['user-edite-profile']}`}>
        <div className={styles['user-edite-profile']}>
          <button id="id-user-settings" className={styles['user-settings']}>
            Editar Perfil
          </button>
        </div>
        <Link
          className={styles['user-settings']}
          href={`/settings/${username}`}
        >
          Configurações
        </Link>
      </div>
    </div>
  );
}
