import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

const bucketName = "books";

// Ambil data user yang sedang login
async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return data?.user;
}

// Fungsi untuk mendapatkan daftar buku dengan RLS
export async function getBooks({ search, category, year, page }: { search?: string; category?: string; year?: string; page?: number }) {
  const limit = 6;
  const offset = ((page || 1) - 1) * limit;

  let query = supabase
    .from("books")
    .select("*", { count: "exact" })
    .order("year", { ascending: false });

  if (search) query = query.ilike("title", `%${search}%`);
  if (category) query = query.eq("category", category);
  if (year) query = query.eq("year", parseInt(year));

  const { count, error: countError } = await query;
  if (countError) {
    console.error("Error fetching book count:", countError.message);
    return { books: [], totalPages: 1 };
  }

  const totalBooks = count ?? 0;

  if (offset >= totalBooks) {
    console.warn("Offset lebih besar dari jumlah total buku. Mengembalikan array kosong.");
    return { books: [], totalPages: Math.ceil(totalBooks / limit) || 1 };
  }

  const { data: books, error } = await query.range(offset, Math.min(offset + limit - 1, totalBooks - 1));

  if (error || !books) {
    console.error("Error fetching books:", error?.message);
    return { books: [], totalPages: 1 };
  }

  const booksWithImage = books.map((book) => {
    const isExternalUrl = book.cover_url?.startsWith("http");
    const coverUrl = isExternalUrl
      ? book.cover_url
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${book.cover_url}`;

    return { ...book, cover_url: coverUrl };
  });

  return { books: booksWithImage, totalPages: Math.ceil(totalBooks / limit) || 1 };
}

// Fungsi untuk mendapatkan kategori unik dari buku
export async function getCategories() {
  const { data, error } = await supabase.from("books").select("category");

  if (error || !data) {
    console.error("Error fetching categories:", error?.message);
    return [];
  }

  const uniqueCategories = Array.from(new Set(data.map((b) => b.category).filter(Boolean)));
  return uniqueCategories;
}

// Fungsi untuk register dengan RLS (gunakan `auth.signUp()`)
export async function signUpUser({ email, password, username }: { email: string, password: string, username: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  // Simpan data user di tabel `users`
  const { data: userData, error: insertError } = await supabase.from("users").insert([
    { id_user: data.user?.id, email, username, role: "reader" }
  ]);

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, data };
}

// Fungsi untuk login
export async function signInUser({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Error signing in:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// Fungsi untuk logout
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}
