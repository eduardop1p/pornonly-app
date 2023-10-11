import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../page';

export const metadata: Metadata = {
  title: 'Pornonly - Recentes',
};

export default async function New() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-day?page=1`,
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
      <Masonry masonryPage="new" results={results} visibleUserInfo={true} />
    </main>
  );
}
