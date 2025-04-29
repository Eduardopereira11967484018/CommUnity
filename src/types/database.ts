export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          created_at?: string
          created_by?: string
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}