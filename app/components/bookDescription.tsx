'use client';

import { Suspense } from "react";
import { CircularProgress } from "@mui/material";

export default function BookDescription({ description }: { description: string }) {
  return (
    <Suspense fallback={<CircularProgress />}>
      <p className="mt-4 text-gray-800 leading-relaxed">{description}</p>
    </Suspense>
  );
}
