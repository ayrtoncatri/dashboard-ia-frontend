import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-700 py-4 px-4 shadow mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <span className="text-white text-2xl font-bold tracking-tight">
          Dashboard IA
        </span>
        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-white hover:text-blue-200 transition font-medium">
            Procesos
          </Link>
          {user && (
            <>
              <span className="text-white">Hola, {user.nombre}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-100 transition ml-2"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
        {/* Mobile hamburger */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {menuOpen ? (
              // Icono de cerrar
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Icono de hamburguesa
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 animate-fadeIn">
          <Link
            href="/"
            className="block py-2 text-white font-medium hover:text-blue-200 transition"
            onClick={() => setMenuOpen(false)}
          >
            Procesos
          </Link>
          {user && (
            <>
              <span className="block py-2 text-white">Hola, {user.nombre}</span>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full bg-white text-blue-700 px-3 py-2 rounded font-semibold hover:bg-blue-100 transition mt-2"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
