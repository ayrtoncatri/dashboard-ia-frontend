import React, { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";

const LoginPage: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(nombre);
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-xs"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login Maclete</h2>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
