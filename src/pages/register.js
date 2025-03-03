import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from '@/styles/AuthForms.module.css';
import { userAtom, authLoadingAtom } from '@/atoms/authAtoms';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setUser({ authenticated: true }); // Met à jour l'atome Jotai
        router.push('/profile');
      } else {
        const errorData = await response.json();
        console.error("Inscription échouée :", errorData);
        alert(`Inscription échouée : ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.formContainer}>
        <h1 className={styles.formTitle}>Inscription</h1>
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
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            S'inscrire
          </button>
        </form>
        <p className={styles.formFooter}>
          Déjà un compte ?{' '}
          <Link href="/login" className={styles.link}>
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}
