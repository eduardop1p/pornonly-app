import { verify } from 'jsonwebtoken';

export default function uniqueUser(token: string, userId: string) {
  const userIsLoggedIn: any = token
    ? verify(token, process.env.TOKEN_SECRET as string)
    : false;
  const isUniqueUser: boolean = userIsLoggedIn && userIsLoggedIn._id === userId;

  return isUniqueUser;
}
