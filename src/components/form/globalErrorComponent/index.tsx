'use client';

import { useRef } from 'react';

import { ContainerError } from './styles';

export function GlobalErrorComponent({ errorMsg }: { errorMsg?: string }) {
  let refErrorMsg = useRef(errorMsg);
  if (errorMsg) refErrorMsg.current = errorMsg;

  return (
    <ContainerError data-show-error={errorMsg ? true : false}>
      <span>{refErrorMsg.current}</span>
    </ContainerError>
  );
}
