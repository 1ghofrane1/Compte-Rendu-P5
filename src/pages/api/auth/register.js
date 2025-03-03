import bcrypt from 'bcrypt';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
if (req.method === 'POST') {
    await dbConnect(); // Se connecter à MongoDB

const { email, password } = req.body;
// Validation basique (à améliorer)
if (!email || !password || password.length < 6) {
return res.status(400).json({ message: 'Email et mot de passe valides requis (mot de passe >= 6 caract res).' });
}

try {
const existingUser = await User.findOne({ email });
if (existingUser) {
return res.status(409).json({ message: 'Email déjà enregistré.' }); // 409 Conflict
 }

const hashedPassword = await bcrypt.hash(password,10);
const newUser = new User({ email, hashedPassword });
await newUser.save();

console.log('Utilisateur enregistré :', { id:newUser.id, email: newUser.email }); // Pour débogage
return res.status(201).json({ message: 'Utilisateur enregistré avec succ s.' }); // 201 Created
 } catch (error) {
 console.error('Erreur lors de l\’inscription :',error);

return res.status(500).json({ message: 'Erreur serveur lors de l\’inscription.' }); // 500 Internal Server Error
 }
 } else {
 res.status(405).json({ message: 'Méthode non autorisée.' }); // 405 Method Not Allowed
 }
 }