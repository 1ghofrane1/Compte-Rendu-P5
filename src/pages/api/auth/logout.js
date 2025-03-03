import cookie from 'cookie';

export default async function handler (req, res) {
    if (req.method === 'POST') {
    // Effacer le cookie en définissant un cookie expiré
    res . setHeader ( 'Set -Cookie', cookie. serialize ('authToken', '', {
    httpOnly: true,
    secure: process. env . NODEENV !== 'development' ,
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Définir maxAge a 0 pour expirer immédiatement
    }));

    return res . status (200) . json ({ message: 'Deconnexion reussie.' });
    } else {
    res . status (405) . json ({ message: 'Methode non autorisee.' });}}