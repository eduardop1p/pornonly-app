import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../page';
import NotFoundPage from '../not-found';

export const metadata: Metadata = {
  title: 'Pornonly - Painel do admin',
};

export default async function Page() {
  const token = cookies().get('token')?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-pending?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    return <NotFoundPage />;
  }
  const {
    midia: { results },
  } = (await res.json()) as MidiaType;

  return (
    <main className={styles.main}>
      {results.length ? (
        <Masonry
          masonryPage="pending"
          results={results}
          visibleUserInfo={true}
          token={token}
          isAdmin
        />
      ) : (
        <p style={{ textAlign: 'center', width: '100%', marginTop: '2rem' }}>
          Nenhum publicação pendente
        </p>
      )}
    </main>
  );
}
