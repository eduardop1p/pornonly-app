import { MidiaType } from '@/app/page';

const getUserSaves = async (userId: string) => {
  const resUserSaves = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userid/${userId}?page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserSaves = (await resUserSaves.json()) as MidiaType;
  const userSavesResults = dataUserSaves.midia.results;
  const userSavesTotal = dataUserSaves.midia.totalResults;

  return { userSavesResults, userSavesTotal };
};

export default getUserSaves;
