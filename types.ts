
export type Role = 'admin' | 'user';

export interface User {
  username: string;
  role: Role;
  displayName: string;
}

export interface MeetingDocument {
  id: string;
  order: number;
  content: string;
  presenter: string;
  fileName: string;
  fileData?: string; // Base64
  aiSummary?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileData: string;
  uploadedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
