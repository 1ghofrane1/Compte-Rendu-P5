import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import styles from '@/styles/AuthForms.module.css';
import { userAtom, authLoadingAtom } from '@/atoms/authAtoms';
import Link from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function Register() {
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  //const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useAtom(authLoadingAtom);
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  //schema de validation avec Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Email invalide").required("l'email est requis"),
    password: Yup.string().min(8, "Miininum 8 caracteres").matches(/[A-Z]/, "Une majuscule requise").matches(/[0-9]/, "Un chiffre requis").required("Mot de passe requis"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "les mots de passe ne correspondent pas")
  });
  const formik= useFormik({
    initialValues:{email:'', password:'', confirmPassword:''},
    validationSchema,
    onSubmit:async (values) =>{
      setLoading(true);
      try{
        const response= await fetch ('/api/auth/register', {
          method: 'POST',
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({email: values.email, password:values.password}),
        });
        if(response.ok){
          setUser({authenticated:true});
          router.push('/profile');
        } else{
          const errorData= await response.json();
          formik.setFieldError('email', errorData.message || "Inscription echouée");
        }
      }catch (error){
        console.error("Erreur mors de l'inscription:", error);
        formil.setFieldError('email', "Une erreur est survenue, veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    },
  });

  /*const handleSubmit = async (e) => {
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
  };*/

  return (
    <div className={styles.container}>
      <main className={styles.formContainer}>
        <h1 className={styles.formTitle}>Inscription</h1>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={formik.touched.email && formik.errors.email ? styles.errorInput:''}
            /*value={email}
              onChange={(e) => setEmail(e.target.value)}
              required*/
            />
            {formik.touched.email && formik.errors.email && (<p className={styles.errorMessage}>{formik.errors.email}</p>)}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              /*value={password}
              onChange={(e) => setPassword(e.target.value)}
              required*/
              {...formik.getFieldProps('password')}
              className={formik.touched.password && formik.errors.password ? styles.errorInput : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={styles.errorMessage}>{formik.errors.password}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps('confirmPassword')}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.errorInput : ''}
              /*value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required*/
            />
             {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className={styles.errorMessage}>{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {/*S'inscrire*/}
            {loading ? "Inscription..." : "S'inscrire"}
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
