/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let app;
let db: any = null;
let auth: any = null;
let firebaseEnabled = false;

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    // Conectarse exclusivamente a la base de datos Firestore default del proyecto
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseEnabled = true;
    console.log('Firebase initialized successfully with default database and project:', firebaseConfig.projectId);
  }
} catch (error) {
  console.warn('Firebase failed to initialize. Running in Demo Mode (Local State Only).', error);
}

export { db, auth, firebaseEnabled };
