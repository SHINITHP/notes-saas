export interface NoteData {
  id: string;
  title: string;
  content: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export interface TenantData {
  id: string;
  slug: string;
  isPro: boolean;
}

export interface UserData {
  id: string;
  tenantId: string;
  role: "ADMIN" | "MEMBER";
}