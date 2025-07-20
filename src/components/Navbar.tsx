import React from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-700 py-4 px-6 shadow mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <span className="text-white text-2xl font-bold tracking-tight">
          Dashboard IA
        </span>
        <div className="flex gap-6 items-center">
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
      </div>
    </nav>
  );
};

export default Navbar;
