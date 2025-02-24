import { Suspense } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import BookDetail from "./bookDetail"; 

export default function BookDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="contained" color="primary" style={{ borderRadius: "50%", height: "60px" }}>
            ←
          </Button>
        </Link>
      </div>

      {/* Gunakan Suspense untuk Streaming */}
      <Suspense fallback={<p className="text-white">Loading book details...</p>}>
        <BookDetail id={params.id} />
      </Suspense>
    </div>
  );
}
