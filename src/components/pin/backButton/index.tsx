'use client';

import { useRouter } from 'next/navigation';

import styles from './styles.module.css';

export default function BackButton() {
  const redirect = useRouter();

  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => redirect.back()}
    >
      <svg
        height="20"
        width="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
        aria-label=""
        role="img"
      >
        <path d="M8.415 4.586a2 2 0 1 1 2.828 2.828L8.657 10H21a2 2 0 0 1 0 4H8.657l2.586 2.586a2 2 0 1 1-2.828 2.828L1 12l7.415-7.414z"></path>
      </svg>
    </button>
  );
}
