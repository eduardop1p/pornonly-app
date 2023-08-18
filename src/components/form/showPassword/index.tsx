'use client';

import styles from './styles.module.css';

interface Props {
  passwordType: string;
  onClickCustom(): void;
}

export default function ShowPassword({
  passwordType = 'password',
  onClickCustom,
}: Props) {
  return (
    <div className={styles.container} onClick={onClickCustom}>
      {passwordType === 'password' ? (
        <svg
          height="12"
          width="12"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path d="M10 12a2 2 0 1 0 3.999.001A2 2 0 0 0 10 12Zm2 5a5 5 0 1 1 .001-10.001A5 5 0 0 1 12 17m0-13.5C6.455 3.5 1.751 7.051 0 12c1.751 4.949 6.455 8.5 12 8.5s10.249-3.551 12-8.5c-1.751-4.949-6.455-8.5-12-8.5"></path>
        </svg>
      ) : (
        <svg
          height="12"
          width="12"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path d="M11.969 17a4.983 4.983 0 0 1-2.047-.447l6.6-6.6c.281.626.447 1.316.447 2.047a5 5 0 0 1-5 5m-5-5a5 5 0 0 1 5-5c.748 0 1.45.175 2.087.47l-6.617 6.617A4.944 4.944 0 0 1 6.969 12m13.104-5.598 2.415-2.415a1.75 1.75 0 1 0-2.475-2.474l-3.014 3.013A12.646 12.646 0 0 0 12 3.5C6.455 3.5 1.751 7.051 0 12a12.798 12.798 0 0 0 3.927 5.598l-2.414 2.415A1.748 1.748 0 0 0 2.75 23c.448 0 .896-.171 1.238-.513l3.013-3.013A12.65 12.65 0 0 0 12 20.5c5.545 0 10.249-3.551 12-8.5a12.782 12.782 0 0 0-3.927-5.598"></path>
        </svg>
      )}
    </div>
  );
}
