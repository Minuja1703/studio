"use client";

import { Note } from "@/hooks/use-notes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tag, Clock, ChevronRight } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card 
      className="group relative cursor-pointer glow-card bg-card/40 border-white/5 overflow-hidden rounded-2xl hover:bg-white/[0.02]"
      onClick={onClick}
    >
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      
      <CardHeader className="p-6 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-black leading-tight tracking-tighter uppercase group-hover:text-primary transition-colors">
            {note.title || "Untitled Entry"}
          </CardTitle>
          <div className="text-[10px] font-mono text-muted-foreground/50 whitespace-nowrap flex items-center gap-1.5 pt-1">
            <Clock className="w-3 h-3" />
            {note.updatedAt?.seconds 
              ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
              : "just now"}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-sm text-muted-foreground/70 line-clamp-4 font-body leading-relaxed">
          {note.content || <span className="italic opacity-30">Empty data buffer...</span>}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1.5">
            {note.tags && note.tags.length > 0 ? (
              note.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-[9px] px-2 py-0.5 h-4 border-white/10 bg-white/5 text-muted-foreground uppercase tracking-widest font-bold"
                >
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="text-[9px] text-muted-foreground/30 font-mono tracking-widest">UNTRIAGED</span>
            )}
            {note.tags && note.tags.length > 2 && (
              <span className="text-[9px] text-muted-foreground/30 font-mono">+{note.tags.length - 2}</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-primary/0 group-hover:text-primary/100 translate-x-2 group-hover:translate-x-0 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
}