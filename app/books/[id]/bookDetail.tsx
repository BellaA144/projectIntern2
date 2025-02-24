import { Suspense } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BookDescription from "@/app/components/bookDescription";

async function getBookDetail(id: string) {
  const { data, error } = await supabase
    .from("books")
    .select("id, title, author, year, category, cover_url, description")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function BookDetail({ id }: { id: string }) {
  const book = await getBookDetail(id);
  if (!book) return notFound();

  return (
    <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src={book.cover_url || "/placeholder.jpg"}
            alt={book.title}
            className="w-full md:w-72 h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-700 text-lg font-medium mt-1">
            {book.author} - {book.year}
          </p>
          <p className="text-gray-600 text-sm mt-1">{book.category}</p>

          {/* Stream bagian deskripsi */}
          <Suspense fallback={<p className="text-gray-500">Loading description...</p>}>
            <BookDescription description={book.description} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
