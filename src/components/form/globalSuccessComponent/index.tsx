'use client';

import { useRef, ReactNode } from 'react';

import { ContainerSuccess } from './styles';

export function GlobalSuccessComponent({
  successMsg,
  children,
}: {
  successMsg?: string;
  children?: ReactNode;
}) {
  let refErrorMsg = useRef(successMsg);
  if (successMsg) refErrorMsg.current = successMsg;

  return (
    <ContainerSuccess data-show-success={successMsg ? true : false}>
      {children}
      <span>{refErrorMsg.current}</span>
    </ContainerSuccess>
  );
}
