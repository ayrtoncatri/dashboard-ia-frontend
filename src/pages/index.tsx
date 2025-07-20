import Head from "next/head";
import React, { useState, useEffect } from "react";
import ProcesoForm from "../components/ProcesoForm";
import ProcesoList from "../components/ProcesoList";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // O spinner si quieres
  }

  const handleCreate = () => setRefresh((r) => !r);

  return (
    <>
      <Head>
        <title>Dashboard de Procesos</title>
      </Head>
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">
          Bienvenido, {user.nombre} 👋
        </h1>
        <ProcesoForm onCreate={handleCreate} />
        <ProcesoList key={String(refresh)} />
      </main>
    </>
  );
}
