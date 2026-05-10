"use client";

import { Note } from "@/hooks/use-notes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card 
      className="group relative cursor-pointer border-none bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl p-2"
      onClick={onClick}
    >
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700">
          {note.title || "Untitled"}
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1 font-medium">
          <Clock className="w-3 h-3" />
          {note.updatedAt?.seconds 
            ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
            : "just now"}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <p className="text-neutral-500 text-sm line-clamp-4 leading-relaxed font-normal">
          {note.content || "Start writing..."}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {note.tags && note.tags.length > 0 ? (
            note.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[11px] px-3 py-1 bg-neutral-50 text-neutral-500 border-none rounded-lg"
              >
                {tag}
              </Badge>
            ))
          ) : null}
          {note.tags && note.tags.length > 3 && (
            <span className="text-[11px] text-neutral-300">+{note.tags.length - 3} more</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}