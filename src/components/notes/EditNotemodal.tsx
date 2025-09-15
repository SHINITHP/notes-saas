"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save } from "lucide-react";
import { NoteData } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
});

interface EditNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: NoteData | null;
  onSave: (data: { title: string; content: string }) => void;
}

export function EditNoteModal({ open, onOpenChange, note, onSave }: EditNoteModalProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Update form values when note prop changes
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title || "",
        content: note.content || "",
      });
    } else {
      form.reset({
        title: "",
        content: "",
      });
    }
  }, [note, form]);

  const onSubmit = async (data: { title: string; content: string }) => {
    await onSave(data);
    form.reset();
    onOpenChange(false); // Close modal after save
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl dark:bg-[#1a1a1a] animate-fade-in border border-border shadow-glow animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            Edit Note
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify the text to keep your note up to date.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter note title..."
                      {...field}
                      className="bg-slate-100 dark:bg-[#2a2a2a] border-border/50"
                      aria-invalid={form.formState.errors.title ? "true" : "false"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note content here..."
                      {...field}
                      rows={8}
                      className="bg-slate-100 dark:bg-[#2a2a2a] border-border/50 resize-none"
                      aria-invalid={form.formState.errors.content ? "true" : "false"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant="default"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
