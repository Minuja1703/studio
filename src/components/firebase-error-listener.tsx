'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * Listens for specialized FirestorePermissionErrors and throws them
 * so they can be caught by the Next.js development overlay.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    errorEmitter.on('permission-error', (error: any) => {
      // Throwing the error directly to trigger the dev overlay
      throw error;
    });
  }, []);

  return null;
}
