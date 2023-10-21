import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './styles.module.css';

import { MidiaResultsType, MidiaType } from '@/app/page';
import Pin from '@/components/pin';
import BackButton from '@/components/pin/backButton';
import SaveAndMore from '@/components/pin/saveAndMore';
import Description from '@/components/pin/description';
import Comments from '@/components/pin/comments';
import { UserIdResultsType } from '@/components/masonry/userPin';
import UserAvatar from '@/components/userAvatar';
import UserPin from '@/components/masonry/userPin';
import { UserType } from '@/app/[usernameparam]/page';
import Masonry from '@/components/masonry';

interface Props {
  params: { pinid: string };
}

export interface CommentsType {
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
  indexComm?: number;
  createIn: string;
}

export interface ResponsesCommentsType {
  _id: string;
  comment: string;
  userId: UserIdResultsType;
  userNameResponse?: string;
  indexRes?: number;
  likes: LikesType;
  createIn: string;
}

export interface LikesType {
  likes: number;
  users: string[];
}

const getPinToId = async (pinId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/midia/get-midiaid/${pinId}`,
      {
        method: 'GET',
        next: { tags: ['pin'] },
      }
    );
    if (!response.ok) {
      notFound();
      // throw new Error('server connection error.');
    }
    const data = (await response.json()) as MidiaResultsType;
    return data;
  } catch {
    throw new Error('Internal server error.');
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pinid } = params;

  const data = await getPinToId(pinid);

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

  const dataPin = await getPinToId(pinid);

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
  const resultsComments = commentsMidia.results.map((value, indexComm) => ({
    ...value,
    responses: value.responses.map((value, indexRes) => ({
      ...value,
      indexRes,
    })),
    indexComm,
  }));

  let resultsMidiaSearchTag: MidiaResultsType[] = [];
  if (dataPin.tags.join()) {
    const resMidiaSearchTags = await fetch(
      // eslint-disable-next-line
      `${process.env.NEXT_PUBLIC_URL_API
      }/midia/search-tags?search_tags=${dataPin.tags.join(',')}&page=1`,
      {
        method: 'GET',
        next: { tags: ['pin'] },
      }
    );
    const dataMidiaSearchTag = (await resMidiaSearchTags.json()) as MidiaType;
    resultsMidiaSearchTag = dataMidiaSearchTag.midia.results.filter(
      value => value._id !== pinid
    );
  }

  return (
    <main className={styles.main}>
      <BackButton />
      <div className={styles['container']} id="pin-container">
        <div className={styles['container-pin']}>
          <Pin data={dataPin} />
        </div>
        <div className={styles['container-comments']}>
          <div className={styles['pin-info-user']}>
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
              totalComments={commentsMidia.totalResults}
              dataPin={dataPin}
              token={token as string}
              isAuth={isAuth}
              userId={userId}
            >
              <UserAvatar containerHeight={48} containerWidth={48} noLink />
            </Comments>
          </div>
        </div>
      </div>
      {resultsMidiaSearchTag.length ? (
        <div className={styles['more-similar']}>
          <h2>Mais como este</h2>
          <div className={styles['results-search-tag']}>
            <Masonry
              masonryPage="tags"
              results={resultsMidiaSearchTag}
              visibleUserInfo
              tags={dataPin.tags}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
