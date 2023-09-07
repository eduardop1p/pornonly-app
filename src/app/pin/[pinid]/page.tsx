/* eslint-disable prettier/prettier */
import { notFound } from 'next/navigation';

import styles from './styles.module.css';

import { MidiaResultsType } from '@/app/page';
import Pin from '@/components/pin';
import BackButton from '@/components/pin/backButton';
import calHeight from '@/config/calcHeight';

interface Props {
  params: { pinid: string };
}

export default async function Page({ params }: Props) {
  const { pinid } = params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-midiaid/${pinid}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!response.ok) {
    notFound();
  }
  const data = (await response.json()) as MidiaResultsType;

  const pinWidth = 500;
  const pinHeight = calHeight({
    customWidth: pinWidth,
    originalHeight: data.height,
    originalWidth: data.width,
  });

  return (
    <main className={styles.main}>
      <BackButton />
      <div className={styles['container']}>
        <div
          className={`${styles['pin-default-container']} ${pinHeight < 460 ? styles['pin-alternative-container'] : ''}`}
        >
          <Pin data={data} />
          {/* <div style={{ height: '500px' }}>Meus comentarios com 500ox</div> */}
        </div>
      </div>
    </main>
  );
}
