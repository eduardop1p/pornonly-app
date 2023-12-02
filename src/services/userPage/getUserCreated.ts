import { MidiaType } from '@/app/page';

const getUserCreated = async (userId: string) => {
  const resUserMidia = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userid/${userId}?midiaType=undefined&page=1`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const dataUserMidia = (await resUserMidia.json()) as MidiaType;
  const userMidiaResults = dataUserMidia.midia.results.map(
    (value, index: number) => ({ ...value, index })
  );
  const userMidiaTotal = dataUserMidia.midia.totalResults;

  return { userMidiaResults, userMidiaTotal };
};

export default getUserCreated;
