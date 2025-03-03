import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from '@/styles/Profile.module.css';
import { userAtom } from '@/atoms/authAtoms';

const ProfilePage = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <p>Redirection vers la page de connexion...</p>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
      <h1 className={styles.title}>Page de Profil</h1>
      <p className={styles.description}>Bienvenue, utilisateur connecté !</p>
        {/* Afficher les informations de profil ici */}
      </main>
    </div>
  );
};

export default ProfilePage;
