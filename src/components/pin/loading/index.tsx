import styles from './styles.module.css';

export default function Loading({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div className={styles.container} data-full-screen={fullScreen}>
      <div className={styles['icon-container']} data-full-screen={fullScreen}>
        <svg
          height="40"
          width="40"
          viewBox="0 0 24 24"
          aria-label="A carregar"
          fill={fullScreen ? '#5f5f5f' : '#111'}
          role="img"
        >
          <path d="M15 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-6-6c-.83 0-1.5-.67-1.5-1.5S8.17 7.5 9 7.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path>
        </svg>
      </div>
    </div>
  );
}
