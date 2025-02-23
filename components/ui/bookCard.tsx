import { Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  category: string;
  year: string;
  cover_url: string;
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <Card className="shadow-lg rounded-lg">
        <div className="flex justify-center items-center">
            <Image
                src={book.cover_url || "/placeholder.jpg"}
                alt={book.title}
                width={200}
                height={300}
                className="object-cover"
            />
        </div>
      <CardContent className="p-4 border-t border-gray-300">
        <Typography variant="h6" className="font-bold">{book.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {book.category} - {book.year}
        </Typography>
      </CardContent>
    </Card>
  );
}
