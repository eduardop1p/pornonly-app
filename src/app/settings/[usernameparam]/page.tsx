import { cookies } from 'next/headers';
import { Metadata } from 'next';
// import { upperFirst } from 'lodash';

import NotFoundPage from '../../not-found';
import UserInfo from '@/components/userInfo';
import getUser from '@/services/userPage/getUser';
import UserUpdate from '@/components/userUpdate';
import uniqueUser from '@/services/userPage/uniqueUser';
import getUserTotalMidia from '@/services/userPage/getUserTotalMidia';
import getUserTotalSaves from '@/services/userPage/getUserTotalSaves';

import styles from './styles.module.css';

interface Props {
  params: { usernameparam: string };
}

// pato borrachudo admin
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { usernameparam } = params;

  const data = await getUser(usernameparam);

  return {
    // eslint-disable-next-line
    title: `Pornonly - ${data ? 'Configurações' : 'Error 404'}`,
  };
}

export default async function Page({ params }: Props) {
  const token = cookies().get('token')?.value as string;
  const { usernameparam } = params;

  const userData = await getUser(usernameparam);
  if (!userData || userData.username !== usernameparam) return <NotFoundPage />;

  const { profilePhoto, username, email } = userData;
  const userId = userData._id as string;

  const { userMidiaTotal } = await getUserTotalMidia(userId);
  const { userSavesTotal } = await getUserTotalSaves(userId);

  const isUniqueUser = uniqueUser(token, userId);

  return (
    <main className={styles.main}>
      <UserInfo
        email={email as string}
        isUniqueUser={isUniqueUser}
        profilePhoto={profilePhoto}
        token={token}
        userMidiaResultsLength={userMidiaTotal}
        userSavesResultsLength={userSavesTotal}
        username={username}
      />

      <UserUpdate
        currentEmail={email as string}
        currentUsername={username}
        token={token}
      />
    </main>
  );
}
