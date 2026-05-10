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
    toast({ title: "Note saved" });
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeNoteContent({ content });
      setSummary(result.summary);
      onUpdate({ summary: result.summary });
    } catch (err) {
      toast({ title: "Summarization failed", variant: "destructive" });
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
      toast({ title: "Tag suggestion failed", variant: "destructive" });
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-neutral-100">
        <div className="flex-1 mr-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="border-none text-2xl font-semibold bg-transparent p-0 focus-visible:ring-0 placeholder:text-neutral-200 text-neutral-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button onClick={handleSave} className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 font-medium">
            Save Changes
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-6 h-6 text-neutral-400" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col p-10 md:p-14 overflow-hidden">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="flex-1 bg-transparent border-none resize-none p-0 focus-visible:ring-0 text-lg leading-relaxed text-neutral-700 placeholder:text-neutral-200"
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col border-l border-neutral-100 bg-[#fafafa] p-8 space-y-10">
          {/* Tags */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Tags</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-semibold text-neutral-400 hover:text-neutral-900" 
                onClick={handleSuggestTags}
                disabled={isSuggestingTags || !content}
              >
                <Sparkles className={`w-3 h-3 mr-1 ${isSuggestingTags ? 'animate-spin' : ''}`} />
                AI Suggest
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-2 px-3 py-1.5 bg-white text-neutral-600 border border-neutral-200 rounded-lg group">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-neutral-300 hover:text-neutral-900 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="+ Add tag"
                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-neutral-300 mt-2"
              />
            </div>
          </section>

          {/* AI Summary */}
          <section className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">AI Summary</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-semibold text-neutral-400 hover:text-neutral-900" 
                onClick={handleSummarize}
                disabled={isSummarizing || !content}
              >
                <Sparkles className={`w-3 h-3 mr-1 ${isSummarizing ? 'animate-spin' : ''}`} />
                Summarize
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-2xl border border-neutral-200 p-6 bg-white shadow-sm">
              <div className="text-sm text-neutral-500 leading-relaxed italic">
                {isSummarizing ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-3/4" />
                  </div>
                ) : (
                  summary || "No summary generated yet."
                )}
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </div>
  );
}