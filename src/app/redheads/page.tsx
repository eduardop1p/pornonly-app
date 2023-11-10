import { Metadata } from 'next';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../page';
import NotFoundPage from '../not-found';

export const metadata: Metadata = {
  title: 'Pornonly - Ruivas',
};

export default async function Page() {
  const redheadsTags = ['Ruivas'];
  const order = 'popular';

  const res = await fetch(
    // eslint-disable-next-line
    `${process.env.NEXT_PUBLIC_URL_API
    }/midia/search-tags?search_tags=${redheadsTags.join(
      ','
    )}&order=${order}&page=1`,
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
      <Masonry
        masonryPage="readHeads"
        tags={redheadsTags}
        results={results}
        visibleUserInfo={true}
      />
    </main>
  );
}
