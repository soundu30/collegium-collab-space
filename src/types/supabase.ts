
export type SupabaseFilter = {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
};

export type SupabaseOrderBy = {
  column: string;
  ascending: boolean;
};

export interface SupabaseQueryOptions {
  table: string;
  columns?: string;
  filters?: SupabaseFilter[];
  orderBy?: SupabaseOrderBy;
  limit?: number;
  single?: boolean;
  enabled?: boolean;
}

export interface SupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<any>;
}

// Define the Profile type to match our database
export type Profile = {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  interests: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

// Define table types for proper typing with Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
      };
      forum_topics: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          views_count: number;
          tags: string[];
        };
      };
      forum_comments: {
        Row: {
          id: string;
          topic_id: string;
          content: string;
          user_id: string;
          created_at: string;
          like_count: number;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          file_url?: string;
          file_type: string;
          category: string;
          user_id: string;
          created_at: string;
          download_count: number;
          rating: number;
          tags: string[];
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          organizer_id: string;
          category: string;
          is_online: boolean;
          link?: string;
          image_url?: string;
          created_at: string;
        };
      };
      event_participants: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          sent_at: string;
          is_read: boolean;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
      };
      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
        };
      };
    };
  };
}
