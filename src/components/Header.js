import React from 'react';
import Link from 'next/link';
import styles from '@/components/Header.module.css';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/authAtoms';
import Cookies from 'js-cookie';

const Header = () => {
  const [user, setUser] = useAtom(userAtom);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null); // Mettre à jour l’atome Jotai
      Cookies.remove('authToken');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout. Please try again.');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>Auth Demo</Link>
        <ul className={styles.navList}>
          <li>
            <Link href="/" className={styles.navLink}>Accueil</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/profile" className={styles.navLink}>Profil</Link>
              </li>
              <li>
                <button onClick={logout} className={styles.logoutButton}>Déconnexion</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className={styles.navLink}>Connexion</Link>
              </li>
              <li>
                <Link href="/register" className={styles.navLink}>Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
