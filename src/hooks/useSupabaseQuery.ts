
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseQueryOptions, SupabaseQueryResult } from '@/types/supabase';

export function useSupabaseQuery<T>({
  table,
  columns = '*',
  filters = [],
  orderBy = undefined,
  limit = undefined,
  single = false,
  enabled = true,
}: SupabaseQueryOptions): SupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from(table)
          .select(columns);
        
        // Apply filters
        filters.forEach(filter => {
          const { column, operator, value } = filter;
          switch (operator) {
            case 'eq':
              query = query.eq(column, value);
              break;
            case 'neq':
              query = query.neq(column, value);
              break;
            case 'gt':
              query = query.gt(column, value);
              break;
            case 'lt':
              query = query.lt(column, value);
              break;
            case 'gte':
              query = query.gte(column, value);
              break;
            case 'lte':
              query = query.lte(column, value);
              break;
            case 'in':
              query = query.in(column, value as any[]);
              break;
            case 'contains':
              query = query.contains(column, value);
              break;
            default:
              break;
          }
        });

        // Apply ordering
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending });
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = single 
          ? await query.single() 
          : await query;

        if (error) {
          throw error;
        }

        setData(data as T);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [table, columns, JSON.stringify(filters), orderBy?.column, orderBy?.ascending, limit, single, enabled]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from(table)
        .select(columns);
      
      // Apply filters
      filters.forEach(filter => {
        const { column, operator, value } = filter;
        switch (operator) {
          case 'eq':
            query = query.eq(column, value);
            break;
          case 'neq':
            query = query.neq(column, value);
            break;
          case 'gt':
            query = query.gt(column, value);
            break;
          case 'lt':
            query = query.lt(column, value);
            break;
          case 'gte':
            query = query.gte(column, value);
            break;
          case 'lte':
            query = query.lte(column, value);
            break;
          case 'in':
            query = query.in(column, value as any[]);
            break;
          case 'contains':
            query = query.contains(column, value);
            break;
          default:
            break;
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = single 
        ? await query.single() 
        : await query;

      if (error) {
        throw error;
      }

      setData(data as T);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error('Error refetching data from Supabase:', err);
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  return { data, error, isLoading, refetch };
}
