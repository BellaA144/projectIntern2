"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/card";
import { Input } from "@/app/components/input";
import { Button } from "@/app/components/button";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    console.log("Email:", email);
    console.log("Password:", password); // Debugging
  
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      console.log("SignIn result:", result); // Debugging
  
      if (result?.error) {
        setError("Email atau password salah!");
        return;
      }
  
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      console.log("Session:", session); // Debugging
  
      if (session?.user?.role === "admin") {
        router.push("/manage");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-sm text-center text-gray-500 mt-2">
              Belum punya akun? <Link href="/sign-up" className="text-blue-500 hover:underline">Daftar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
