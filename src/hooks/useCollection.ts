"use client";

import { useState, useEffect, useCallback } from "react";

export interface CollectionActions<T, TCreate> {
  items: T[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredItems: T[];
  refresh: () => Promise<void>;
  create: (data: TCreate) => Promise<void>;
  update: (id: string, data: Partial<TCreate>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  deletingId: string | null;
}

export function useCollection<T extends { id?: string }, TCreate>(
  fetcher: () => Promise<T[]>,
  creator: (data: TCreate) => Promise<string | void>,
  updater: (id: string, data: Partial<TCreate>) => Promise<void>,
  deleter: (id: string) => Promise<void>,
  searchFields: (keyof T)[] = []
): CollectionActions<T, TCreate> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredItems = searchQuery
    ? items.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return (
            val != null &&
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
      )
    : items;

  async function create(data: TCreate) {
    try {
      await creator(data);
      await refresh();
    } catch (err) {
      console.error("Failed to create:", err);
      throw err;
    }
  }

  async function update(id: string, data: Partial<TCreate>) {
    try {
      await updater(id, data);
      await refresh();
    } catch (err) {
      console.error("Failed to update:", err);
      throw err;
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      await deleter(id);
      await refresh();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return {
    items,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filteredItems,
    refresh,
    create,
    update,
    remove,
    deletingId,
  };
}
