import { Metadata } from 'next';
import { upperFirst } from 'lodash';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../../page';
import NotFoundPage from '../../not-found';

interface Props {
  params: { categoryTag: string };
  searchParams: { midiaType: 'img' | 'video' | 'gif' };
}

const getData = async (categoryTag: string, midiaType: string) => {
  const order = 'popular';
  categoryTag = categoryTag.replaceAll('-', ' ');

  try {
    const res = await fetch(
      // eslint-disable-next-line
      `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${categoryTag}${midiaType ? `&midiaType=${midiaType}` : ''}&order=${order}&page=1`,
      {
        method: 'GET',
        next: { tags: ['pin'] },
      }
    );
    if (!res.ok) {
      return null;
    }
    const {
      midia: { results },
    } = (await res.json()) as MidiaType;
    return results;
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let { categoryTag } = params;
  if (categoryTag === 'lesbicas') categoryTag = 'Lésbicas';
  if (categoryTag === 'asiaticas') categoryTag = 'Asiáticas';
  if (categoryTag === 'masturbacao') categoryTag = 'Masturbação';

  return {
    // eslint-disable-next-line
    title: `Pornonly - ${upperFirst(categoryTag.replaceAll('-', ' '))}`,
    // title: `Pornonly - ${deburr(upperFirst(categoryTag.replaceAll('-', ' ')))}`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { categoryTag } = params;
  const { midiaType } = searchParams;

  const results = await getData(categoryTag, midiaType);
  if (!results) return <NotFoundPage />;

  return (
    <main className={styles.main}>
      <Masonry
        masonryPage="tags"
        results={results}
        midiaTypeFilter={midiaType}
        visibleUserInfo={true}
      />
    </main>
  );
}
