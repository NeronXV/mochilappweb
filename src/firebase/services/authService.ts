/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export async function loginWithEmail(email: string, password: string): Promise<any> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
