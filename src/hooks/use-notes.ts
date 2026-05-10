
"use client";

import { useState, useEffect } from "react";
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
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notes"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(fetchedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const createNote = async (title: string, content: string, tags: string[] = []) => {
    if (!userId) return;
    await addDoc(collection(db, "notes"), {
      userId,
      title,
      content,
      tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const noteRef = doc(db, "notes", id);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  return { notes, loading, createNote, updateNote, deleteNote };
}
