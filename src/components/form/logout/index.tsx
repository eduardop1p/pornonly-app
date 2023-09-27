'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './styles.module.css';

import Loading from '../loading';
import { GlobalError } from '../globalError';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';

export default function Logout() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { handleServerError, showGlobalError, msgGlobalError } =
    useGlobalErrorTime();

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const dataJson = await res.json();
        handleServerError(dataJson.error);
        return;
      }
      router.refresh();
      router.push('/login');
    } catch {
      handleServerError('O logout falhou. Tente novalmente.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Sair
      </button>
    </>
  );
}
