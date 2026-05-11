"use client";

import { useState, useEffect } from "react";
import { Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Trash2, Sparkles, Check } from "lucide-react";
import { summarizeNoteContent } from "@/ai/flows/summarize-note-content-flow";
import { toast } from "@/hooks/use-toast";

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function NoteEditor({ note, onUpdate, onDelete, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    setIsSaving(true);
    onUpdate({ title, content });
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 400);
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeNoteContent({ content });
      const newContent = content + "\n\n---\nAI Summary:\n" + result.summary;
      setContent(newContent);
      onUpdate({ content: newContent });
      toast({ title: "Analysis complete" });
    } catch (err) {
      toast({ title: "Analysis failed", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70">
      <div className="flex items-center justify-between p-6 border-b border-primary/10">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry Title"
          className="border-none text-2xl font-extrabold p-0 focus-visible:ring-0 text-primary bg-transparent"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-primary/40 hover:text-red-500 transition-colors hover:bg-white/40">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button onClick={handleSave} className="rounded-full px-6 bg-primary" disabled={isSaving}>
            {isSaving ? <Check className="w-4 h-4" /> : "Finish"}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/40">
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-4 overflow-hidden bg-white/10">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your thoughts here..."
          className="flex-1 border-none resize-none p-0 focus-visible:ring-0 text-lg leading-relaxed text-primary bg-transparent"
        />
      </div>

      <div className="p-6 border-t border-primary/10 flex justify-between items-center">
        <div className="text-xs text-primary/50 font-medium">
          Last updated: {note.updatedAt?.seconds ? new Date(note.updatedAt.seconds * 1000).toLocaleString() : 'Just now'}
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleSummarize}
          disabled={isSummarizing || !content}
          className="rounded-full bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10"
        >
          <Sparkles className="w-3 h-3 mr-2" />
          {isSummarizing ? "Analyzing..." : "AI Intelligence"}
        </Button>
      </div>
    </div>
  );
}
