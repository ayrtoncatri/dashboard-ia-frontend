import React, { useEffect, useState } from "react";
import axios from "axios";

interface Proceso {
  id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  fecha: string;
  responsable: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const estados = ["pendiente", "en progreso", "finalizado"];

const ProcesoList: React.FC = () => {
  const [procesos, setProcesos] = useState<Proceso[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Proceso>>({});
  const [iaResult, setIaResult] = useState<string | null>(null);
  const [iaLoading, setIaLoading] = useState(false);

  // Cargar procesos
  const fetchProcesos = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/procesos`)
      .then((res) => setProcesos(res.data))
      .catch(() => alert("Error cargando procesos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProcesos();
  }, []);

  // Eliminar proceso
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este proceso?")) return;
    try {
      await axios.delete(`${API_URL}/procesos/${id}`);
      fetchProcesos();
    } catch {
      alert("Error al eliminar proceso");
    }
  };

  // Iniciar edición
  const startEdit = (proceso: Proceso) => {
    setEditId(proceso.id);
    setEditForm({ ...proceso, fecha: proceso.fecha.substring(0, 10) });
  };

  // Guardar cambios de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id: string) => {
    try {
      await axios.put(`${API_URL}/procesos/${id}`, editForm);
      setEditId(null);
      fetchProcesos();
    } catch {
      alert("Error al guardar cambios");
    }
  };

  const cancelEdit = () => setEditId(null);

  const handleIaReport = async (proceso: Proceso) => {
    setIaLoading(true);
    setIaResult(null);
    try {
      const res = await axios.post(`${API_URL}/ia`, proceso);
      setIaResult(res.data.respuesta);
    } catch {
      setIaResult("Error al generar reporte IA");
    } finally {
      setIaLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Procesos empresariales</h2>
      {loading && <p>Cargando...</p>}
      <div className="hidden md:block">
        <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {procesos.map((p) =>
              editId === p.id ? (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2">
                    <input
                      name="nombre"
                      value={editForm.nombre ?? ""}
                      onChange={handleEditChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      name="descripcion"
                      value={editForm.descripcion ?? ""}
                      onChange={handleEditChange}
                      className="border rounded p-1 w-full"
                      rows={2}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      name="estado"
                      value={editForm.estado ?? ""}
                      onChange={handleEditChange}
                      className="border rounded p-1 w-full"
                    >
                      {estados.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      name="fecha"
                      value={editForm.fecha ?? ""}
                      onChange={handleEditChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="responsable"
                      value={editForm.responsable ?? ""}
                      onChange={handleEditChange}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="p-2 flex gap-1">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id} className="border-t hover:bg-blue-50 transition-all">
                  <td className="p-2">{p.nombre}</td>
                  <td className="p-2">{p.descripcion}</td>
                  <td className="p-2">{p.estado}</td>
                  <td className="p-2">{new Date(p.fecha).toLocaleDateString()}</td>
                  <td className="p-2">{p.responsable}</td>
                  <td className="p-2 flex gap-1">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-xl shadow transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-xl shadow transition"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleIaReport(p)}
                      className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-1 rounded-xl shadow transition"
                    >
                      Generar reporte IA
                    </button>

                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
          {procesos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2">
              <div>
                <span className="font-semibold">Nombre:</span> {p.nombre}
              </div>
              <div>
                <span className="font-semibold">Descripción:</span> {p.descripcion}
              </div>
              <div>
                <span className="font-semibold">Estado:</span> {p.estado}
              </div>
              <div>
                <span className="font-semibold">Fecha:</span> {new Date(p.fecha).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Responsable:</span> {p.responsable}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startEdit(p)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-xl shadow transition text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-xl shadow transition text-sm"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleIaReport(p)}
                  className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-1 rounded-xl shadow transition text-sm"
                >
                  Reporte IA
                </button>
              </div>
            </div>
          ))}
        </div>

      {!loading && procesos.length === 0 && (
        <p className="mt-4 text-gray-500">No hay procesos registrados.</p>
      )}
      {iaLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <p className="text-lg font-bold mb-2">Generando reporte con IA...</p>
            <div className="animate-spin border-4 border-blue-500 rounded-full w-8 h-8 border-t-transparent mx-auto"></div>
          </div>
        </div>
      )}
      {iaResult && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
            style={{ maxHeight: "95vh" }}
          >
            <h3 className="text-2xl font-bold mb-3 text-purple-700 px-6 pt-6">
              Reporte IA
            </h3>
            {/* Aquí va el scroll, OJO: flex-1 y overflow-y-auto */}
            <div
              className="flex-1 overflow-y-auto whitespace-pre-line break-words text-gray-800 px-6 mb-4"
              style={{ minHeight: 120, maxHeight: "56vh" }}
            >
              {iaResult}
            </div>
            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={() => setIaResult(null)}
                className="bg-purple-600 hover:bg-purple-800 text-white px-6 py-2 rounded-xl font-semibold shadow"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProcesoList;
