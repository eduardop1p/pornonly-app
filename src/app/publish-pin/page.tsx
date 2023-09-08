import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './page.module.css';

import PublishPin from '@/components/form/publishPin';
import { UserType } from '../[usernameparam]/page';
import UserAvatar from '@/components/userAvatar';

export const metadata: Metadata = {
  title: 'Pornonly - Criar pin',
  description: 'Crie seu pin personalizado aqui mesmo na pornonly.',
};

export default function Publish() {
  const token = cookies().get('token')?.value;

  return (
    <main className={styles.main}>
      <div className={styles['container-publish']}>
        <PublishPin token={token as string}>
          <UserAvatarName token={token as string} />
        </PublishPin>
      </div>
    </main>
  );
}

async function UserAvatarName({ token }: { token: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // cache: 'no-cache',
  });
  const data = (await response.json()) as UserType;
  const { username } = data;

  return (
    <div className={styles['container-user']}>
      <div className={styles['user-avatar']}>
        <UserAvatar containerWidth={48} containerHeight={48} />
      </div>
      <h3>{username}</h3>
    </div>
  );
}
