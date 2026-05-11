"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export function useNotes(userId: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const db = useFirestore();

  // Stabilize the query with useMemo to prevent infinite re-renders or rule mismatches
  const notesQuery = useMemo(() => {
    if (!userId || !db) return null;
    
    // The query MUST include the userId filter to satisfy the security rules 'list' operation.
    // The order by 'updatedAt' may require a composite index in production.
    return query(
      collection(db, "notes"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
  }, [userId, db]);

  useEffect(() => {
    if (!notesQuery) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      notesQuery, 
      (snapshot) => {
        const fetchedNotes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        setNotes(fetchedNotes);
        setLoading(false);
      },
      async (error) => {
        // Emit rich contextual error for the development overlay
        const permissionError = new FirestorePermissionError({
          path: 'notes',
          operation: 'list',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [notesQuery]);

  const createNote = async (title: string, content: string, tags: string[] = []) => {
    if (!userId || !db) return;
    const data = {
      userId,
      title,
      content,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    addDoc(collection(db, "notes"), data)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: 'notes',
          operation: 'create',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!db) return;
    const noteRef = doc(db, "notes", id);
    const data = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    updateDoc(noteRef, data)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: noteRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const deleteNote = async (id: string) => {
    if (!db) return;
    const noteRef = doc(db, "notes", id);
    deleteDoc(noteRef)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: noteRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return { notes, loading, createNote, updateNote, deleteNote };
}