export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          image_url: string | null;
          is_featured: boolean;
          published_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          excerpt: string;
          content: string;
          author: string;
          category: string;
          image_url?: string | null;
          is_featured?: boolean;
          published_at: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          category?: string;
          image_url?: string | null;
          is_featured?: boolean;
          published_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          type: string;
          published_at: string;
          link: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          type: string;
          published_at: string;
          link: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          type?: string;
          published_at?: string;
          link?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          date: string | null;
          time: string | null;
          end_time: string | null;
          timezone: string;
          location: string;
          presenters: string[];
          description: string;
          link: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          date: string;
          time?: string | null;
          end_time?: string | null;
          timezone?: string;
          location: string;
          presenters: string[];
          description: string;
          link?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          date?: string;
          time?: string | null;
          end_time?: string | null;
          timezone?: string;
          location?: string;
          presenters?: string[];
          description?: string;
          link?: string | null;
          image_url?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string | null;
          consent: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message?: string | null;
          consent?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string | null;
          consent?: boolean | null;
        };
        Relationships: [];
      };
      pdf_downloads: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          company: string | null;
          downloaded_asset: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          company?: string | null;
          downloaded_asset: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          downloaded_asset?: string;
        };
        Relationships: [];
      };
      document_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          notes: string | null;
          files: Json;
          total_size: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          notes?: string | null;
          files?: Json;
          total_size?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          notes?: string | null;
          files?: Json;
          total_size?: number;
        };
        Relationships: [];
      };
      // Written exclusively by the `client-form` Edge Function (service role).
      // The anon key can only SELECT/DELETE here, and only when signed in as an
      // admin — see supabase/migrations/20260815_client_form.sql.
      client_form_submissions: {
        Row: {
          id: string;
          email: string;
          status: string;
          data: Json;
          schema_version: number;
          created_at: string;
          updated_at: string;
          submitted_at: string | null;
          last_ip_hash: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          status?: string;
          data?: Json;
          schema_version?: number;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          last_ip_hash?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          status?: string;
          data?: Json;
          schema_version?: number;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          last_ip_hash?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
