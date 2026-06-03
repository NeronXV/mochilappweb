/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

export async function loginWithEmail(email: string, password: string): Promise<any> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function verifyCompanyRole(uid: string): Promise<boolean> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    return data?.role === 'COMPANY';
  }
  return false;
}

export async function getCompanyProfile(uid: string): Promise<any> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    if (data?.role === 'COMPANY') {
      return {
        uid,
        name: data.name || data.email || 'Socio Prestador',
        email: data.email || '',
        companyType: data.companyType || 'NONE'
      };
    }
  }
  return null;
}
