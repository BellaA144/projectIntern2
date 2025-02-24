"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getBooks, getCategories } from "@/lib/supabase"; 
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, Typography, TextField, MenuItem, Pagination, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter(); 

  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    page: parseInt(searchParams.get("page") || "1"),
  });

  const debouncedSearch = useDebounce(filters.search, 500); 

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { books, totalPages } = await getBooks({
          search: filters.search,
          category: filters.category,
          page: filters.page,
        });
  
        setBooks(books);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  
    fetchBooks();
  }, [filters]);
  
  

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.page > 1) params.set("page", filters.page.toString());

    router.replace(`?${params.toString()}`);
  }, [filters.search, filters.category, filters.page]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">E-Book List</h1>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg">
        <TextField
          label="Cari Buku..."
          id="search"
          variant="outlined"
          fullWidth
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <TextField
          select
          label="Kategori"
          id="category"
          variant="outlined"
          fullWidth
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }))}
        >
          <MenuItem value="">Semua Kategori</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <Card key={book.id} className="shadow-lg rounded-lg">
              <Image
                src={book.cover_url || "/placeholder.jpg"}
                alt={book.title}
                width={200}
                height={300}
                className="rounded-lg object-cover mx-auto"
              />
              <CardContent className="p-4 border-t border-gray-300">
                <Typography variant="h6" className="font-bold">
                  <Link href={`/books/${book.id}`} className="hover:underline text-gray-900">
                    {book.title}
                  </Link>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {book.category} - {book.year}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">Tidak ada buku yang ditemukan.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Box
          sx={{
            backgroundColor: "white", 
            borderRadius: "8px", 
            padding: "4px 8px", 
            display: "inline-flex", 
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
          }}
        >
          <Pagination
            count={totalPages}
            page={filters.page}
            onChange={(_, value) => setFilters((prev) => ({ ...prev, page: value }))}
            color="primary"
          />
        </Box>
      </div>
    </div>
  );
}
