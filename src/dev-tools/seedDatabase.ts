/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';
import { 
  DUMMY_USERS, DUMMY_POSTS, DUMMY_PROMOS 
} from '../dummyData';

export async function seedDatabase(): Promise<void> {
  // Solo permitir ejecución en entorno de desarrollo local (Vite DEV mode)
  if (!import.meta.env.DEV) {
    console.warn("La siembra de base de datos está inhabilitada en producción.");
    throw new Error("Operación no permitida en producción.");
  }

  if (!firebaseEnabled || !db) {
    throw new Error("Firebase no inicializado.");
  }

  // Sembrar únicamente colecciones seguras en desarrollo
  // No escribir providers, payments, packages ni campaigns
  for (const u of DUMMY_USERS) {
    await setDoc(doc(db, 'users', u.id), u);
  }
  for (const pst of DUMMY_POSTS) {
    await setDoc(doc(db, 'posts', pst.id), pst);
  }
  for (const pro of DUMMY_PROMOS) {
    await setDoc(doc(db, 'promos', pro.id), pro);
  }
}
