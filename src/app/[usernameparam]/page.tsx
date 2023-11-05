import { cookies } from 'next/headers';
import { Metadata } from 'next';
// import { upperFirst } from 'lodash';

import UserPublishsSaves from '@/components/userPublishsSaves';
import NotFoundPage from '../not-found';
import UserInfo from '@/components/userInfo';
import getUser from '@/services/userPage/getUser';
import userItems from '@/services/userPage/userItems';

import styles from './styles.module.css';

interface Props {
  params: { usernameparam: string };
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  profilePhoto: ProfilePhotoType[];
  saves?: string[];
  createIn?: string;
}
export interface ProfilePhotoType {
  _id: string;
  userId: unknown[];
  url: string;
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

  const { profilePhoto, username, email } = userData;

  const { isUniqueUser, userMidiaResults, userSavesResults } = await userItems(
    token,
    userData._id
  );

  return (
    <main className={styles.main}>
      <UserInfo
        email={email}
        isUniqueUser={isUniqueUser}
        profilePhoto={profilePhoto}
        token={token}
        userMidiaResultsLength={userMidiaResults.length}
        userSavesResultsLength={userSavesResults.length}
        username={username}
      />
      <UserPublishsSaves
        publishsResults={userMidiaResults}
        savesResults={userSavesResults}
        token={token as string}
        isUniqueUser={isUniqueUser}
        userId={userData._id}
        username={userData.username}
      />
    </main>
  );
}
