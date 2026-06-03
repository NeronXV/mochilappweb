/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Provider } from '../../types';

export function subscribeServices(
  onNext: (providers: Provider[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'services'),
    (sn) => {
      const serviceList = sn.docs.map((doc) => {
        const data = doc.data();
        const ratingVal = Number(data.rating || 0);
        const reviewCountVal = Number(data.reviewCount || 0);
        const priceVal = Number(data.price || 0);
        return {
          id: doc.id,
          merchantName: data.name || 'Servicio sin nombre',
          responsibleName: data.ownerEmail || 'Sin email de dueño',
          category: (data.type || 'tour').toLowerCase(),
          location: data.location || 'Sin ubicación',
          status: data.isVerified === true ? 'Aprobado' : 'Pendiente',
          rating: ratingVal,
          salesCalculated: 0, // Se calcula dinámicamente con useMemo
          commissionAccumulated: 0, // Se calcula dinámicamente con useMemo
          verificationDocName: 'N/A',
          isRecommended: data.isRecommended || data.isFeatured || false,
          isVisible: data.isVisible !== false, // soft-delete (default true)
          price: priceVal,
          reviewCount: reviewCountVal
        } as any;
      });
      onNext(serviceList);
    },
    onError
  );
}

export async function updateServiceVerification(id: string, isVerified: boolean): Promise<void> {
  await updateDoc(doc(db, 'services', id), { isVerified });
}

export async function updateServiceRecommendation(id: string, isRecommended: boolean): Promise<void> {
  await updateDoc(doc(db, 'services', id), { isRecommended });
}

export async function updateServiceVisibility(id: string, isVisible: boolean): Promise<void> {
  await updateDoc(doc(db, 'services', id), { isVisible });
}
