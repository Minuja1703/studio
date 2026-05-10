"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useNotes, Note } from "@/hooks/use-notes";
import { NoteCard } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Plus, LogOut, LayoutGrid, NotebookPen, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

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
        <div className="max-w-7xl mx-auto px-8 py-16 md:py-24 space-y-16">
          {/* Gallery Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-neutral-400 font-medium text-xs uppercase tracking-[0.2em]">
                <NotebookPen className="w-4 h-4" />
                Personal Archive
              </div>
              <h1 className="text-5xl font-semibold tracking-tight text-neutral-900">
                MonoNote
              </h1>
              <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                <User className="w-3.5 h-3.5" />
                {user?.email}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLogout} 
                className="border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-full px-8 h-12"
              >
                Sign out
              </Button>
              <Button 
                size="lg" 
                onClick={handleCreateNote} 
                className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-10 h-12 shadow-2xl shadow-neutral-300"
              >
                <Plus className="w-5 h-5 mr-2" /> New Entry
              </Button>
            </div>
          </header>

          {/* Search & Curation */}
          <div className="space-y-10">
            <div className="relative group max-w-2xl">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-neutral-900 transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the archive..."
                className="pl-8 h-12 bg-transparent border-none border-b border-neutral-200 rounded-none text-xl shadow-none focus-visible:ring-0 focus:border-neutral-900 transition-all placeholder:text-neutral-200"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest mr-4">Tags:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    activeTags.includes(tag) 
                      ? "bg-neutral-900 border-neutral-900 text-white" 
                      : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeTags.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTags([])} 
                  className="text-neutral-400 hover:text-neutral-900 text-xs font-bold uppercase"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center py-40">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full py-48 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200">
                    <LayoutGrid className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium text-neutral-400">Empty Space</h3>
                    <p className="text-neutral-300 font-medium">Capture your first thought to begin the collection.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Immersive Note Editor */}
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-screen-2xl w-[98vw] h-[95vh] bg-white p-0 rounded-[2rem] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.15)] border-none">
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
