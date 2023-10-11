/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import jwt from 'jsonwebtoken';

import UserProfile from '@/components/userProfile';
import { MidiaType } from '../page';
import UserPublishsSaves from '@/components/userPublishsSaves';

import styles from './styles.module.css';

interface Props {
  params: { usernameparam: string };
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  profilePhoto: ProfilePhotoType[];
  saves?: string[];
  createIn?: string;
}
export interface ProfilePhotoType {
  _id: string;
  userId: unknown[];
  url: string;
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
  const data = (await response.json()) as UserType;

  return {
    title: `Pornonly - ${data.username}`,
  };
}

export default async function Page({ params }: Props) {
  const token = cookies().get('token')?.value;
  const { usernameparam } = params;

  const resUser = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/users/${usernameparam}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!resUser.ok) {
    notFound();
  }
  const userData = (await resUser.json()) as UserType;
  const { profilePhoto, username, email } = userData;

  const resUserMidia = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userData._id}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserMidia = (await resUserMidia.json()) as MidiaType;
  const userMidiaResults = dataUserMidia.midia.results.map(
    (value, index: number) => ({ ...value, index })
  );

  const resUserSaves = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userData._id}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserSaves = (await resUserSaves.json()) as MidiaType;
  const userSavesResults = dataUserSaves.midia.results;

  const userIsLoggedIn: any = token
    ? jwt.verify(token, process.env.TOKEN_SECRET as string)
    : false;
  const isUniqueUser: boolean =
    userIsLoggedIn && userIsLoggedIn._id === userData._id;
  const createIn = new Date(userData.createIn as string).toLocaleDateString(
    'pt-br',
    { dateStyle: 'long' }
  );

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
        {/* <div className={styles['user-createin']}>
          Conta ativa desde: {createIn}
        </div> */}
        <div className={styles['user-total-publishs-and-saves']}>
          <span>
            {userMidiaResults.length == 1
              ? `${userMidiaResults.length} publicação`
              : `${userMidiaResults.length} publicações`}
          </span>
          <span>
            {userSavesResults.length == 1
              ? `${userSavesResults.length} Salvo`
              : `${userSavesResults.length} Salvos`}
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
      <UserPublishsSaves
        publishsResults={userMidiaResults}
        savesResults={userSavesResults}
        token={token as string}
        isUniqueUser={isUniqueUser}
        userId={userData._id}
      />
    </main>
  );
}
