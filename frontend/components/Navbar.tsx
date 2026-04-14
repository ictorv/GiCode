"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <div className="flex gap-6 p-4 bg-black text-white">
            <Link href="/">Home</Link>
            <Link href="/github">GitHub Analyzer</Link>
            <Link href="/analyze">Local Analyzer</Link>
        </div>
    );
}