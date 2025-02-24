"use client";

import { useState, useEffect } from "react";
import { getBooks, getCategories } from "@/lib/supabase";
import { useDebounce } from "@/hooks/useDebounce";

export function useBooks(initialFilters: { search: string; category: string; page: number }) {
  const [books, setBooks] = useState<any[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(initialFilters.search, 500);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log("Fetching books with filters:", initialFilters);

      const result = await getBooks({ ...initialFilters, search: debouncedSearch });

      console.log("Books fetched:", result);

      if (result) {
        setBooks(result.books ?? []);
        setTotalPages(result.totalPages);
      }

      const categoryList = await getCategories();
      setCategories(categoryList);
      setLoading(false);
    }
    fetchData();
  }, [debouncedSearch, initialFilters.category, initialFilters.page]);

  return { books, categories, totalPages, loading };
}
