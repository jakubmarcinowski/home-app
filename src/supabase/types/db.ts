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
      home: {
        Row: {
          address: string;
          city: string;
          created_at: string;
          id: number;
          land_size: number;
          listed_date: string;
          number_of_bathrooms: number;
          number_of_bedrooms: number;
          price: number;
          property_type: Database['public']['Enums']['propertytype'];
          seller_id: string;
          updated_at: string;
        };
        Insert: {
          address: string;
          city: string;
          created_at?: string;
          id?: number;
          land_size: number;
          listed_date?: string;
          number_of_bathrooms: number;
          number_of_bedrooms: number;
          price: number;
          property_type: Database['public']['Enums']['propertytype'];
          seller_id: string;
          updated_at?: string;
        };
        Update: {
          address?: string;
          city?: string;
          created_at?: string;
          id?: number;
          land_size?: number;
          listed_date?: string;
          number_of_bathrooms?: number;
          number_of_bedrooms?: number;
          price?: number;
          property_type?: Database['public']['Enums']['propertytype'];
          seller_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'home_seller_id_fkey';
            columns: ['seller_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      image: {
        Row: {
          created_at: string;
          home_id: number;
          id: number;
          updated_at: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          home_id: number;
          id?: number;
          updated_at?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          home_id?: number;
          id?: number;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'image_home_id_fkey';
            columns: ['home_id'];
            referencedRelation: 'home';
            referencedColumns: ['id'];
          },
        ];
      };
      message: {
        Row: {
          buyer_id: string;
          home_id: number;
          id: number;
          message: string;
          seller_id: string;
        };
        Insert: {
          buyer_id: string;
          home_id: number;
          id?: number;
          message?: string;
          seller_id: string;
        };
        Update: {
          buyer_id?: string;
          home_id?: number;
          id?: number;
          message?: string;
          seller_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'message_buyer_id_fkey';
            columns: ['buyer_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_home_id_fkey';
            columns: ['home_id'];
            referencedRelation: 'home';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_seller_id_fkey';
            columns: ['seller_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          phone: string;
          updated_at: string;
          user_type: Database['public']['Enums']['usertype'];
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          phone: string;
          updated_at?: string;
          user_type: Database['public']['Enums']['usertype'];
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          phone?: string;
          updated_at?: string;
          user_type?: Database['public']['Enums']['usertype'];
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      propertytype: 'residential' | 'condo';
      usertype: 'buyer' | 'seller' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
