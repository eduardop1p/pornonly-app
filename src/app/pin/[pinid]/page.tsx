/* eslint-disable prettier/prettier */
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import { MidiaResultsType } from '@/app/page';
import Pin from '@/components/pin';
import BackButton from '@/components/pin/backButton';
import calHeight from '@/config/calcHeight';
import SaveAndMore from '@/components/pin/saveAndMore';

interface Props {
  params: { pinid: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pinid } = params

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

  return {
    title: `Pornonly - ${data.title}`,
    description: data.description
  }
}

export default async function Page({ params }: Props) {
  const { pinid } = params;
  const token = cookies().get('token')?.value
  const isAuth = cookies().has('token');

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
  const isSave = data.userId.saves?.includes(data._id)

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
          <div className={styles['save-and-comments']}>
            <SaveAndMore isSave={isSave as boolean} data={{ url: data.url, _id: data._id, title: data.title, midiaType: data.midiaType, username: data.userId.username }} isAuth={isAuth} token={token as string} />
          </div>
        </div>
      </div>
    </main>
  );
}
