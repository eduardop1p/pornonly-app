import Image from 'next/image';

import styles from './page.module.css';

import Header from '@/components/header';

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
  midiaType: string;
  description: string;
  userId: unknown[];
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
    <>
      <Header />
      <main className={styles.main}>
        {results.map(value => (
          <div key={value._id} className={styles['info-pin']}>
            {value.midiaType === 'img' ? (
              <div className={styles['img-pin']}>
                <Image
                  src={value.url}
                  alt={value.title}
                  width={300}
                  height={350}
                  loading="eager"
                />
              </div>
            ) : (
              <div className={styles['video-pin']}>
                <video src={value.url} controls={true}></video>
              </div>
            )}
            <h2>{value.title}</h2>
          </div>
        ))}
      </main>
    </>
  );
}
