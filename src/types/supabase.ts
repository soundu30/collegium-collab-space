
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
