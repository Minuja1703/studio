"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { useNotes, Note } from "@/hooks/use-notes";
import { NoteCard } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Plus, LogOut, LayoutGrid, X, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = activeTags.length === 0 || activeTags.every(tag => note.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateNote = async () => {
    await createNote("Untitled Note", "");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 flex items-center gap-3">
                <NotebookPen className="w-8 h-8" />
                MonoNote
              </h1>
              <p className="text-neutral-500 text-sm">{user?.email}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              >
                Sign out
              </Button>
              <Button 
                size="lg" 
                onClick={handleCreateNote} 
                className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-8 shadow-lg shadow-neutral-200"
              >
                <Plus className="w-5 h-5 mr-2" /> New Note
              </Button>
            </div>
          </header>

          {/* Search & Filters */}
          <div className="space-y-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your notes..."
                className="pl-12 h-14 bg-white border-neutral-200 rounded-2xl text-lg shadow-sm focus:ring-neutral-200"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={activeTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer px-5 py-2 text-sm font-medium rounded-full transition-all ${
                    activeTags.includes(tag) 
                      ? "bg-neutral-900 text-white" 
                      : "bg-white text-neutral-600 border-neutral-100 hover:bg-neutral-50 shadow-sm"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {activeTags.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTags([])} 
                  className="text-neutral-400 hover:text-neutral-900"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-3xl border border-neutral-100 border-dashed">
                  <LayoutGrid className="w-12 h-12 text-neutral-200" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-neutral-400">No notes found</h3>
                    <p className="text-sm text-neutral-300">Start writing to fill this space.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Note Editor */}
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-white p-0 rounded-3xl overflow-hidden shadow-2xl border-none">
              {selectedNote && (
                <NoteEditor
                  note={selectedNote}
                  onUpdate={(updates) => updateNote(selectedNote.id, updates)}
                  onDelete={() => {
                    deleteNote(selectedNote.id);
                    setSelectedNote(null);
                  }}
                  onClose={() => setSelectedNote(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  );
}