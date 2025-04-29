export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  created_by: string;
  member_count: number;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  created_at: string;
  user: User;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}