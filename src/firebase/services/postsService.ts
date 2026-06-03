/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Post } from '../../types';

export function subscribePosts(
  onNext: (posts: Post[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'posts'),
    (sn) => {
      const postsList = sn.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          authorId: data.authorEmail || '',
          authorName: data.authorName || data.authorEmail || 'Mochilero',
          imageUrl: data.imageUrl || '',
          location: data.location || 'Explorando',
          likesCount: Number(data.likes || 0),
          title: data.content || '',
          status: data.status || 'Aprobado',
          createdAt: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString(),
          tag: data.tag || 'Aventura',
          isFeatured: data.isFeatured || false,
        } as any;
      });
      onNext(postsList);
    },
    onError
  );
}

export async function approvePostById(postId: string): Promise<void> {
  await updateDoc(doc(db, 'posts', postId), { status: 'Aprobado' });
}

export async function deletePostById(postId: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', postId));
}
