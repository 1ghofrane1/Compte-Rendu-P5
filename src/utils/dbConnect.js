// Importation du module mongoose pour gérer la connexion à la base de données
import mongoose from 'mongoose';

// Récupération de l'URI de la base de données depuis les variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI;

// Vérification si l'URI est bien définie, sinon une erreur est levée
if (!MONGODB_URI) {
    throw new Error("Veuillez définir la variable d'environnement MONGODB_URI dans le fichier .env.local");
}

// Mise en place d'un cache global pour éviter des connexions répétées
let cached = global.mongoose || { conn: null, promise: null };

// Fonction asynchrone pour établir la connexion à la base de données
async function dbConnect() {
    // Si une connexion existe déjà, on la retourne directement
    if (cached.conn) return cached.conn;

    // Si aucune connexion n'a été initiée, on en crée une nouvelle
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,  // Utilisation du nouvel analyseur d'URL de MongoDB
            useUnifiedTopology: true,  // Activation du moteur de gestion des connexions MongoDB
        }).then((mongoose) => mongoose);
    }

    // On attend que la connexion soit établie avant de la stocker dans le cache
    cached.conn = await cached.promise;
    return cached.conn;
}

// Exportation de la fonction pour pouvoir l'utiliser ailleurs dans le projet
export default dbConnect;
