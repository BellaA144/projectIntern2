"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddBookForm from "./addBookForm";
import EditBookForm from "./editBookForm";
import { Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

// Type definition for book data
type BookData = {
    id: string;
    title: string;
    author: string;
    category: string;
    year: number;
    description: string;
    cover_url: string;
  };
  
  export default function Page() {
    const [books, setBooks] = useState<BookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBook, setEditBook] = useState<BookData | null>(null);
    const [view, setView] = useState<'add' | 'list'>('list');
  
    async function fetchBooks() {
      setLoading(true);
      const { data, error } = await supabase.from("books").select("*");
  
      if (error) {
        console.error("Error fetching books:", error.message);
        setBooks([]);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    }
  
    async function handleDeleteBook(id: string) {
      if (!confirm("⚠️ Apakah kamu yakin ingin menghapus buku ini?")) return;
  
      const { error } = await supabase.from("books").delete().eq("id", id);
  
      if (error) {
        alert(`Gagal menghapus buku: ${error.message}`);
      } else {
        alert("Buku berhasil dihapus!");
        fetchBooks();
      }
    }
  
    useEffect(() => {
      fetchBooks();
    }, []);
  
    return (
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-gray-800 text-white p-4 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-4">
            <Button 
              variant="contained" 
              fullWidth 
              color={view === 'add' ? "primary" : "inherit"}
              onClick={() => setView('add')}
            >
              Add Book
            </Button>
            <Button 
              variant="contained" 
              fullWidth 
              color={view === 'list' ? "primary" : "inherit"}
              onClick={() => setView('list')}
            >
              List Books
            </Button>
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="w-5/6 p-6 bg-gray-100">
        <h1 className="text-3xl text-slate-950 font-bold text-center mb-6 border-b-2 border-gray-300 pb-2">Admin Dashboard</h1>
          {view === 'add' ? (
            <AddBookForm onBookAdded={fetchBooks} />
          ) : (
            <>
              {editBook && (
                <EditBookForm book={editBook} open={!!editBook} onClose={() => setEditBook(null)} onBookUpdated={fetchBooks} />
              )}
  
              {loading ? (
                <div className="flex justify-center my-6">
                  <CircularProgress />
                </div>
              ) : books.length === 0 ? (
                <p className="text-center text-gray-500">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {books.map((book) => (
                    <Card key={book.id} className="shadow-lg rounded-lg h-full">
                      <CardContent className="h-full flex flex-col justify-between">
                        <img src={book.cover_url} alt={book.title} className="w-auto h-auto object-cover rounded" />
                        <div>
                          <Typography variant="h6" className="mt-4 font-semibold">
                            {book.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ✍️ {book.author} | 📖 {book.category} | 🗓 {book.year}
                          </Typography>
                          <Typography variant="body2" className="mt-2">
                            {book.description.slice(0, 100)}...
                          </Typography>
                        </div>
                        <div className="flex justify-between mt-auto pt-4">
                          <Button variant="contained" color="secondary" onClick={() => setEditBook(book)}>
                            ✏️ Edit
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDeleteBook(book.id)}>
                            🗑️ Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  