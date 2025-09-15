// lib/types.ts
export interface NoteData {
  id: string;
  title: string;
  content: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  updatedAtFormatted: string;
}