import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

import styles from './page.module.css';

import PublishPin from '@/components/form/publishPin';

export interface UserTokenType {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export const metadata: Metadata = {
  title: 'Pornonly - Criar pin',
  description: 'Crie seu pin personalizado aqui mesmo na pornonly.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL_SITE}/publish-pin`,
  },
};

export default function Page() {
  const token = cookies().get('token')?.value as string;
  const user = verify(
    token,
    process.env.TOKEN_SECRET as string
  ) as UserTokenType;

  return (
    <main className={styles.main}>
      <PublishPin token={token} isAdmin={user.isAdmin} />
    </main>
  );
}
