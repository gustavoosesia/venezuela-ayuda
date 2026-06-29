"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-900 text-lg">
            <Heart className="text-red-500" size={22} fill="currentColor" />
            Venezuela Se Levanta
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">Inicio</Link>
            <Link href="/sugerencias" className="text-gray-500 hover:text-gray-800 transition-colors">Sugerencias</Link>
            <Link href="/voluntario" className="text-gray-500 hover:text-blue-800 transition-colors">Soy Voluntario</Link>
            {/* CTA primario — necesito ayuda */}
            <Link
              href="/necesito-ayuda"
              className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold"
            >
              Necesito Ayuda
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/necesito-ayuda"
              className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Necesito Ayuda
            </Link>
            <button className="text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium border-t pt-4">
            <Link href="/" className="text-gray-700" onClick={() => setOpen(false)}>Inicio</Link>
            <Link href="/necesito-ayuda" className="text-red-600 font-semibold" onClick={() => setOpen(false)}>Necesito Ayuda</Link>
            <Link href="/voluntario" className="text-gray-700" onClick={() => setOpen(false)}>Soy Voluntario</Link>
            <Link href="/sugerencias" className="text-gray-700" onClick={() => setOpen(false)}>Sugerencias</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
