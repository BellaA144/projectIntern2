"use client";

import { Button } from "@mui/material";
import { useRouter, usePathname } from "next/navigation"; 
import { signOut } from "@/lib/auth"; 

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      console.log("Sign Out process started...");
      await signOut();
      console.log("Sign Out successful, redirecting...");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  

  return (
    <header className="w-full p-4 bg-blue-800 text-white flex justify-between items-center shadow-md">
      <span className="text-lg font-semibold">📚 E-Library</span>

      {pathname !== "/login" && (
        <Button variant="contained" color="secondary" onClick={() => {
          console.log("Sign Out button clicked!");
          handleSignOut();
        }}>
          Sign Out
        </Button>
      )}
    </header>
  );
}
