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
  email?: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  tenantId: string;
  role: "ADMIN" | "MEMBER";
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationData {
  id: string;
  email: string;
  token: string;
  role: "ADMIN" | "MEMBER";
  tenantId: string;
  expiresAt: Date;
}
