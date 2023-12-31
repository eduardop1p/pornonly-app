'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';

import styles from './styles.module.css';

import Loading from '../loading';
import { GlobalErrorComponent } from '../globalErrorComponent';
import useGlobalErro from '@/utils/useGlobalError';

export default function Logout({
  setShowMenus,
}: {
  setShowMenus?: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { handleError, msgError } = useGlobalErro();

  const handleLogout = async () => {
    if (isLoading) return;
    if (setShowMenus) setShowMenus(state => !state);

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_SITE}/api/logout`,
        {
          method: 'GET',
        }
      );
      if (!res.ok) {
        handleError('O logout falhou. Tente novalmente');
        return;
      }
      router.push('/login');
      router.refresh();
    } catch (err) {
      // console.log(err);
      handleError('O logout falhou. Tente novalmente');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <GlobalErrorComponent errorMsg={msgError} />
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Sair
      </button>
    </>
  );
}
