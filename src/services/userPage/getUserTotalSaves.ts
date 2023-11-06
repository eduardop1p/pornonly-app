interface TotalMidiaType {
  midia: { totalResults: number };
}

export default async function getUserTotalSaves(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/saves/get-all-saves-userId-length/${userId}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const data = (await res.json()) as TotalMidiaType;
  const userSavesTotal = data.midia.totalResults;

  return { userSavesTotal };
}
