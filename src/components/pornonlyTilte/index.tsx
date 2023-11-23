import styles from './styles.module.css';

export default function PornonlyTitle({
  marginBottom0,
}: {
  marginBottom0: boolean;
}) {
  return (
    <h2
      style={{
        margin: marginBottom0 ? '5px 0 0 8px' : '5px 0 10px 8px',
      }}
      className={styles.title}
    >
      Pornonly
    </h2>
  );
}
