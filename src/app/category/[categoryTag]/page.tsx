import { Metadata } from 'next';
import { upperFirst } from 'lodash';

import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { MidiaType } from '../../page';
import NotFoundPage from '../../not-found';

interface Props {
  params: { categoryTag: string };
}

const getData = async (categoryTag: string) => {
  const order = 'popular';
  if (categoryTag === 'semi-nuds') categoryTag = 'semi nuds';
  if (categoryTag === 'lesbicas') categoryTag = 'lésbicas';

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/midia/search-tags?search_tags=${categoryTag}&order=${order}&page=1`,
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

  return {
    // eslint-disable-next-line
    title: `Pornonly - ${categoryTag === 'lesbicas' ? 'Lésbicas' : upperFirst(categoryTag.replaceAll('-', ' '))}`,
  };
}

export default async function Page({ params }: Props) {
  const { categoryTag } = params;

  const results = await getData(categoryTag);
  if (!results) return <NotFoundPage />;

  return (
    <main className={styles.main}>
      <Masonry masonryPage="tags" results={results} visibleUserInfo={true} />
    </main>
  );
}
