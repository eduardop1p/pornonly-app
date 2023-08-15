/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { upperFirst } from 'lodash';

import styles from './styles.module.css';

interface Props {
  params: { name: string };
}
export interface User {
  id: string;
  username: string;
  email: string;
  midia: unknown[];
  profilePhoto: unknown[];
  createIn: string;
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

  return {
    title: `Pornonly - ${upperFirst(data.username)}`,
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

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1>{data.username}</h1>
      </main>
    </>
  );
}
