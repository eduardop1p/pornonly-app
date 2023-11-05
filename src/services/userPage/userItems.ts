import { verify } from 'jsonwebtoken';

import { MidiaType } from '@/app/page';

const userItems = async (token: string, userId: string) => {
  const resUserMidia = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserMidia = (await resUserMidia.json()) as MidiaType;
  const userMidiaResults = dataUserMidia.midia.results.map(
    (value, index: number) => ({ ...value, index })
  );

  const resUserSaves = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserSaves = (await resUserSaves.json()) as MidiaType;
  const userSavesResults = dataUserSaves.midia.results;

  const userIsLoggedIn: any = token
    ? verify(token, process.env.TOKEN_SECRET as string)
    : false;
  const isUniqueUser: boolean = userIsLoggedIn && userIsLoggedIn._id === userId;
  // const createIn = new Date(userData.createIn as string).toLocaleDateString(
  //   'pt-br',
  //   { dateStyle: 'long' }
  // );

  return { userMidiaResults, userSavesResults, isUniqueUser };
};

export default userItems;
