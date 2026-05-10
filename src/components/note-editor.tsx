"use client";

import { useState, useEffect } from "react";
import { Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Hash, Trash2, Save, FileText, Share2, Maximize2 } from "lucide-react";
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
    toast({ title: "CORE_DATABASE_UPDATED" });
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeNoteContent({ content });
      setSummary(result.summary);
      onUpdate({ summary: result.summary });
    } catch (err) {
      toast({ title: "HEURISTIC_FAILURE", variant: "destructive" });
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
      toast({ title: "CLASSIFICATION_ERROR", variant: "destructive" });
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
    <div className="flex flex-col h-full bg-card/30">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex-1 mr-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ENTRY_IDENTIFIER"
            className="border-none text-3xl font-black bg-transparent p-0 focus-visible:ring-0 placeholder:opacity-10 uppercase tracking-tighter text-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onDelete} className="hover:text-destructive hover:bg-destructive/5 rounded-full">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2 bg-primary text-primary-foreground font-black px-6 rounded-full tracking-widest text-[10px]">
            <Save className="w-4 h-4" /> COMMIT_CHANGES
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col p-8 md:p-12 overflow-hidden border-r border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Data_Content</h3>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Awaiting intelligence input..."
            className="flex-1 bg-transparent border-none resize-none p-0 focus-visible:ring-0 text-xl leading-relaxed font-body placeholder:opacity-5 text-foreground/90 scrollbar-hide"
          />
        </div>

        {/* Sidebar */}
        <div className="w-96 flex flex-col p-8 space-y-10 bg-white/[0.01]">
          {/* Metadata */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-secondary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Classifiers</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-[9px] font-black tracking-widest uppercase gap-2 hover:text-primary hover:bg-primary/5 border border-white/5" 
                onClick={handleSuggestTags}
                disabled={isSuggestingTags || !content}
              >
                <Sparkles className={`w-3 h-3 ${isSuggestingTags ? 'animate-spin' : ''}`} />
                {isSuggestingTags ? 'PROCESSING' : 'AUTO_TAG'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-2 px-3 py-1.5 h-8 text-[10px] bg-white/5 border-white/10 text-foreground uppercase tracking-widest font-black rounded-lg group">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="+ ADD_CLASS"
                className="bg-transparent border-none focus:outline-none text-[10px] w-24 placeholder:opacity-20 font-mono tracking-widest uppercase pl-2"
              />
            </div>
          </section>

          {/* AI Intelligence */}
          <section className="flex-1 flex flex-col space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synthesis</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-[9px] font-black tracking-widest uppercase gap-2 hover:text-primary hover:bg-primary/5 border border-white/5" 
                onClick={handleSummarize}
                disabled={isSummarizing || !content}
              >
                <Sparkles className={`w-3 h-3 ${isSummarizing ? 'animate-spin' : ''}`} />
                {isSummarizing ? 'SYNTHESIZING' : 'GENERATE'}
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-2xl border border-white/5 p-6 bg-black/20 backdrop-blur-sm">
              <div className="text-sm text-muted-foreground/80 leading-relaxed font-body">
                {isSummarizing ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                  </div>
                ) : (
                  summary || <span className="text-[10px] font-mono opacity-20 uppercase tracking-[0.2em]">Ready for synthesis.</span>
                )}
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </div>
  );
}