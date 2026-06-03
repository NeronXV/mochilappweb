/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { MochilaUser } from '../../types';

export function subscribeUsers(
  onNext: (users: MochilaUser[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'users'),
    (sn) => {
      const uList = sn.docs.map((doc) => {
        const data = doc.data();
        // Mapear los roles reales de la app móvil a la visualización del dashboard
        let visualRole = 'Viajero';
        if (data.role === 'COMPANY') visualRole = 'Proveedor';
        else if (data.role === 'TRAVELER') visualRole = 'Viajero';
        else visualRole = data.role || 'Viajero';

        return {
          id: doc.id,
          name: data.name || data.email || 'Sin Nombre',
          email: data.email || '',
          role: visualRole,
          status: data.status || 'active',
          createdAt: data.createdAt || new Date().toISOString(),
          mochiPuntos: Number(data.mochiPuntos || 0),
          passportLevel: data.passportLevel || 'Explorador',
          companyType: data.companyType || 'NONE'
        } as any;
      });
      onNext(uList);
    },
    onError
  );
}
