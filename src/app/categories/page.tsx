import { Metadata } from 'next';

import styles from './page.module.css';

import MasonryCategories from '@/components/masonryCategories';
import NotFoundPage from '../not-found';

interface CategoriesType {
  results: CategoryType[];
}

export interface CategoryType {
  _id: string;
  title: string;
  tag: string;
  width: string;
  height: string;
  newWidth: string;
  newHeight: string;
  url: string;
}

export const metadata: Metadata = {
  title: 'Pornonly - Categorias',
};

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/category`, {
    method: 'GET',
    next: { tags: ['pin'] },
  });
  if (!res.ok) {
    return <NotFoundPage />;
  }
  const data = (await res.json()) as CategoriesType;

  return (
    <main className={styles.main}>
      <MasonryCategories results={data.results} />
    </main>
  );
}
