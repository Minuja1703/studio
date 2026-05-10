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
      className="group cursor-pointer space-y-6 transition-all duration-500"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-white border border-neutral-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_60px_rgb(0,0,0,0.06)] group-hover:-translate-y-2 transition-all duration-500 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-4">
            {note.updatedAt?.seconds 
              ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
              : "Moments ago"}
          </p>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-4 line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {note.title || "Untitled Entry"}
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-4 font-medium">
            {note.content || "No content provided."}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {note.tags && note.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-300"
            >
              #{tag}
            </span>
          ))}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-200">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
