import styles from './page.module.css';

import Header from '@/components/header';

export default function New() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2>New</h2>
      </main>
    </>
  );
}
