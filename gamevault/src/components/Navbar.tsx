"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          🎮 GameVault
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm text-zinc-600 hover:text-black">
            Explorer
          </Link>

          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-600 hover:text-black"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-black"
            >
              Connexion
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
            >
              Inscription
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
