import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Proceso {
  nombre: string;
  descripcion: string;
  estado: string;
  fecha: string;
  responsable: string;
}

const estados = ["pendiente", "en progreso", "finalizado"];

const ProcesoForm: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
  const [form, setForm] = useState<Proceso>({
    nombre: "",
    descripcion: "",
    estado: "pendiente",
    fecha: "",
    responsable: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/procesos`, form);
      setForm({
        nombre: "",
        descripcion: "",
        estado: "pendiente",
        fecha: "",
        responsable: "",
      });
      onCreate(); // Refresca la lista
    } catch {
      alert("Error al crear proceso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow p-6 mb-8" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Agregar Proceso</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Responsable</label>
          <input
            type="text"
            name="responsable"
            value={form.responsable}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Estado</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={2}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar"}
      </button>
    </form>
  );
};

export default ProcesoForm;
