import styles from './page.module.css';

import Header from '@/components/header';

export default function Publish() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2>Publish</h2>
      </main>
    </>
  );
}
