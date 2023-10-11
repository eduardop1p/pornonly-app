import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../page';

export const metadata: Metadata = {
  title: 'Pornonly - Ruivas',
};

export default async function New() {
  const redheadsTags = ['ruivas', 'ruiva', 'redheads', 'redhead', 'red'];

  const res = await fetch(
    // eslint-disable-next-line
    `${process.env.NEXT_PUBLIC_URL_API
    }/midia/search-tags?search_tags=${redheadsTags.join(',')}&page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!res.ok) {
    notFound();
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
