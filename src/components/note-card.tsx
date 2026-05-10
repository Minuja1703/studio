
"use client";

import { Note } from "@/hooks/use-notes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tag, Clock } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:border-primary/50 transition-all duration-200 bg-card border-border/40"
      onClick={onClick}
    >
      <CardHeader className="p-4 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
            {note.title || "Untitled Note"}
          </CardTitle>
          <div className="text-[10px] text-muted-foreground whitespace-nowrap opacity-60 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {note.updatedAt?.seconds 
              ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
              : "just now"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3 font-body opacity-80">
          {note.content || <span className="italic opacity-50">Empty note...</span>}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-[10px] px-1.5 py-0 h-4 border-primary/20 bg-primary/5 text-primary"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
