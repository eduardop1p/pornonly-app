import { UserType } from '@/app/[usernameparam]/page';

const getUser = async (usernameparam: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/users/${usernameparam}`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );
    const data = (await response.json()) as UserType;
    if (!response.ok) return null;
    return data;
  } catch {
    // notFound();
  }
};

export default getUser;
