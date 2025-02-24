import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Login attempt:", credentials);
      
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials - email atau password kosong!");
          return null;
        }
      
        console.log("Credentials ada, lanjut query ke Supabase...");
      
        const { data: user, error } = await supabase
          .from("users")
          .select("id_user, username, email, role, password") 
          .eq("email", credentials.email)
          .single();
      
        console.log("User dari Supabase:", user);
        console.log("Supabase Error:", error);
      
        if (!user) {
          console.log("User tidak ditemukan!");
          return null;
        }
      
        if (user.password !== credentials.password) {
          console.log("Password salah!");
          return null;
        }
      
        console.log("Login berhasil!", {
          id: user.id_user,
          name: user.username,
          email: user.email,
          role: user.role,
        });
      
        return { id: user.id_user, name: user.username, email: user.email, role: user.role };
      }      
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("🔹 JWT Token setelah login:", token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log("🔹 Session setelah login:", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
