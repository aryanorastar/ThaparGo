export type Json =
  | string
  | number
  | boolean
  | null
  | { [key] | undefined }
  | Json[]

export type Database = {
  public{
    Tables{
      societies{
        Row{
          id
          name
          description: 
          category
          logo_url | null
          registration_status | null
          registration_link | null
          faculty_head | null
          room | null
          email | null
          phone_number | null
          instagram | null
          linkedin | null
          facebook | null
          created_at | null
        }
        Insert{
          id?
          name
          description: 
          category
          logo_url? | null
          registration_status? | null
          registration_link? | null
          faculty_head? | null
          room? | null
          email? | null
          phone_number? | null
          instagram? | null
          linkedin? | null
          facebook? | null
          created_at? | null
        }
        Update{
          id?
          name?
          description: ?
          category?
          logo_url? | null
          registration_status? | null
          registration_link? | null
          faculty_head? | null
          room? | null
          email? | null
          phone_number? | null
          instagram? | null
          linkedin? | null
          facebook? | null
          created_at? | null
        }
        Relationships
      }
      batches{
        Row{
          branch
          id
          name
          section
          year
        }
        Insert{
          branch
          id?
          name
          section
          year
        }
        Update{
          branch?
          id?
          name?
          section?
          year?
        }
        Relationships
      }
      classrooms{
        Row{
          building | null
          capacity | null
          created_at | null
          floor | null
          id
          name
          room_no | null
        }
        Insert{
          building? | null
          capacity? | null
          created_at? | null
          floor? | null
          id?
          name
          room_no? | null
        }
        Update{
          building? | null
          capacity? | null
          created_at? | null
          floor? | null
          id?
          name?
          room_no? | null
        }
        Relationships
      }
      locations{
        Row{
          coordinates
          created_at | null
          description:  | null
          facilities | null
          id
          name
          type
        }
        Insert{
          coordinates
          created_at? | null
          description: ? | null
          facilities? | null
          id?
          name
          type
        }
        Update{
          coordinates?
          created_at? | null
          description: ? | null
          facilities? | null
          id?
          name?
          type?
        }
        Relationships
      }
      room_bookings{
        Row{
          created_at | null
          date
          end_time
          id
          purpose
          room_id | null
          room_name
          society
          start_time
          status
          user_id | null
        }
        Insert{
          created_at? | null
          date
          end_time
          id?
          purpose
          room_id? | null
          room_name
          society
          start_time
          status?
          user_id? | null
        }
        Update{
          created_at? | null
          date?
          end_time?
          id?
          purpose?
          room_id? | null
          room_name?
          society?
          start_time?
          status?
          user_id? | null
        }
        Relationships[
          {
            foreignKeyName"room_bookings_room_id_fkey"
            columns["room_id"]
            isOneToOne
            referencedRelation"classrooms"
            referencedColumns["id"]
          },
        ]
      }
      schedules{
        Row{
          batch_id | null
          day
          id
          slots
        }
        Insert{
          batch_id? | null
          day
          id?
          slots
        }
        Update{
          batch_id? | null
          day?
          id?
          slots?
        }
        Relationships[
          {
            foreignKeyName"schedules_batch_id_fkey"
            columns["batch_id"]
            isOneToOne
            referencedRelation"batches"
            referencedColumns["id"]
          },
        ]
      }
      subjects{
        Row{
          created_at
          id
          name
          subject_code | null
        }
        Insert{
          created_at?
          id?
          name
          subject_code? | null
        }
        Update{
          created_at?
          id?
          name?
          subject_code? | null
        }
        Relationships
      }
      teachers{
        Row{
          department
          email
          id
          name
          subjects | null
        }
        Insert{
          department
          email
          id?
          name
          subjects? | null
        }
        Update{
          department?
          email?
          id?
          name?
          subjects? | null
        }
        Relationships
      }
      user_roles{
        Row{
          id
          is_admin | null
        }
        Insert{
          id
          is_admin? | null
        }
        Update{
          id?
          is_admin? | null
        }
        Relationships
      }
    }
    Views{
      [_ in never]
    }
    Functions{
      [_ in never]
    }
    Enums{
      [_ in never]
    }
    CompositeTypes{
      [_ in never]
    }
  }
}

