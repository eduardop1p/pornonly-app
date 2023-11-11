import React from 'react';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

import NotFoundPage from '@/app/not-found';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const token = cookies().get('token')?.value;
  let isAdmin = false;

  if (token) {
    const bson = verify(token, process.env.TOKEN_SECRET as string) as any;
    isAdmin = bson.isAdmin;
  }

  return isAdmin ? children : <NotFoundPage />;
}
