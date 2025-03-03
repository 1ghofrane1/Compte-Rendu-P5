import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { generateToken } from '../../../utils/auth-utils';

const JWTSECRET = process.env.JWTSECRETKEY; // Corrected this

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect(); // Se connecter à MongoDB

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides.' }); // 401 Unauthorized
      }

      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }

      // Générer JWT
      const token = generateToken(user);

      // Définir cookie HTTP-only
      res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // En production, HTTPS uniquement
        sameSite: 'strict',
        path: '/',
        maxAge: 3600, // 1 heure en secondes
      }));

      return res.status(200).json({ message: 'Connexion réussie.' }); // Corrected status code to 200
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée.' }); // Handle unsupported methods
  }
}