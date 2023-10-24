import { Metadata } from 'next';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../page';
import NotFoundPage from '../not-found';

interface Props {
  searchParams: { search_query: string };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { search_query } = searchParams;
  return {
    title: `Pornonly - Resultados para: ${search_query}`,
  };
}

export default async function Page({ searchParams: { search_query } }: Props) {
  const res = await fetch(
    // eslint-disable-next-line
    `${process.env.NEXT_PUBLIC_URL_API
    }/midia/search?search_query=${search_query}&page=1`,
    {
      method: 'GET',
      next: { tags: ['pin'] },
    }
  );
  if (!res.ok) {
    return <NotFoundPage />;
  }
  let {
    midia: { results },
  } = (await res.json()) as MidiaType;

  return (
    <main className={styles.main}>
      {results.length ? (
        <Masonry
          masonryPage="search"
          search_query={search_query}
          results={results}
          visibleUserInfo={true}
        />
      ) : (
        <div className={styles['no-search']}>
          <div className={styles['search']}>
            <svg
              viewBox="0 0 24 24"
              aria-label="Ícone de pesquisa"
              role="img"
              className={styles['search-icon']}
            >
              <path d="M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24"></path>
            </svg>
          </div>
          <h4 className={styles['search-no-title']}>
            Não foi possível encontrar Pins para esta pesquisa
          </h4>
        </div>
      )}
    </main>
  );
}
