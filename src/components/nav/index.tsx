import Link from 'next/link';
import styles from './styles.module.css';

interface Props {
  isAuth: boolean;
}

export default function Nav({ isAuth }: Props) {
  return isAuth ? (
    ''
  ) : (
    <nav className={styles.container}>
      <Link className={styles.login} href="/login">
        Login
      </Link>
      <Link className={styles['create-account']} href="/create-account">
        Criar conta
      </Link>
    </nav>
  );
}
