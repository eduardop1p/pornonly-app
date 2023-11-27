'use client';

import { useMediaQuery } from 'react-responsive';
import { ReactNode } from 'react';

import UserPin from '@/components/masonry/userPin';
import SaveAndMore from '@/components/pin/saveAndMore';
import Description from '@/components/pin/description';
import Comments from '@/components/pin/comments';
import { MidiaResultsType } from '@/app/page';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';

import styles from './styels.module.css';

export default function IndexCommentsMinWidth1000({
  isSave,
  dataPin,
  isAuth,
  token,
  resultsComments,
  totalResults,
  userId,
  children,
}: {
  isSave: boolean;
  dataPin: MidiaResultsType;
  isAuth: boolean;
  token: string;
  resultsComments: ResultsCommentsType[];
  totalResults: number;
  userId?: string;
  children: ReactNode;
}) {
  const minWidth1000 = useMediaQuery({ minWidth: 1001 });
  if (!minWidth1000) return null;

  return (
    <div className={styles['container-comments']} id="container-comments">
      <div className={styles['pin-info-user']} id="pin-info-user">
        <SaveAndMore
          isSave={isSave}
          data={{
            _id: dataPin._id,
            title: dataPin.title,
            description: dataPin.description,
            url: dataPin.url,
            midiaType: dataPin.midiaType,
            username: dataPin.userId.username,
            height: dataPin.height,
            width: dataPin.width,
          }}
          isAuth={isAuth}
          token={token}
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
            isAdmin={dataPin.userId.isAdmin}
          />
        </div>
      </div>
      <div className={styles.comments}>
        <Comments
          midiaId={dataPin._id}
          resultsComments={resultsComments}
          totalComments={totalResults}
          dataPin={dataPin}
          token={token}
          isAuth={isAuth}
          userId={userId}
        >
          {children}
        </Comments>
      </div>
    </div>
  );
}
