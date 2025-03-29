import bcrypt from 'bcrypt';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée.' });
      } 
      {
    await dbConnect(); // Se connecter à MongoDB

const { email, password } = req.body;

if (!email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Veuillez fournir un email valide et un mot de passe d’au moins 8 caractères.' });
  }

  try {
    const existingUser = await User.findOne({ email});
    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà enregistré. Veuillez vous connecter.' }); // 409 Conflict
    }

const hashedPassword = await bcrypt.hash(password,10);
const newUser = new User({ email, hashedPassword });
await newUser.save();

// Generate JWT token
const token = generateToken(newUser);
res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);
      // Définir cookie HTTP-only
      

console.log('Utilisateur enregistré :', { id: newUser.id, email: newUser.email }); // Pour débogage
return res.status(201).json({ message: 'Inscription réussie.' }); // 201 Created
 } catch (error) {
    console.error("Erreur lors de l'inscription :", error);

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Données invalides. Veuillez vérifier votre saisie.' });
    }
    if (error.code === 11000) {  // Erreur de duplication MongoDB
        return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
    }

    return res.status(500).json({ message: 'Erreur serveur. Veuillez réessayer plus tard.' });
}
      }}