import styles from './page.module.css';

import Masonry from '@/components/masonry';
import { UserIdResults } from '@/components/masonry/userPin';

export interface MidiaType {
  midia: {
    results: MidiaResults[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface MidiaResults {
  _id: string;
  title: string;
  midiaType: 'img' | 'gif' | 'video';
  width: number;
  height: number;
  duration?: string;
  description: string;
  userId: UserIdResults;
  url: string;
  createIn: string;
}

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all/${process.env.API_KEY}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const {
    midia: { results },
  } = (await res.json()) as MidiaType;

  return (
    <main className={styles.main}>
      <Masonry results={results} justifyContent="center" />
    </main>
  );
}
