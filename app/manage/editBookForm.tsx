"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type BookData = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  cover_url: string;
};

export default function EditBookForm({ book, open, onClose, onBookUpdated }: { book: BookData; open: boolean; onClose: () => void; onBookUpdated: () => void }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [year, setYear] = useState(book.year);
  const [description, setDescription] = useState(book.description);
  const [coverUrl, setCoverUrl] = useState(book.cover_url);
  const [loading, setLoading] = useState(false);

  async function handleUpdateBook() {
    setLoading(true);
    const { error } = await supabase.from("books").update({ title, author, category, year, description, cover_url: coverUrl }).eq("id", book.id);

    setLoading(false);
    if (error) {
      alert(`Gagal update buku: ${error.message}`);
    } else {
      alert("Buku berhasil diupdate!");
      onBookUpdated();
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Buku</DialogTitle>
      <DialogContent>
        <TextField label="Judul" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Penulis" fullWidth margin="normal" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <TextField label="Kategori" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField label="Tahun Terbit" type="number" fullWidth margin="normal" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <TextField label="Deskripsi" fullWidth multiline rows={3} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Cover URL" fullWidth margin="normal" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleUpdateBook} variant="contained" color="primary" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
