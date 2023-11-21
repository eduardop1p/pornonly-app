import { cookies } from 'next/headers';
import { Metadata } from 'next';
// import { upperFirst } from 'lodash';

import UserPublishs from '@/components/userPublishs';
import NotFoundPage from '../not-found';
import UserInfo from '@/components/userInfo';
import getUser from '@/services/userPage/getUser';
import getUserCreated from '@/services/userPage/getUserCreated';
import getUserTotalSaves from '@/services/userPage/getUserTotalSaves';
import uniqueUser from '@/services/userPage/uniqueUser';

import styles from './styles.module.css';

interface Props {
  params: { usernameparam: string };
}

// pato borrachudo admin
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { usernameparam } = params;

  const data = await getUser(usernameparam);

  return {
    title: `Pornonly - ${data ? data.username : 'Error 404'}`,
    description: data ? `Veja todas as publicações de ${data.username}` : '',
  };
}

export default async function Page({ params }: Props) {
  const token = cookies().get('token')?.value as string;
  const { usernameparam } = params;

  const userData = await getUser(usernameparam);
  if (!userData || userData.username !== usernameparam) return <NotFoundPage />;
  const userId = userData._id as string;

  const { profilePhoto, username, email } = userData;

  const { userMidiaResults, userMidiaTotal } = await getUserCreated(userId);
  const { userSavesTotal } = await getUserTotalSaves(userId);

  const isUniqueUser = uniqueUser(token, userId);

  return (
    <main className={styles.main}>
      <UserInfo
        email={email}
        isUniqueUser={isUniqueUser}
        profilePhoto={profilePhoto}
        token={token}
        userMidiaResultsLength={userMidiaTotal}
        userSavesResultsLength={userSavesTotal}
        username={username}
      />
      <UserPublishs
        publishsResults={userMidiaResults}
        token={token}
        isUniqueUser={isUniqueUser}
        userId={userId}
        username={userData.username}
      />
    </main>
  );
}
