"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  Crown,
  X,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "../_lib/upload";

interface UserData {
  id: number;
  email: string;
  username: string | null;
  full_name: string | null;
  profile_image_url: string | null;
  auth_provider: string;
  is_active: boolean;
  role: "user" | "admin" | "owner";
}

export default function UsersPage() {
  const { user: currentUser, refreshUser, token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Modal States
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user"); // State for role
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const data: UserData[] = await api.get("/admin/users", token);
      setUsers(data);
      setLoadError("");
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoadError(errorMessage(error, "No se pudieron cargar los usuarios"));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const lowerSearch = search.trim().toLowerCase();
  const filteredUsers = lowerSearch
    ? users.filter(
        (user) =>
          user.email.toLowerCase().includes(lowerSearch) ||
          (user.full_name && user.full_name.toLowerCase().includes(lowerSearch)),
      )
    : users;

  const openDeleteModal = (user: UserData) => {
    setModalError("");
    setDeletingUser(user);
  };

  const handleDelete = async () => {
    if (!deletingUser || isSaving) return;
    setIsSaving(true);
    setModalError("");
    try {
      await api.delete(`/admin/users/${deletingUser.id}`, token);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } catch (error) {
      // Backend reasons (owner protection, admins managed only by the owner...) come translated by api.ts
      setModalError(errorMessage(error, "No se pudo eliminar el usuario"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingUser || isSaving) return;
    const email = editEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setModalError("Introduce un correo electrónico válido.");
      return;
    }
    setIsSaving(true);
    setModalError("");
    try {
      // JSON body (not query params) so personal data doesn't end up in server logs
      const body: { full_name: string; email: string; role?: string } = {
        full_name: editName.trim(),
        email,
      };
      if (editRole !== editingUser.role) body.role = editRole;
      const updated: UserData = await api.put(`/admin/users/${editingUser.id}`, body, token);

      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));

      // Logic to update global context if we edited ourselves
      if (currentUser && currentUser.id === editingUser.id) {
        await refreshUser();
      }

      setEditingUser(null);
    } catch (error) {
      setModalError(errorMessage(error, "No se pudo actualizar el usuario"));
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setEditName(user.full_name || "");
    setEditEmail(user.email);
    setEditRole(user.role); // Init role
    setModalError("");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[var(--accent-primary)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Usuarios
          </h1>
          <p className="text-[var(--text-secondary)]">
            Gestiona los usuarios y roles de la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:outline-none w-full md:w-64"
            />
          </div>
        </div>
      </header>

      {loadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">
          {loadError}
        </div>
      )}

      <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl min-h-[400px] overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider rounded-tl-2xl">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider rounded-tr-2xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[var(--bg-tertiary)]/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      {user.profile_image_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profile_image_url}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        {user.full_name || "Sin nombre"}
                        {user.role === "owner" && (
                          <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === "owner" ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 items-center gap-1">
                      <Crown className="w-3 h-3" /> Dueño
                    </span>
                  ) : user.role === "admin" ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                      Usuario
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.role === "owner" ? (
                    <span className="text-xs text-[var(--text-muted)]">Protegido</span>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        title="Editar"
                        aria-label={`Editar ${user.email}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        disabled={currentUser?.id === user.id}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={currentUser?.id === user.id ? "No puedes eliminar tu propia cuenta" : "Eliminar"}
                        aria-label={`Eliminar ${user.email}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            No se encontraron usuarios.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Editar Usuario
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Nombre Completo
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-indigo-500 outline-none"
                  />
                </div>
                {/* Role Selector */}
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">
                    Rol
                  </label>
                  <div className="relative">
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                      disabled={editingUser.role === "owner"}
                    >
                      <option value="user" className="bg-[var(--bg-elevated)]">
                        Usuario
                      </option>
                      <option value="admin" className="bg-[var(--bg-elevated)]">
                        Administrador
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Define el nivel de acceso del usuario en la plataforma.
                    {currentUser?.role !== "owner" && " Solo el propietario puede gestionar administradores."}
                  </p>
                </div>
              </div>
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">
                  {modalError}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingUser(null)}
                  disabled={isSaving}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEdit}
                  disabled={isSaving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <X className="w-6 h-6 text-red-500" /> Confirmar Eliminación
              </h2>
              <p className="text-[var(--text-secondary)]">
                Estás a punto de eliminar a{" "}
                <span className="text-[var(--text-primary)] font-medium">
                  {deletingUser.full_name || deletingUser.email}
                </span>
                .
                <br />
                <br />
                <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-sm">
                  Esta acción es irreversible.
                </span>
              </p>
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm" role="alert">
                  {modalError}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeletingUser(null)}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
