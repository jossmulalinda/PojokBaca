'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/lib/redux/authSlice";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { useToast } from "@/components/Admin/ToastProvider";
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiShieldUserLine,
  RiMailLine,
  RiKeyLine,
  RiUserAddLine,
  RiUserSharedLine,
  RiEditLine,
} from "react-icons/ri";

export default function UserManagementPage() {
  const { showToast, showUndoToast } = useToast();
  const auth = useSelector(selectAuthData);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  // selectedUser: jika null berarti mode tambah, jika ada data user berarti mode edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "P3RT-HMTI-API-KEY": BASE_API_KEY,
        },
      });
      setUsers(Array.isArray(response.data) ? response.data : (response.data?.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil daftar admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.role === "super_admin") {
      fetchUsers();
    }
  }, [auth]);

  if (auth?.role !== "super_admin") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
        <RiCloseLine size={50} className="text-red-500 bg-red-100 dark:bg-red-950 p-2.5 rounded-full mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2 max-w-sm">Hanya Super Admin yang diizinkan mengakses halaman manajemen admin ini.</p>
      </div>
    );
  }

  const handleToggleActive = async (user) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/api/admin/users/${user.id}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "P3RT-HMTI-API-KEY": BASE_API_KEY,
          },
        }
      );
      const updatedUser = response.data?.data || response.data;
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      showToast(`Akun admin ${user.username} ${updatedUser.is_active ? 'berhasil diaktifkan!' : 'dinonaktifkan.'}`, "info");
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengubah status aktif user.", "error");
    }
  };

  const handleDeleteUser = (userToDelete) => {
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

    showUndoToast({
      message: `Admin "${userToDelete.username}" dihapus`,
      onUndo: () => {
        fetchUsers();
      },
      onConfirm: async () => {
        try {
          await axios.delete(`${BASE_API_URL}/api/admin/users/${userToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "P3RT-HMTI-API-KEY": BASE_API_KEY,
            },
          });
        } catch (err) {
          fetchUsers();
          showToast("Gagal menghapus admin dari server", "error");
        }
      },
    });
  };

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setForm({ username: "", password: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setForm({ username: user.username, password: "" });
    setFormError("");
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    if (!form.username.trim()) {
      setFormError("Kolom username wajib diisi!");
      setFormLoading(false);
      return;
    }

    // Jika mode tambah, password wajib diisi. Jika mode edit, password opsional.
    if (!selectedUser && !form.password) {
      setFormError("Password wajib diisi untuk sub-admin baru!");
      setFormLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${auth.token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
        "Content-Type": "application/json",
      };

      if (selectedUser) {
        // Mode EDIT (PUT)
        const payload = { username: form.username };
        if (form.password) {
          payload.password = form.password;
        }

        const response = await axios.put(
          `${BASE_API_URL}/api/admin/users/${selectedUser.id}`,
          payload,
          { headers }
        );
        const resUser = response.data?.data || response.data;
        fetchUsers();
        showToast("Data admin berhasil diperbarui!", "success");
      } else {
        // Mode TAMBAH (POST)
        const response = await axios.post(
          `${BASE_API_URL}/api/admin/users`,
          form,
          { headers }
        );
        fetchUsers();
        showToast("Sub-admin baru berhasil dibuat!", "success");
      }

      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Sub-Admin</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Mengurus persetujuan registrasi sub-admin dan manajemen data sub-admin.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto cursor-pointer"
        >
          <RiAddLine size={18} />
          Buat Sub-Admin
        </button>
      </div>

      {/* error state */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Admin List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-40 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl animate-pulse" />
            ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl shadow-sm">
          <RiUserSharedLine size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold dark:text-gray-400">Belum ada sub-admin terdaftar</p>
          <p className="text-xs text-gray-400 mt-1">Sub admin yang mendaftar atau dibuat super admin akan muncul disini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300 font-bold uppercase text-lg">
                  {user.username?.[0] || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">{user.username}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      user.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate flex items-center gap-1.5">
                    <RiMailLine size={13} />
                    {user.email}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Terdaftar: {new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status Akun:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                    user.is_active 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {user.is_active ? <RiCheckLine /> : <RiCloseLine />}
                    {user.is_active ? 'Aktif' : 'Tertunda'}
                  </span>
                </div>

                <div className="flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    title="Edit Admin"
                  >
                    <RiEditLine size={16} />
                  </button>

                  {/* Approve/Disapprove Button */}
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      user.is_active 
                        ? 'border border-amber-250 dark:border-amber-900 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    }`}
                  >
                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Hapus Admin"
                  >
                    <RiDeleteBinLine size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Sub Admin */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-150 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              <h3 className="font-bold text-gray-855 dark:text-white flex items-center gap-2">
                <RiUserAddLine className="text-blue-600" />
                {selectedUser ? "Edit Data Sub-Admin" : "Registrasi Sub-Admin Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="px-4 py-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs">
                  {formError}
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <RiShieldUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Masukkan username admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Password {selectedUser ? "(Kosongkan jika tidak ingin diubah)" : <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <RiKeyLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required={!selectedUser}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={selectedUser ? "Password baru" : "Minimal 6 karakter"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-250 dark:border-gray-750 text-gray-650 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex-grow cursor-pointer"
                >
                  {formLoading ? "Memproses..." : "Simpan Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
