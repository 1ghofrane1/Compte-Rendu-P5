import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée.' });
    }

    try {
        // Supprimer le cookie en mettant maxAge à 0
        res.setHeader('Set-Cookie', cookie.serialize('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 0,
        }));

        return res.status(200).json({ message: 'Déconnexion réussie.' });

    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la déconnexion.' });
    }
}
