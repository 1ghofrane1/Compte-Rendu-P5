import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from '@/styles/AuthForms.module.css';
import { userAtom, authLoadingAtom } from '@/atoms/authAtoms';
import Link from 'next/link';
import * as Yup from 'yup';
import {useFormik} from 'formik';

export default function Login() {
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  // ✅ Validation avec Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Email invalide').required('Email requis'),
    password: Yup.string().min(6, 'Au moins 6 caractères').required('Mot de passe requis'),
  });

  // ✅ Formik pour gérer le formulaire
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (response.ok) {
          setUser({ authenticated: true });
          router.push('/profile');
        } else {
          setErrors({ email: data.message || 'Identifiants incorrects' });
        }
      } catch (error) {
        console.error('Erreur lors du login :', error);
        setErrors({ email: 'Une erreur est survenue. Réessayez.' });
      } finally {
        setLoading(false);
      }
    },
  });

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setUser({ authenticated: true });
        router.push('/profile');
      } else {
        const errorData = await response.json();
        console.error('Login échoué :', errorData);
        alert(`Login échoué : ${errorData.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Erreur lors du login :', error);
      alert('Erreur lors du login. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };*/

  return (
    <div className={styles.container}>
      <main className={styles.formContainer}>
        <h1 className={styles.formTitle}>Connexion</h1>
        <form onSubmit={formik.handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              
              {...formik.getFieldProps('email')}
              className={formik.touched.email && formik.errors.email ? styles.inputError : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <p className={styles.errorText}>{formik.errors.email}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              className={formik.touched.password && formik.errors.password ? styles.inputError : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={styles.errorText}>{formik.errors.password}</p>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            Se Connecter
          </button>
        </form>
        <p className={styles.formFooter}>
          Pas de compte ? <Link href="/register" className={styles.link}>S’inscrire</Link>
        </p>
      </main>
    </div>
  );
}
