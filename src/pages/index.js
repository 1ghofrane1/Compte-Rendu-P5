import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useAtom } from 'jotai'; // Import useAtom
import { userAtom } from '@/atoms/authAtoms'; // Import userAtom

export default function Home() {
  const [user] = useAtom(userAtom); // Use userAtom

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Authentication Demo!
        </h1>

        <p className={styles.description}>
          {user ? (
            <>
              You are logged in. Go to your <Link href="/profile" className={styles.link}>profile</Link>.
            </>
          ) : (
            <>
              Please <Link href="/login" className={styles.link}>login</Link> or <Link href="/register" className={styles.link}>register</Link> to continue.
            </>
          )}
        </p>
      </main>
    </div>
  );
}