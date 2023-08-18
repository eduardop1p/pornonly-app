'use client';

import React, { createContext, useReducer } from 'react';

import reducer from './reducer';

export interface GlobalState {
  email: string;
  password: string;
}

export const Context = createContext({});

export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    email: '',
    password: '',
  });

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
}
