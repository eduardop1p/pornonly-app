// esta é a home para o usuario não logado

import styles from './styles.module.css';

import Header from '@/components/header';
import Login from '@/components/login';
import Register from '@/components/register';

export default function HomeUserNoAuth() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Login />
        <Register />
      </main>
    </>
  );
}
