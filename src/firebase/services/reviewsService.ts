/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export function subscribeReviews(
  onNext: (reviews: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'reviews'),
    (sn) => {
      const reviewsList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          serviceId: data.serviceId || '',
          rating: Number(data.rating || 5),
          authorName: data.authorName || 'Anónimo',
          comment: data.comment || '',
          timestamp: Number(data.timestamp || Date.now()),
        };
      });
      onNext(reviewsList);
    },
    onError
  );
}
