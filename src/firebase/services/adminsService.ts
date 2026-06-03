/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export async function getAdminDoc(uid: string): Promise<any> {
  const adminDocRef = doc(db, 'admins', uid);
  const adminDoc = await getDoc(adminDocRef);
  if (adminDoc.exists()) {
    return adminDoc.data();
  }
  return null;
}

export async function createAdminDoc(uid: string, name: string, email: string): Promise<void> {
  await setDoc(doc(db, 'admins', uid), {
    active: true,
    name,
    email
  });
}
