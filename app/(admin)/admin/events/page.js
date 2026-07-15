'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY, getImageUrl } from "@/lib/api";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/lib/redux/authSlice";
import { useToast } from "@/components/Admin/ToastProvider";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiCheckLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiLinkM,
  RiCalendarEventLine,
} from "react-icons/ri";

// ─────────────────────────────────────────────
// Komponen: Modal Form Event
// ─────────────────────────────────────────────
const EventModal = ({ eventItem, onClose, onSaved, token }) => {
  const [form, setForm] = useState({
    title: eventItem?.title || "",
    description: eventItem?.description || "",
    link: eventItem?.link || "",
    date: eventItem?.date || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    eventItem?.image ? getImageUrl(eventItem.image) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format poster harus JPG, JPEG, PNG, WEBP, atau AVIF");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Ukuran poster maksimal 3MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.description) fd.append("description", form.description);
      if (form.link) fd.append("link", form.link);
      if (form.date) fd.append("date", form.date);
      
      if (image) {
        fd.append("image", image);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
      };

      if (eventItem?.id) {
        fd.append("_method", "PUT");
        await axios.post(
          `${BASE_API_URL}/api/admin/events/${eventItem.id}`,
          fd,
          { headers }
        );
      } else {
        if (!image) {
          setError("Poster wajib diunggah untuk event baru");
          setLoading(false);
          return;
        }
        await axios.post(`${BASE_API_URL}/api/admin/events`, fd, { headers });
      }
      onSaved(eventItem?.id ? "Event berhasil diperbarui!" : "Event baru berhasil ditambahkan!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {eventItem?.id ? "Edit Event HMTI" : "Tambah Event Baru"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Image Upload Box */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-between items-center w-full">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Poster Event <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                Rasio 3:4 / 4:5 (1080x1350px)
              </span>
            </div>
            <div
                className={`relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer group flex flex-col items-center justify-center transition-all ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 scale-[1.02]" 
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 hover:border-blue-500 dark:hover:border-blue-400"
                }`}
              onClick={() => fileRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-950 p-2">
                  <img
                    src={preview}
                    alt="Preview poster"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <RiUploadCloud2Line size={28} className="text-white animate-bounce" />
                    <span className="text-xs text-white ml-2 font-medium">Ganti Poster</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <RiUploadCloud2Line size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pilih berkas poster</p>
                  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, atau WEBP (Maks. 3MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Judul Event */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Masukkan judul event"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-880 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Deskripsi Event
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tuliskan detail mengenai event ini"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-880 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Tanggal Pelaksanaan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Tanggal / Waktu Pelaksanaan
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <RiCalendarEventLine size={16} />
              </span>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Contoh: Desember 2026 atau 12-14 Des 2026"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* URL Link */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Tautan Pendaftaran / Info Eksternal
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <RiLinkM size={16} />
              </span>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://example.com/daftar"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <RiCheckLine size={18} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Komponen: Konfirmasi Hapus
// ─────────────────────────────────────────────
const DeleteModal = ({ title, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 p-6 text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Hapus Event</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus event <strong>"{title}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-all shadow-md shadow-red-500/20"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Halaman Utama: Kelola Event
// ─────────────────────────────────────────────
export default function EventsAdmin() {
  const { showToast, showUndoToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventModal, setEventModal] = useState(null); // null atau { ...data }
  const [deleteTarget, setDeleteTarget] = useState(null); // null atau { id, title }
  const [deleting, setDeleting] = useState(false);
  const auth = useSelector(selectAuthData);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/admin/events`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "P3RT-HMTI-API-KEY": BASE_API_KEY,
        },
      });
      setEvents(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchEvents();
    }
  }, [auth]);

  const handleDelete = () => {
    const itemToDelete = deleteTarget;
    setDeleteTarget(null);

    // Optimistically remove from state
    setEvents((prev) => prev.filter((e) => e.id !== itemToDelete.id));

    showUndoToast({
      message: `Event "${itemToDelete.title}" dihapus`,
      onUndo: () => {
        fetchEvents();
      },
      onConfirm: async () => {
        try {
          await axios.delete(`${BASE_API_URL}/api/admin/events/${itemToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "P3RT-HMTI-API-KEY": BASE_API_KEY,
            },
          });
        } catch (err) {
          fetchEvents();
          showToast("Gagal menghapus event", "error");
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Event HMTI</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Tambah, edit, dan hapus event HMTI agar tampil dinamis di halaman utama dan menu Event.
          </p>
        </div>
        <button
          onClick={() => setEventModal({})}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 self-start transition-all"
        >
          <RiAddLine size={18} />
          Tambah Event
        </button>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="w-full flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada data event HMTI.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Poster</th>
                  <th className="px-6 py-4">Judul Event</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Tautan</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
                {events.map((event) => {
                  const imgUrl = event.image ? getImageUrl(event.image) : "/assets/img/marchevent-min.JPG";

                  return (
                    <tr key={event.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-colors">
                      {/* Image Poster */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                          <img src={imgUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      {/* Title & Description */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">{event.title}</div>
                        {event.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5 max-w-sm">
                            {event.description}
                          </div>
                        )}
                      </td>
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400">
                        {event.date || "—"}
                      </td>
                      {/* Link */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.link ? (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Buka Tautan <RiExternalLinkLine size={12} />
                          </a>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEventModal(event)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Edit Event"
                          >
                            <RiEditLine size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: event.id, title: event.title })}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Hapus Event"
                          >
                            <RiDeleteBinLine size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {eventModal && (
        <EventModal
          eventItem={eventModal.id ? eventModal : null}
          token={auth.token}
          onClose={() => setEventModal(null)}
          onSaved={(msg) => {
            fetchEvents();
            if (msg) showToast(msg, "success");
          }}
        />
      )}

      {/* Modal Delete */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
