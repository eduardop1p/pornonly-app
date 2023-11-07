import type { UserIdResultsType } from '@/components/masonry/userPin';

const getUser = async (usernameparam: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/users/${usernameparam}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    const data = (await response.json()) as UserIdResultsType;
    if (!response.ok) return null;
    return data;
  } catch {
    // notFound();
  }
};

export default getUser;
