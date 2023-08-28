/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import Image from 'next/image';
import { upperFirst } from 'lodash';
import { notFound } from 'next/navigation';

import Header from '@/components/header';
import UserProfile from '@/components/userProfile';

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
    // cache: 'no-cache',
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // cache: 'no-cache',
  });
  const data = (await response.json()) as User;
  const { profilePhoto, username } = data;

  return (
    <>
      <Header />
      <main className={styles.main}>
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
        </div>
      </main>
    </>
  );
}
