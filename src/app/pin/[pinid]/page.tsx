import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import { MidiaResultsType } from '@/app/page';
import Pin from '@/components/pin';
import BackButton from '@/components/pin/backButton';
import calHeight from '@/config/calcHeight';
import SaveAndMore from '@/components/pin/saveAndMore';
import Description from '@/components/pin/description';
import Comments from '@/components/pin/comments';
import { UserIdResultsType } from '@/components/masonry/userPin';
import UserAvatar from '@/components/userAvatar';
import UserPin from '@/components/masonry/userPin';
import { UserType } from '@/app/[usernameparam]/page';

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
  likes: LikesType;
  userId: UserIdResultsType;
  responses: ResponsesCommentsType[];
  createIn: string;
}

export interface ResponsesCommentsType {
  _id: string;
  comment: string;
  userId: UserIdResultsType;
  userNameResponse?: string;
  likes: LikesType;
  createIn: string;
}

export interface LikesType {
  likes: number;
  users: string[];
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
    // throw new Error('server connection error.');
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
      cache: 'reload',
    }
  );
  if (!resPin.ok) {
    notFound();
  }
  const dataPin = (await resPin.json()) as MidiaResultsType;

  let isSave = false;
  let userId = null;

  if (isAuth) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    });
    if (!res.ok) {
      return;
    }
    const user = (await res.json()) as UserType;
    userId = user._id;
    isSave = user.saves?.includes(pinid) as boolean;
  }

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

  const allCommentsInPin =
    resultsComments.length +
    resultsComments.reduce(
      (ac: number, value) => ac + value.responses.length,
      0
    );

  return (
    <main className={styles.main}>
      <BackButton />
      <div className={styles['container']}>
        <div
          // eslint-disable-next-line
          className={`${styles['pin-default-container']} ${pinHeight < 460 ? styles['pin-alternative-container'] : ''}`}
          id="id-pin-default-container"
        >
          <Pin data={dataPin} />
          <div className={styles['save-and-comments']}>
            <div id="pin-info-user">
              <SaveAndMore
                isSave={isSave}
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
                <UserPin
                  profilePhoto={dataPin.userId.profilePhoto}
                  username={dataPin.userId.username}
                  midia={dataPin.userId.midia}
                />
              </div>
            </div>
            <div className={styles.comments}>
              <Comments
                midiaId={dataPin._id}
                resultsComments={resultsComments}
                token={token as string}
                isAuth={isAuth}
                userId={userId}
                allCommentsInPin={allCommentsInPin}
              >
                <UserAvatar containerHeight={48} containerWidth={48} noLink />
              </Comments>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
