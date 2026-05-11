"use client";

import { Note } from "@/hooks/use-notes";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div 
      className="group cursor-pointer space-y-8"
      onClick={onClick}
    >
      <div className="aspect-[4/5] bg-white border border-neutral-100 rounded-[3rem] p-12 shadow-[0_8px_32px_rgba(0,0,0,0.02)] group-hover:shadow-[0_64px_128px_-24px_rgba(0,0,0,0.08)] group-hover:-translate-y-6 transition-all duration-[800ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] flex flex-col relative overflow-hidden group-hover:border-neutral-200">
        
        {/* Subtle hover indicator */}
        <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          <ArrowUpRight className="w-6 h-6 text-neutral-400" />
        </div>

        <div className="flex-1 overflow-hidden space-y-10">
          <div className="flex items-center justify-between">
            <p className="text-neutral-300 text-[10px] font-bold uppercase tracking-[0.3em]">
              {note.updatedAt?.seconds 
                ? formatDistanceToNow(new Date(note.updatedAt.seconds * 1000), { addSuffix: true })
                : "Entry Active"}
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-4xl font-semibold text-neutral-900 leading-[1.1] tracking-tighter line-clamp-3 group-hover:text-neutral-700 transition-colors">
              {note.title || "Untitled Entry"}
            </h3>
            <p className="text-neutral-400 text-lg leading-relaxed line-clamp-4 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              {note.content || "An empty entry waiting for your insight."}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-12">
          {note.tags && note.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300 px-5 py-2.5 bg-neutral-50 rounded-full group-hover:bg-neutral-100 group-hover:text-neutral-500 transition-all"
            >
              #{tag}
            </span>
          ))}
          {note.tags && note.tags.length > 2 && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-200 py-2.5 ml-2">
              +{note.tags.length - 2} More
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
