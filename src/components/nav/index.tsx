'use client';

import { useContext } from 'react';

import styles from './styles.module.css';

import { Context } from '@/utils/context/appContext';
import * as actions from '@/utils/context/actions';

interface Props {
  isAuth: boolean;
}

export default function Nav({ isAuth }: Props) {
  const { dispatch } = useContext(Context) as any;

  const handleClickLogin = () => {
    dispatch(
      actions.loginActiveSuccess({ loginActive: true, registerActive: false })
    );
  };
  const handleClickRegister = () => {
    dispatch(
      actions.registerActiveSuccess({
        registerActive: true,
        loginActive: false,
      })
    );
  };

  return isAuth ? (
    ''
  ) : (
    <nav className={styles.container}>
      <button type="button" className={styles.login} onClick={handleClickLogin}>
        Login
      </button>
      <button
        type="button"
        className={styles.register}
        onClick={handleClickRegister}
      >
        Registrar-se
      </button>
    </nav>
  );
}
