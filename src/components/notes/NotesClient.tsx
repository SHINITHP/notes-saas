// components/notes/NotesClient.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createNote } from "@/lib/api/notes";
import { CreateNoteModal } from "@/components/notes/CreateNoteModal";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/page-wrapper";
import { PlanLimitBanner } from "../subscription/PlanLimitBanner";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface NotesClientProps {
  notes: Note[];
}

export default function NotesClient({ notes }: NotesClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  const handleCreateNote = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (noteData: { title: string; content: string }) => {
    try {
      const newNote = await createNote(noteData);
      toast.success("Note created successfully!");
      // Optimistic update: Add new note to local state
      setLocalNotes([...localNotes, newNote]);
    } catch (error) {
      toast.error("Failed to create note. Please try again.");
      console.error("Error creating note:", error);
    } finally {
      setIsCreateModalOpen(false);
    }
  };

  return (
    <PageWrapper>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl md:text-4xl">Notes</h1>
            <p className="text-sm font-light md:text-md mt-1 text-gray-900 dark:text-gray-400">
              Organize your thoughts and ideas
            </p>
          </div>

          <Button
            onClick={handleCreateNote}
            // disabled={!canCreateNote} // Uncomment if implementing plan limits
            className="flex justify-center items-center mr-2 h-7 w-24 md:w-28 md:h-9 text-xs md:text-sm font-bold"
          >
            <Plus className="font-bold" /> New Note
          </Button>
        </div>

        <div className="py-6">
          <PlanLimitBanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          <NoteCard notes={localNotes} />
        </div>
      </div>

      <CreateNoteModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleSubmit}
      />
    </PageWrapper>
  );
}
