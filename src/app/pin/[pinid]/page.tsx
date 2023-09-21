import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import { MidiaResultsType } from '@/app/page';
import Pin from '@/components/pin';
import BackButton from '@/components/pin/backButton';
import calHeight from '@/config/calcHeight';
import SaveAndMore from '@/components/pin/saveAndMore';
import UserPinAndComments from '@/components/pin/comments/userPinAndComments';
import Description from '@/components/pin/description';
import Comments from '@/components/pin/comments';
import { UserIdResultsType } from '@/components/masonry/userPin';
import AddComments from '@/components/pin/comments/addComments';
import UserAvatar from '@/components/userAvatar';

interface Props {
  params: { pinid: string };
}

interface CommentsType {
  commentsMidia: {
    results: ResultsCommentsType[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface ResultsCommentsType {
  _id: string;
  comment: string;
  userId: UserIdResultsType;
  createIn: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  return {
    title: `Pornonly - ${data.title}`,
    description: data.description,
    openGraph: {
      type: 'website',
      title: data.title,
      siteName: 'Pornonly',
      url: process.env.URL_SITE,
      description: data.description,
      images: data.midiaType != 'video' ? data.url : undefined,
      videos: data.midiaType == 'video' ? data.url : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { pinid } = params;
  const token = cookies().get('token')?.value;
  const isAuth = cookies().has('token');

  const resPin = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-midiaid/${pinid}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!resPin.ok) {
    notFound();
  }
  const dataPin = (await resPin.json()) as MidiaResultsType;
  const isSave = dataPin.userId.saves?.includes(dataPin._id);

  const resComments = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/comments/${dataPin._id}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  if (!resComments.ok) {
    notFound();
  }
  const { commentsMidia } = (await resComments.json()) as CommentsType;
  const resultsComments = commentsMidia.results;

  const pinWidth = 500;
  const pinHeight = calHeight({
    customWidth: pinWidth,
    originalHeight: dataPin.height,
    originalWidth: dataPin.width,
  });

  return (
    <main className={styles.main}>
      <BackButton />
      <div className={styles['container']}>
        <div
          // eslint-disable-next-line
          className={`${styles['pin-default-container']} ${pinHeight < 460 ? styles['pin-alternative-container'] : ''}`}
        >
          <Pin data={dataPin} />
          <div className={styles['save-and-comments']}>
            <div id="pin-info-user">
              <SaveAndMore
                isSave={isSave as boolean}
                data={{
                  _id: dataPin._id,
                  title: dataPin.title,
                  description: dataPin.description,
                  url: dataPin.url,
                  midiaType: dataPin.midiaType,
                  username: dataPin.userId.username,
                }}
                isAuth={isAuth}
                token={token as string}
              />
              <div className={styles['pin-info']}>
                <h2 className={styles['pin-title']}>{dataPin.title}</h2>
                {dataPin.description && (
                  <Description description={dataPin.description} />
                )}
                <UserPinAndComments
                  profilePhoto={dataPin.userId.profilePhoto}
                  username={dataPin.userId.username}
                  midia={dataPin.userId.midia}
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <div className={styles.comments}>
              <Comments
                midiaId={dataPin._id}
                results={resultsComments}
                token={token as string}
                isAuth={isAuth}
              />
            </div>
            <div className={styles['add-comments']}>
              <h3 className={styles['comments-count']}>
                {resultsComments.length === 1
                  ? `${resultsComments.length} comentário`
                  : `${resultsComments.length} comentários`}
              </h3>
              <AddComments>
                {<UserAvatar containerHeight={48} containerWidth={48} noLink />}
              </AddComments>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
