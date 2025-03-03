import { atom } from 'jotai';

export const userAtom = atom(null); // Atom pour stocker l’état d’authentification de l’utilisateur (initialement null)

export const authLoadingAtom = atom(false); // Atom pour l’état de chargement de l’authentification (initialement false