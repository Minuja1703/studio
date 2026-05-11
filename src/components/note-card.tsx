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
      className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-[280px]"
      onClick={onClick}
    >
      <div className="flex-1 overflow-hidden space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {note.updatedAt?.seconds 
            ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
            : "Recently updated"}
        </div>
        
        <h3 className="text-xl font-bold text-neutral-900 leading-tight line-clamp-2">
          {note.title || "Untitled Note"}
        </h3>
        
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">
          {note.content || "Empty note"}
        </p>
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 mt-auto border-t border-slate-50">
          {note.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-medium text-slate-500 px-2 py-1 bg-slate-100 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}