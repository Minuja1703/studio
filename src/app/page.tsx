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
import { Search, Plus, LogOut, Notebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useUser();
  const auth = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const filteredNotes = notes.filter(note => {
    return note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           note.content.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="min-h-screen bg-background">
        <header className="border-b border-blue-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">N</div>
              <span className="font-extrabold tracking-tighter text-xl text-primary">MonoNote</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button size="sm" onClick={handleCreateNote} className="rounded-full px-5 bg-primary">
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
              placeholder="Search archive entries..."
              className="pl-11 h-12 rounded-2xl border-blue-100 bg-white shadow-sm focus:bg-white transition-all focus:ring-primary/10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-3 border-blue-100 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              
              {filteredNotes.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center space-y-4">
                  <p className="text-muted-foreground text-lg">Your archive is currently empty.</p>
                  <Button variant="outline" onClick={handleCreateNote} className="rounded-full border-blue-200 text-primary">
                    Create first entry
                  </Button>
                </div>
              )}
            </div>
          )}

          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-2xl w-[95vw] h-[85vh] p-0 border-none shadow-2xl overflow-hidden rounded-3xl">
              <DialogTitle className="sr-only">Edit Archive Entry</DialogTitle>
              <DialogDescription className="sr-only">
                Review and update your archived thought.
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
