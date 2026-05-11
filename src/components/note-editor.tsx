"use client";

import { useState, useEffect } from "react";
import { Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Trash2, Sparkles } from "lucide-react";
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

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    onUpdate({ title, content });
    onClose();
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeNoteContent({ content });
      onUpdate({ content: content + "\n\nAI Summary:\n" + result.summary });
      toast({ title: "Summary added to note" });
    } catch (err) {
      toast({ title: "Failed to summarize", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="border-none text-xl font-bold p-0 focus-visible:ring-0"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-neutral-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button onClick={handleSave} size="sm">Save</Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 border-none resize-none p-0 focus-visible:ring-0 text-base leading-relaxed"
        />
      </div>

      <div className="p-4 border-t flex justify-end">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleSummarize}
          disabled={isSummarizing || !content}
        >
          <Sparkles className="w-3 h-3 mr-2" />
          {isSummarizing ? "Summarizing..." : "AI Summarize"}
        </Button>
      </div>
    </div>
  );
}