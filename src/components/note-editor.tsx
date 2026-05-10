
"use client";

import { useState, useEffect } from "react";
import { Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Hash, Trash2, Save, FileText } from "lucide-react";
import { summarizeNoteContent } from "@/ai/flows/summarize-note-content-flow";
import { suggestNoteTags } from "@/ai/flows/suggest-note-tags";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [summary, setSummary] = useState(note.summary || "");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setSummary(note.summary || "");
  }, [note]);

  const handleSave = () => {
    onUpdate({ title, content, tags, summary });
    toast({ title: "Note saved successfully" });
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeNoteContent({ content });
      setSummary(result.summary);
      onUpdate({ summary: result.summary });
    } catch (err) {
      toast({ title: "Failed to summarize note", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!content) return;
    setIsSuggestingTags(true);
    try {
      const result = await suggestNoteTags({ noteContent: content });
      const uniqueTags = Array.from(new Set([...tags, ...result.tags]));
      setTags(uniqueTags);
      onUpdate({ tags: uniqueTags });
    } catch (err) {
      toast({ title: "Failed to suggest tags", variant: "destructive" });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);
    onUpdate({ tags: updatedTags });
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const cleaned = newTag.trim().toLowerCase();
      if (!tags.includes(cleaned)) {
        const updatedTags = [...tags, cleaned];
        setTags(updatedTags);
        onUpdate({ tags: updatedTags });
      }
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="NOTE_TITLE_REQUIRED"
          className="border-none text-2xl font-bold bg-transparent p-0 focus-visible:ring-0 placeholder:opacity-30"
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDelete} className="hover:text-destructive">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> SAVE
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="md:col-span-2 flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary opacity-80 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Content
            </h3>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your digital consciousness here..."
            className="flex-1 bg-transparent border-none resize-none p-0 focus-visible:ring-0 text-lg leading-relaxed font-body placeholder:opacity-20"
          />
        </div>

        <div className="flex flex-col space-y-6 border-l border-border/40 pl-8 overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary opacity-80 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Meta Tags
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] gap-1 hover:text-primary" 
                onClick={handleSuggestTags}
                disabled={isSuggestingTags || !content}
              >
                <Sparkles className={`w-3 h-3 ${isSuggestingTags ? 'animate-spin' : ''}`} />
                {isSuggestingTags ? 'PROCESSING...' : 'SUGGEST'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1 h-6 text-xs bg-muted border-border/40 text-foreground">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-primary">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="+ ADD_TAG"
                className="bg-transparent border-none focus:outline-none text-xs w-20 placeholder:opacity-30"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary opacity-80 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Summary
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] gap-1 hover:text-primary" 
                onClick={handleSummarize}
                disabled={isSummarizing || !content}
              >
                <Sparkles className={`w-3 h-3 ${isSummarizing ? 'animate-spin' : ''}`} />
                {isSummarizing ? 'GENERATING...' : 'GENERATE'}
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-md border border-border/20 p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap font-body">
                {isSummarizing ? (
                  <div className="animate-pulse">Synthesizing intelligence...</div>
                ) : (
                  summary || "No summary generated yet. Click generate to synthesize content."
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
