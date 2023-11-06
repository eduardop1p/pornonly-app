'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './styles.module.css';

import Masonry from '../masonry';
import { MidiaResultsType } from '@/app/page';

export default function UserSaves({
  savesResults,
  userId,
  username,
}: {
  savesResults: MidiaResultsType[];
  userId: string;
  username: string;
}) {
  const pathName = usePathname();

  const handlePathName = (pathName: string) => {
    return `/${pathName}/${username}`;
  };

  return (
    <div className={styles['container']}>
      <div className={styles['btns-publishs-or-saves']}>
        <Link
          href={`/created/${username}`}
          className={styles['btn-manage']}
          type="button"
          data-active-btn={
            // eslint-disable-next-line
            pathName === handlePathName('created') || pathName === `/${username}` ? true : false
          }
        >
          Criados
        </Link>
        <Link
          href={`/saves/${username}`}
          className={styles['btn-manage']}
          type="button"
          data-active-btn={pathName === handlePathName('saves') ? true : false}
        >
          Salvos
        </Link>
      </div>

      <div className={styles['publishs-or-saves']}>
        {savesResults.length ? (
          <Masonry
            results={savesResults}
            visibleUserInfo={true}
            userId={userId}
            masonryPage="user-saves"
            username={username}
          />
        ) : (
          <div className={styles['none-results']}>Nenhuma publicação salva</div>
        )}
      </div>
    </div>
  );
}
