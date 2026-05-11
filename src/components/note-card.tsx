"use client";

import { Note } from "@/hooks/use-notes";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div 
      className="group bg-white/40 border border-primary/5 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer flex flex-col h-[200px]"
      onClick={onClick}
    >
      <div className="flex-1 overflow-hidden space-y-3">
        <h3 className="font-extrabold text-primary text-lg leading-tight line-clamp-2">
          {note.title || "Untitled Entry"}
        </h3>
        <p className="text-sm text-primary/70 leading-relaxed line-clamp-4">
          {note.content || "No content yet..."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-[10px] text-primary/50 font-bold uppercase tracking-widest">
          {note.updatedAt?.seconds 
            ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
            : "Recently"}
        </div>
        <div className="w-2 h-2 rounded-full bg-primary/10 group-hover:bg-primary transition-colors" />
      </div>
    </div>
  );
}
