/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import jwt from 'jsonwebtoken';

import UserProfile from '@/components/userProfile';
import { MidiaResults } from '../page';
import UserPublishsSaves from '@/components/userPublishsSaves';
import Header from '@/components/header';

import styles from './styles.module.css';

interface Props {
  params: { usernameparam: string };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePhoto: ProfilePhoto[];
  midia: MidiaResults[];
  createIn: string;
}
export interface ProfilePhoto {
  _id: string;
  userId: unknown[];
  url: string;
}
interface UserToUserName {
  _id: string;
  username: string;
  email: string;
  profilePhoto: ProfilePhoto[];
  midia: {
    results: MidiaResults[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
  createIn: string;
}

// pato borrachudo admin
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = cookies().get('token')?.value;
  const { usernameparam } = params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/users/${usernameparam}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const data = (await response.json()) as User;

  return {
    title: `Pornonly - ${data.username}`,
  };
}

export default async function Page({ params }: Props) {
  const token = cookies().get('token')?.value;
  const { usernameparam } = params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/users/${usernameparam}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!response.ok) {
    notFound();
  }
  const data = (await response.json()) as UserToUserName;
  const { profilePhoto, username, email, midia } = data;
  const { results } = midia;

  const userIsLoggedIn: any = token
    ? jwt.verify(token, process.env.TOKEN_SECRET as string)
    : false;
  const isUniqueUser = userIsLoggedIn && userIsLoggedIn._id === data._id;

  return (
    <main className={styles.main}>
      <div className={styles['user-info']}>
        {isUniqueUser ? (
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
        ) : (
          <div
            className={`${styles['user-avatar']} ${styles['no-user-avatar-hover']}`}
          >
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
        )}

        <h1 className={styles['user-username']}>{username}</h1>
        {isUniqueUser && <span className={styles['user-email']}>{email}</span>}
        <div className={styles['user-total-publishs-and-saves']}>
          <span>
            {results.length == 1
              ? `${results.length} publicação`
              : `${results.length} publicações`}
          </span>
          <span>
            {results.length == 1
              ? `${results.length} Salvo`
              : `${results.length} Salvos`}
          </span>
        </div>
        {isUniqueUser && (
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
        )}
      </div>
      <UserPublishsSaves results={results} />
    </main>
  );
}
