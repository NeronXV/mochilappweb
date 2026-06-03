/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export function subscribeMyPromos(
  ownerEmail: string,
  companyName: string,
  onNext: (promos: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  // Consulta principal usando ownerEmail
  const q = query(collection(db, 'promos'), where('ownerEmail', '==', ownerEmail));

  return onSnapshot(
    q,
    (sn) => {
      const promosList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          companyName: data.companyName || companyName || 'Sin nombre',
          content: data.content || data.promoText || 'Sin contenido',
          discount: data.discount || (data.discountRate ? `${data.discountRate}%` : '0%'),
          timestamp: Number(data.timestamp || (data.createdAt ? new Date(data.createdAt).getTime() : Date.now())),
          ownerEmail: data.ownerEmail || ownerEmail,
          isActive: data.isActive !== false,
          source: data.source || 'business_dashboard',
        };
      });
      // Ordenar por fecha descendente
      promosList.sort((a, b) => b.timestamp - a.timestamp);
      onNext(promosList);
    },
    onError
  );
}

export async function createBusinessPromo(data: {
  companyName: string;
  content: string;
  discount: string;
  timestamp: number;
  ownerEmail: string;
  createdByUid?: string;
  isActive: boolean;
  source: 'business_dashboard';
}): Promise<void> {
  // Validaciones de seguridad de campos requeridos
  if (!data.companyName || !data.content || !data.discount || !data.ownerEmail) {
    throw new Error('Todos los campos requeridos de la promoción deben ser completados.');
  }

  await addDoc(collection(db, 'promos'), data);
}
