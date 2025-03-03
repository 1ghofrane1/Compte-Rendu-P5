import { verifyToken } from '../../../utils/auth-utils';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: 'Non autorisé. Token manquant.' }); // 401 Unauthorized
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Non autorisé. Token invalide.' }); // 401 Unauthorized
    }

    // Si le token est valide, on peut accéder aux données protégées
    return res.status(200).json({ message: 'Accès autorisé à la route protégée.', user: decodedToken });
  } else {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }
}
