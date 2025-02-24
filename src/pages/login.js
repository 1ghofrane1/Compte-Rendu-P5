import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from '@/styles/AuthForms.module.css';
import { userAtom, authLoadingAtom } from '@/atoms/authAtoms';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setUser({ authenticated: true }); // Mettre à jour l'atome Jotai
        router.push('/profile');
      } else {
        const errorData = await response.json();
        console.error("Login échoué :", errorData);
        alert(`Login échoué : ${errorData.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error("Erreur lors du login :", error);
      alert('Erreur lors du login. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.formContainer}>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            Se Connecter
          </button>
        </form>
        <p className={styles.formFooter}>
          Pas de compte ?{' '}
          <Link href="/register" className={styles.link}>
            S’inscrire
          </Link>
        </p>
      </main>
    </div>
  );
}
