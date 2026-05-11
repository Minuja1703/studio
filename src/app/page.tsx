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
import { Search, Plus, NotebookPen, User, LayoutGrid, LogOut, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const { user, isConfigured } = useUser();
  const auth = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const { toast } = useToast();

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
        <Alert variant="destructive" className="max-w-md bg-white border-red-100 shadow-2xl rounded-[2.5rem] p-10">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <AlertTitle className="text-xl font-semibold mb-2 text-neutral-900">Project Configuration</AlertTitle>
          <AlertDescription className="text-neutral-500 font-medium leading-relaxed">
            Please add your Firebase project credentials to the project environment settings to activate your personal archive.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
    try {
      await createNote("Untitled Entry", "");
    } catch (err: any) {
      toast({ title: "Error", description: "Could not initialize entry.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err: any) {
      toast({ title: "Error", description: "Archive secure failed.", variant: "destructive" });
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 space-y-24">
          {/* Gallery Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-neutral-100 pb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-neutral-300 font-bold text-[10px] uppercase tracking-[0.4em]">
                <NotebookPen className="w-4 h-4" />
                Curated Collection
              </div>
              <h1 className="text-6xl font-semibold tracking-tight text-neutral-900">
                MonoNote
              </h1>
              <div className="flex items-center gap-3 text-neutral-400 text-sm font-semibold tracking-wide">
                <User className="w-4 h-4" />
                {user?.email}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={handleLogout} 
                className="text-neutral-400 hover:text-neutral-900 rounded-full px-6 h-14 font-bold text-xs uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
              <Button 
                size="lg" 
                onClick={handleCreateNote} 
                className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-12 h-14 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)] font-semibold transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 mr-3" /> New Entry
              </Button>
            </div>
          </header>

          {/* Search & Curation */}
          <div className="space-y-12">
            <div className="relative group max-w-3xl">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-200 group-focus-within:text-neutral-900 transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the archive..."
                className="pl-10 h-16 bg-transparent border-none border-b border-neutral-100 rounded-none text-2xl font-medium shadow-none focus-visible:ring-0 focus:border-neutral-900 transition-all placeholder:text-neutral-100"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
              <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-[0.3em] mr-6">Filter:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl border transition-all uppercase tracking-widest ${
                    activeTags.includes(tag) 
                      ? "bg-neutral-900 border-neutral-900 text-white shadow-xl" 
                      : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200 hover:text-neutral-600"
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
                  className="text-neutral-300 hover:text-neutral-900 text-[10px] font-bold uppercase tracking-widest ml-4"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center py-60">
              <div className="w-8 h-8 border-2 border-neutral-100 border-t-neutral-900 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full py-60 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200">
                    <LayoutGrid className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold text-neutral-300">Quiet Space</h3>
                    <p className="text-neutral-200 font-bold uppercase tracking-widest text-xs">Capture your first thought to begin.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Immersive Note Editor */}
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-screen-2xl w-[96vw] h-[92vh] bg-white p-0 rounded-[3rem] overflow-hidden shadow-[0_64px_256px_-32px_rgba(0,0,0,0.15)] border-none ring-1 ring-neutral-100">
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
