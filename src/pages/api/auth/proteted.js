import { verifyToken } from '../../../utils/auth-utils';
import cookie from 'cookie';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies?.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé. Token manquant.' }); // 401 Unauthorized
    }
    try {
      const decodedToken = verifyToken(token);
      if (!decodedToken) {
        return res.status(401).json({ message: 'Accès refusé. Token invalide ou expiré.' }); // 401 Unauthorized
      }

      // Si le token est valide, retour des données protégées
      return res.status(200).json({ message: 'Accès autorisé.', user: decodedToken });
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la validation du token.' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée.' }); // 405 Method Not Allowed
  }
}