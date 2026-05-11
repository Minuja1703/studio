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
      className="group bg-white border border-neutral-100 rounded-xl p-5 hover:border-black transition-colors cursor-pointer flex flex-col h-[180px]"
      onClick={onClick}
    >
      <div className="flex-1 overflow-hidden space-y-2">
        <h3 className="font-bold text-neutral-900 leading-tight line-clamp-2">
          {note.title || "Untitled"}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
          {note.content || "Empty..."}
        </p>
      </div>
      <div className="text-[10px] text-neutral-400 mt-4 font-medium uppercase tracking-wider">
        {note.updatedAt?.seconds 
          ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
          : "Just now"}
      </div>
    </div>
  );
}