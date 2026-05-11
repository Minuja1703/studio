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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const filteredNotes = notes.filter(note => {
    return (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           note.content?.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleCreateNote = async () => {
    try {
      await createNote("New Entry", "");
    } catch (err: any) {
      toast({ title: "Error", description: "Could not create note.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <header className="border-b border-primary/10 sticky top-0 bg-white/40 z-20 backdrop-none">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">N</div>
              <span className="font-extrabold tracking-tighter text-xl text-primary uppercase">Archive</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary/60 hover:text-primary font-bold">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button size="sm" onClick={handleCreateNote} className="rounded-full px-5 bg-primary text-white font-bold shadow-lg">
                <Plus className="w-4 h-4 mr-1" /> New Entry
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archived entries..."
              className="pl-11 h-12 rounded-2xl border-primary/10 bg-white/40 shadow-sm focus:bg-white/60 transition-all text-primary font-medium"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              
              {filteredNotes.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center space-y-4">
                  <p className="text-primary/60 text-lg font-bold">The archive is empty.</p>
                  <Button variant="outline" onClick={handleCreateNote} className="rounded-full border-primary/20 text-primary bg-white/40 hover:bg-white/60 font-bold">
                    Begin Archive
                  </Button>
                </div>
              )}
            </div>
          )}

          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-2xl w-[95vw] h-[85vh] p-0 border-none shadow-2xl overflow-hidden rounded-3xl bg-transparent backdrop-none">
              <DialogTitle className="sr-only">Edit Archive Entry</DialogTitle>
              <DialogDescription className="sr-only">
                Modify your stored thought within the gallery.
              </DialogDescription>
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
        </main>
      </div>
    </AuthGuard>
  );
}
