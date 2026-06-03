/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

export function subscribeMyReviews(
  serviceIds: string[],
  onNext: (reviews: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (serviceIds.length === 0) {
    onNext([]);
    return () => {};
  }

  // Si hay 10 o menos, creamos un único listener
  if (serviceIds.length <= 10) {
    const q = query(collection(db, 'reviews'), where('serviceId', 'in', serviceIds));
    return onSnapshot(
      q,
      (sn) => {
        const reviewsList = sn.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            serviceId: data.serviceId || '',
            rating: Number(data.rating || 0),
            authorName: data.authorName || 'Viajero Anónimo',
            comment: data.comment || '',
            timestamp: Number(data.timestamp || Date.now())
          };
        });
        // Ordenar por fecha descendente
        reviewsList.sort((a, b) => b.timestamp - a.timestamp);
        onNext(reviewsList);
      },
      onError
    );
  }

  // Si hay más de 10, dividimos en trozos de 10 para evitar límites de la cláusula "in" de Firestore
  const chunks: string[][] = [];
  for (let i = 0; i < serviceIds.length; i += 10) {
    chunks.push(serviceIds.slice(i, i + 10));
  }

  const unsubscribes: (() => void)[] = [];
  const resultsMap = new Map<number, any[]>();

  chunks.forEach((chunk, index) => {
    const q = query(collection(db, 'reviews'), where('serviceId', 'in', chunk));
    const unsub = onSnapshot(
      q,
      (sn) => {
        const chunkList = sn.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            serviceId: data.serviceId || '',
            rating: Number(data.rating || 0),
            authorName: data.authorName || 'Viajero Anónimo',
            comment: data.comment || '',
            timestamp: Number(data.timestamp || Date.now())
          };
        });

        resultsMap.set(index, chunkList);

        // Consolidar todos los chunks y ordenar
        const allReviews: any[] = [];
        resultsMap.forEach((list) => {
          allReviews.push(...list);
        });
        allReviews.sort((a, b) => b.timestamp - a.timestamp);
        onNext(allReviews);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
    unsubscribes.push(unsub);
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}
