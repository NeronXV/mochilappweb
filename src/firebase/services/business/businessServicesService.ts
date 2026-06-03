/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export function subscribeMyServices(
  ownerEmail: string,
  onNext: (services: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, 'services'), where('ownerEmail', '==', ownerEmail));
  
  return onSnapshot(
    q,
    (sn) => {
      const servicesList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Servicio sin nombre',
          description: data.description || '',
          ownerEmail: data.ownerEmail || ownerEmail,
          type: data.type || 'tour',
          location: data.location || 'Sin ubicación',
          price: Number(data.price || 0),
          rating: Number(data.rating || 0),
          reviewCount: Number(data.reviewCount || 0),
          isVisible: data.isVisible !== false,
          isVerified: data.isVerified === true,
          isRecommended: data.isRecommended || data.isFeatured || false,
        };
      });
      onNext(servicesList);
    },
    onError
  );
}

export async function updateMyService(
  serviceId: string,
  ownerEmail: string,
  data: {
    price?: number;
    description?: string;
    isVisible?: boolean;
    name?: string;
    location?: string;
  }
): Promise<void> {
  const serviceRef = doc(db, 'services', serviceId);
  const serviceSnap = await getDoc(serviceRef);

  if (!serviceSnap.exists()) {
    throw new Error('El servicio no existe.');
  }

  const serviceData = serviceSnap.data();
  if (serviceData.ownerEmail !== ownerEmail) {
    throw new Error('No tienes permisos para modificar este servicio.');
  }

  // Filtrar solo los campos explícitamente permitidos para evitar sobreescritura maliciosa
  const updateData: any = {};
  if (data.price !== undefined) {
    if (isNaN(Number(data.price)) || Number(data.price) < 0) {
      throw new Error('El precio debe ser un número válido mayor o igual a 0.');
    }
    updateData.price = Number(data.price);
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.isVisible !== undefined) {
    updateData.isVisible = !!data.isVisible;
  }
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.location !== undefined) {
    updateData.location = data.location;
  }

  await updateDoc(serviceRef, updateData);
}
