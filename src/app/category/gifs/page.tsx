import { Metadata } from 'next';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../../page';
import NotFoundPage from '../../not-found';

export const metadata: Metadata = {
  title: 'Pornonly - Gifs',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL_SITE}/category/gifs`,
  },
};

export default async function Page() {
  const order = 'popular';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-type/gif?order=${order}&page=1`,
    {
      method: 'GET',
      next: { tags: ['pin'] },
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
      <Masonry masonryPage="gif" results={results} visibleUserInfo={true} />
    </main>
  );
}
