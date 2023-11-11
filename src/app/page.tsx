import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { UserIdResultsType } from '@/components/masonry/userPin';
import { LikesType } from './pin/[pinid]/page';
import NotFoundPage from './not-found';

export interface MidiaType {
  midia: {
    results: MidiaResultsType[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface MidiaResultsType {
  index?: number;
  _id: string;
  title: string;
  midiaType: 'img' | 'gif' | 'video';
  tags: string[];
  likes: LikesType;
  width: number;
  height: number;
  description: string;
  userId: UserIdResultsType;
  url: string;
  thumb?: string;
  duration?: string;
  createIn: string;
}

export default async function Page() {
  // const midiaType = undefined;
  const order = 'popular';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all?order=${order}&page=1`,
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
      <Masonry masonryPage="home" results={results} visibleUserInfo={true} />
    </main>
  );
}
