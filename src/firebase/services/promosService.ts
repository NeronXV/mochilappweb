/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Promo } from '../../types';

export function subscribePromos(
  onNext: (promos: Promo[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'promos'),
    (sn) => {
      const promosList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          providerName: data.companyName || 'Socio',
          promoText: data.content || '',
          targetSubscription: 'all',
          discountRate: isNaN(Number(data.discount?.replace('%', ''))) ? 0 : Number(data.discount?.replace('%', '')),
          discountString: data.discount || '0%',
          clicksCount: 0,
          channel: 'Push simulado',
          status: 'Activo',
          createdAt: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
        } as any;
      });
      onNext(promosList);
    },
    onError
  );
}

export async function createPromo(
  companyName: string,
  content: string,
  discount: string,
  timestamp: number
): Promise<void> {
  await addDoc(collection(db, 'promos'), {
    companyName,
    content,
    discount,
    timestamp
  });
}
