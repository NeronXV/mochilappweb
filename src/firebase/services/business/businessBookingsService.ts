/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

export function subscribeMyBookings(
  ownerEmail: string,
  onNext: (bookings: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, 'bookings'), where('ownerEmail', '==', ownerEmail));

  return onSnapshot(
    q,
    (sn) => {
      const bookingsList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          travelerEmail: data.travelerEmail || 'Sin email de viajero',
          serviceId: data.serviceId || '',
          date: data.date || '',
          slots: Number(data.slots || 1),
          totalPrice: Number(data.totalPrice || 0),
          status: data.status || 'PENDING',
          ownerEmail: data.ownerEmail || ownerEmail,
        };
      });
      onNext(bookingsList);
    },
    onError
  );
}
