
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
import { Search, Plus, LogOut, Terminal, Filter, LayoutGrid, X } from "lucide-react";
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
    await createNote("New Entry", "Start typing...");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
              <Terminal className="w-8 h-8" /> MONONOTE_AI
            </h1>
            <p className="text-sm font-mono text-muted-foreground opacity-60">CONNECTED_TO: {user?.email?.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/40 gap-2 font-bold uppercase tracking-widest text-[10px]">
              <LogOut className="w-3 h-3" /> Terminate_Session
            </Button>
            <Button size="lg" onClick={handleCreateNote} className="h-11 px-6 shadow-[0_0_20px_rgba(82,206,239,0.3)] gap-2 uppercase font-bold tracking-widest">
              <Plus className="w-5 h-5" /> NEW_ENTRY
            </Button>
          </div>
        </header>

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH_DATABASE_QUERY..."
              className="pl-12 h-14 bg-card/30 border-border/40 rounded-xl text-lg font-body focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap mr-2">
              <Filter className="w-3 h-3" /> FILTER_BY:
            </div>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={activeTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 text-xs uppercase transition-all ${
                  activeTags.includes(tag) ? "bg-primary text-primary-foreground" : "border-border/40 text-muted-foreground hover:border-primary/50"
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
                className="h-6 text-[10px] uppercase gap-1 hover:text-destructive"
              >
                <X className="w-3 h-3" /> Clear_All
              </Button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="font-mono text-primary animate-pulse tracking-[0.2em]">SYNCHRONIZING_CLOUDDATA...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
            ))}
            {filteredNotes.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-border/20 rounded-2xl">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/30">
                  <LayoutGrid className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-muted-foreground">No matching entries found</h3>
                  <p className="text-sm font-body text-muted-foreground opacity-40">Your digital brain is waiting for expansion.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Editor Modal */}
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-5xl h-[90vh] bg-background/95 backdrop-blur-xl border-border/40 p-6 md:p-10 rounded-2xl overflow-hidden flex flex-col">
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
    </AuthGuard>
  );
}
