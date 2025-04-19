export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      societies: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          logo_url: string | null
          registration_status: string | null
          registration_link: string | null
          faculty_head: string | null
          room: string | null
          email: string | null
          phone_number: string | null
          instagram: string | null
          linkedin: string | null
          facebook: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          logo_url?: string | null
          registration_status?: string | null
          registration_link?: string | null
          faculty_head?: string | null
          room?: string | null
          email?: string | null
          phone_number?: string | null
          instagram?: string | null
          linkedin?: string | null
          facebook?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          logo_url?: string | null
          registration_status?: string | null
          registration_link?: string | null
          faculty_head?: string | null
          room?: string | null
          email?: string | null
          phone_number?: string | null
          instagram?: string | null
          linkedin?: string | null
          facebook?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      batches: {
        Row: {
          branch: string
          id: string
          name: string
          section: string
          year: number
        }
        Insert: {
          branch: string
          id?: string
          name: string
          section: string
          year: number
        }
        Update: {
          branch?: string
          id?: string
          name?: string
          section?: string
          year?: number
        }
        Relationships: []
      }
      classrooms: {
        Row: {
          building: string | null
          capacity: number | null
          created_at: string | null
          floor: string | null
          id: string
          name: string
          room_no: string | null
        }
        Insert: {
          building?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          name: string
          room_no?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          name?: string
          room_no?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          coordinates: number[]
          created_at: string | null
          description: string | null
          facilities: Json | null
          id: string
          name: string
          type: string
        }
        Insert: {
          coordinates: number[]
          created_at?: string | null
          description?: string | null
          facilities?: Json | null
          id?: string
          name: string
          type: string
        }
        Update: {
          coordinates?: number[]
          created_at?: string | null
          description?: string | null
          facilities?: Json | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      room_bookings: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          purpose: string
          room_id: string | null
          room_name: string
          society: string
          start_time: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          purpose: string
          room_id?: string | null
          room_name: string
          society: string
          start_time: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          purpose?: string
          room_id?: string | null
          room_name?: string
          society?: string
          start_time?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          batch_id: string | null
          day: string
          id: string
          slots: Json
        }
        Insert: {
          batch_id?: string | null
          day: string
          id?: string
          slots: Json
        }
        Update: {
          batch_id?: string | null
          day?: string
          id?: string
          slots?: Json
        }
        Relationships: [
          {
            foreignKeyName: "schedules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          name: string
          subject_code: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subject_code?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subject_code?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          department: string
          email: string
          id: string
          name: string
          subjects: Json | null
        }
        Insert: {
          department: string
          email: string
          id?: string
          name: string
          subjects?: Json | null
        }
        Update: {
          department?: string
          email?: string
          id?: string
          name?: string
          subjects?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          is_admin: boolean | null
        }
        Insert: {
          id: string
          is_admin?: boolean | null
        }
        Update: {
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
