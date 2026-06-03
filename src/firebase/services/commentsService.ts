/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export function subscribeComments(
  onNext: (comments: any[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'comments'),
    (sn) => {
      const commentsList = sn.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onNext(commentsList);
    },
    onError
  );
}
