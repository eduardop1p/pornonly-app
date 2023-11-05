import 'server-only';

import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.css';

import UserProfile from '../userProfile';
import { ProfilePhotoType } from '@/app/[usernameparam]/page';

export default function UserInfo({
  isUniqueUser,
  token,
  profilePhoto,
  username,
  email,
  userMidiaResultsLength,
  userSavesResultsLength,
}: {
  isUniqueUser: boolean;
  token: string;
  profilePhoto: ProfilePhotoType[];
  username: string;
  email: string;
  userMidiaResultsLength: number;
  userSavesResultsLength: number;
}) {
  return (
    <div className={styles['user-info']}>
      {isUniqueUser ? (
        <UserProfile
          token={token}
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
          {userMidiaResultsLength == 1
            ? `${userMidiaResultsLength} publicação`
            : `${userMidiaResultsLength} publicações`}
        </span>
        <span>
          {userSavesResultsLength == 1
            ? `${userSavesResultsLength} Salvo`
            : `${userSavesResultsLength} Salvos`}
        </span>
      </div>
      {isUniqueUser && (
        <div className={`${styles.settings} ${styles['user-edite-profile']}`}>
          <div className={styles['user-edite-profile']}>
            <button id="id-user-settings" className={styles['user-settings']}>
              Editar perfil
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
  );
}
