import { notFound } from 'next/navigation';

import styles from './styles.module.css';

interface Props {
  params: { pinid: string };
}

export default function Page({ params }: Props) {
  const { pinid } = params;

  // if (!response.ok) {
  //   notFound();
  // }

  return (
    <main className={styles.main}>
      <h1>pin de id: {pinid}</h1>
    </main>
  );
}
