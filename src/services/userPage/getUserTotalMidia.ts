interface TotalMidiaType {
  midia: { totalResults: number };
}

export default async function getUserTotalMidia(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-userId-length/${userId}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const data = (await res.json()) as TotalMidiaType;
  const userMidiaTotal = data.midia.totalResults;

  return { userMidiaTotal };
}
