import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true,
trim: true,
lowercase: true,
 },
hashedPassword: {
type: String,
required: true,
 },
 // Vous pouvez ajouter d’autres champs comme le nom, prénom,

 }, {
timestamps: true, // Ajoute createdAt et updatedAt
 });

// Empêcher la re-définition du mod le en cas de hot-reload 
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);