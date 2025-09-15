"use client";

import { FileText, Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { CreateNoteModal } from "./CreateNoteModal";
import { NoteData } from "@/lib/types";
import { EditNoteModal } from "./EditNotemodal";

interface NoteCardProps {
  initialNotes: NoteData[];
}

export function NoteCard({ initialNotes }: NoteCardProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For async actions

  const handleCreate = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      const newNote = await res.json();
      // Add formatted date for new note
      newNote.updatedAtFormatted = new Date(
        newNote.updatedAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      setNotes([newNote, ...notes]);
      toast.success("Note created successfully!");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error((error as Error).message || "Failed to create note");
      setIsCreateModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: { title: string; content: string }) => {
    if (!selectedNote) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      const updatedNote = await res.json();
      // Update formatted date
      updatedNote.updatedAtFormatted = new Date(
        updatedNote.updatedAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      setNotes(notes.map((n) => (n.id === selectedNote.id ? updatedNote : n)));
      toast.success("Note updated successfully!");
      setIsEditModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      toast.error((error as Error).message || "Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setNotes(notes.filter((n) => n.id !== id));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-xl md:text-4xl">Notes</h1>
          <p className="text-sm font-light md:text-md mt-1 text-gray-900 dark:text-gray-400">
            Organize your thoughts and ideas
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex justify-center items-center mr-2 h-7 w-24 md:w-28 md:h-9 text-xs md:text-sm font-bold"
          aria-label="Create new note"
          disabled={isLoading}
        >
          <Plus className="font-bold" /> New Note
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {notes.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No notes found. Create one to get started!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "relative bg-gradient-card border border-border rounded-lg p-6 transition-all duration-200 hover:bg-card-hover hover:shadow-md group"
              )}
            >
              <div className="absolute top-6 right-6">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 pr-8">
                {note.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {note.content || "No content"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Updated {note.updatedAtFormatted}
              </p>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={`Edit note ${note.title}`}
                  disabled={isLoading}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                  className="flex-1 text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`Delete note ${note.title}`}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <CreateNoteModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setSelectedNote(null);
        }}
        onSave={handleCreate}
      />
      <EditNoteModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedNote(null);
        }}
        note={selectedNote}
        onSave={handleEdit}
      />
    </div>
  );
}
