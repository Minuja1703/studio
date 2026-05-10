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
import { Search, Plus, LogOut, Terminal, Filter, LayoutGrid, X, Cpu } from "lucide-react";
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
    await createNote("NEURAL_ENTRY_" + new Date().getTime().toString().slice(-4), "Initialize thought process...");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AuthGuard>
      <div className="relative min-h-screen flex flex-col overflow-x-hidden">
        <div className="scanline pointer-events-none" />
        
        <div className="flex-1 flex flex-col p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full z-10">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1 group">
              <h1 className="text-4xl font-black tracking-tighter text-primary flex items-center gap-3">
                <Cpu className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />
                MONONOTE<span className="text-secondary opacity-50">.AI</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System_Active // {user?.email?.split('@')[0]}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-[10px] uppercase tracking-widest font-bold"
              >
                <LogOut className="w-3 h-3 mr-2" /> DISCONNECT
              </Button>
              <Button 
                size="lg" 
                onClick={handleCreateNote} 
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(82,206,239,0.2)] rounded-full uppercase font-black tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 mr-2" /> NEW_ENTRY
              </Button>
            </div>
          </header>

          {/* Search & Filters */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-2xl" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="QUERY_NEURAL_DATABASE..."
                className="relative pl-14 h-16 bg-card/40 border-white/5 rounded-2xl text-xl font-body focus-visible:ring-primary/20 backdrop-blur-sm transition-all"
              />
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 whitespace-nowrap">
                <Filter className="w-3 h-3" /> CLASSIFY:
              </div>
              <div className="flex items-center gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={activeTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all rounded-full border-white/10 ${
                      activeTags.includes(tag) 
                        ? "bg-secondary text-secondary-foreground shadow-[0_0_15px_rgba(132,121,216,0.3)]" 
                        : "text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
                {activeTags.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTags([])} 
                    className="h-8 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3 mr-1" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="font-mono text-primary/50 text-xs tracking-[0.5em] animate-pulse">SYNCHRONIZING_BUFFERS...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                  <div className="p-6 rounded-full bg-white/[0.02] border border-white/5">
                    <LayoutGrid className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-muted-foreground/40">Database Empty</h3>
                    <p className="text-xs font-mono text-muted-foreground/30 uppercase tracking-widest">Awaiting consciousness input.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Note Editor */}
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-6xl w-[95vw] h-[85vh] bg-background/80 backdrop-blur-3xl border-white/10 p-0 rounded-3xl overflow-hidden shadow-2xl">
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