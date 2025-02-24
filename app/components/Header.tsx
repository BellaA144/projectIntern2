"use client"

import Navbar from "./Navbar"

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-blue-800 shadow-md">
            <h1 className="text-2xl font-bold">📚 E-Library</h1>
            <Navbar />
        </header>
    )
}