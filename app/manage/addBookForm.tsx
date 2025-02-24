"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

export default function AddBookForm({ onBookAdded }: { onBookAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddBook() {
    if (!title || !author || !category || !year || !description || !coverUrl) {
      alert("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("books").insert([
      { title, author, category, year, description, cover_url: coverUrl },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error inserting book:", error);
      alert(`Gagal menambahkan buku: ${error.message}`);
    } else {
      alert("Buku berhasil ditambahkan!");
      setTitle("");
      setAuthor("");
      setCategory("");
      setYear(null);
      setDescription("");
      setCoverUrl("");
      onBookAdded();
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6"> Tambah Buku</Typography>
        <TextField label="Judul" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Penulis" fullWidth margin="normal" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <TextField label="Kategori" fullWidth margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField
          label="Tahun Terbit"
          type="number"
          fullWidth
          margin="normal"
          value={year ?? ""}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
        />
        <TextField label="Deskripsi" fullWidth multiline rows={3} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Cover URL" fullWidth margin="normal" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
        <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleAddBook} disabled={loading} style={{ marginTop: 10 }}>
                {loading ? "Menambahkan..." : "Tambah Buku"}
            </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
