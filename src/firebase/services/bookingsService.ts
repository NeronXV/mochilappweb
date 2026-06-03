/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Payment } from '../../types';

export function subscribeBookings(
  onNext: (payments: Payment[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'bookings'),
    (sn) => {
      const bookingsList = sn.docs.map((doc) => {
        const data = doc.data();
        const slotsVal = Number(data.slots || 1);
        const totalPriceVal = Number(data.totalPrice || 0);
        return {
          id: doc.id,
          serviceId: data.serviceId || '',
          travelerEmail: data.travelerEmail || '',
          slots: slotsVal,
          totalPrice: totalPriceVal,
          status: data.status || 'PENDING',
          date: data.date || '',
          // Campos para retrocompatibilidad visual del listado:
          amount: totalPriceVal,
          createdAt: data.date || new Date().toISOString()
        } as any;
      });
      onNext(bookingsList);
    },
    onError
  );
}

export async function updateBookingStatus(bookingId: string, status: 'PENDING' | 'PAID' | 'CANCELLED'): Promise<void> {
  await updateDoc(doc(db, 'bookings', bookingId), { status });
}
