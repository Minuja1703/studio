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
      className="group cursor-pointer space-y-8 transition-all duration-700"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-white border border-neutral-100 rounded-[2.5rem] p-10 shadow-[0_12px_40px_rgb(0,0,0,0.03)] group-hover:shadow-[0_48px_128px_rgb(0,0,0,0.08)] group-hover:-translate-y-4 transition-all duration-700 flex flex-col relative overflow-hidden ring-1 ring-transparent group-hover:ring-neutral-200">
        <div className="flex-1 overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-neutral-300 text-[10px] font-bold uppercase tracking-[0.2em]">
              {note.updatedAt?.seconds 
                ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
                : "Just Now"}
            </p>
          </div>
          <h3 className="text-3xl font-semibold text-neutral-900 leading-tight line-clamp-2 group-hover:text-neutral-700 transition-colors">
            {note.title || "Untitled Entry"}
          </h3>
          <p className="text-neutral-500 text-base leading-relaxed line-clamp-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {note.content || "An empty entry waiting for your insight."}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-8">
          {note.tags && note.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-300 px-3 py-1 bg-neutral-50 rounded-lg group-hover:bg-neutral-100 group-hover:text-neutral-400 transition-all"
            >
              #{tag}
            </span>
          ))}
          {note.tags && note.tags.length > 3 && (
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-200 py-1">
              +{note.tags.length - 3} More
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
