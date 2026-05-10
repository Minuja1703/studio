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

  const notesQuery = useMemo(() => {
    if (!userId || !db) return null;
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

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(fetchedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [notesQuery]);

  const createNote = async (title: string, content: string, tags: string[] = []) => {
    if (!userId || !db) return;
    addDoc(collection(db, "notes"), {
      userId,
      title,
      content,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!db) return;
    const noteRef = doc(db, "notes", id);
    updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNote = async (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, "notes", id));
  };

  return { notes, loading, createNote, updateNote, deleteNote };
}
