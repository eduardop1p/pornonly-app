'use client';

import React, { createContext, useReducer } from 'react';

import reducer from './reducer';

export interface GlobalState {
  loginActive: boolean;
  registerActive: boolean;
}
export const Context = createContext({});

export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    loginActive: true,
    registerActive: false,
  });

  return (
    <Context.Provider value={{ state, dispatch }}> {children}</Context.Provider>
  );
}
