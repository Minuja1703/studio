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
      await createNote("New Note", "");
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
      <div className="min-h-screen bg-white">
        <header className="border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Notebook className="w-5 h-5" />
              <span className="font-bold tracking-tight text-lg">MonoNote</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-500">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button size="sm" onClick={handleCreateNote} className="rounded-full px-6">
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your archive..."
              className="pl-10 h-12 rounded-xl border-neutral-100 bg-neutral-50 focus:bg-white transition-all"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-neutral-100 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
              ))}
              
              {filteredNotes.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <p className="text-neutral-500">No notes found in your archive.</p>
                  <Button variant="outline" onClick={handleCreateNote} className="rounded-full">
                    Create your first note
                  </Button>
                </div>
              )}
            </div>
          )}

          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-2xl w-[95vw] h-[80vh] p-0 border-none shadow-2xl overflow-hidden rounded-2xl">
              <DialogTitle className="sr-only">Edit Note</DialogTitle>
              <DialogDescription className="sr-only">
                Update the title and content of your note. Changes are saved automatically on clicking Save.
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
