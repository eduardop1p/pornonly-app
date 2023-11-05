import React from 'react';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

import NotFoundPage from '@/app/not-found';

interface Props {
  params: { usernameparam: string };
  children: React.ReactNode;
}

export default function Layout({ children, params }: Props) {
  const { usernameparam } = params;
  const token = cookies().get('token')?.value;
  let isAuth = false;

  if (token) {
    const bson = verify(token, process.env.TOKEN_SECRET as string) as any;
    const username = bson.username;
    isAuth = username === usernameparam;
  }

  return isAuth ? children : <NotFoundPage />;
}
