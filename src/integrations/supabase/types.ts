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
          date: string;
          time: string | null;
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
