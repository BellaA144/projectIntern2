"use client"

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-end mt-2 space-x-6">
          <Link href="/" className=" hover:text-blue-600">
            BookLists
          </Link>
          <Link href="/manage" className=" hover:text-blue-600">
            BookManage
          </Link>
          <Link href="/login" className="text-red-600 hover:text-red-800 font-medium">
            Sign-out
          </Link>
        </nav>
    );
}