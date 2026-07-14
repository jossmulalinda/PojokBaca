'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/lib/redux/authSlice";
import { useToast } from "@/components/Admin/ToastProvider";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiCheckLine,
  RiCloseLine,
  RiImageLine,
} from "react-icons/ri";

// ─────────────────────────────────────────────
// Komponen: Modal Form Galeri
// ─────────────────────────────────────────────
const GaleriModal = ({ onClose, onSaved, token }) => {
  const [form, setForm] = useState({
    judul: "",
    kategori: "",
    keterangan: "",
    tahun: new Date().getFullYear(),
  });
  const [fotos, setFotos] = useState([]);
  const [previews, setPreviews] = useState([]);
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
    const selectedFiles = Array.from(e.dataTransfer.files);
    if (selectedFiles.length > 0) {
      processFotoFiles(selectedFiles);
    }
  };

  const processFotoFiles = (files) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    const validFiles = [];
    const validPreviews = [];

    const filesToProcess = files.slice(0, 5); // Max 5 photos

    for (const file of filesToProcess) {
      if (!allowedTypes.includes(file.type)) {
        setError("Format foto harus JPG, JPEG, PNG, WEBP, atau AVIF");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("Ukuran masing-masing foto maksimal 4MB");
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setFotos(validFiles);
    setPreviews(validPreviews);
    setError("");
  };

  const handleFotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    processFotoFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (fotos.length === 0) {
      setError("Minimal 1 foto wajib diunggah");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("judul", form.judul);
      if (form.kategori) fd.append("kategori", form.kategori);
      if (form.keterangan) fd.append("keterangan", form.keterangan);
      if (form.tahun) fd.append("tahun", form.tahun);

      if (fotos.length === 1) {
        fd.append("foto", fotos[0]);
      } else {
        fotos.forEach((file) => {
          fd.append("fotos[]", file);
        });
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
      };

      await axios.post(`${BASE_API_URL}/api/admin/galeri`, fd, { headers });
      onSaved(`${fotos.length} foto dokumentasi berhasil diunggah!`);
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
          <h3 className="font-semibold text-gray-800 dark:text-white">Tambah Dokumentasi Baru</h3>
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

          {/* Photo Upload Box (Max 5 photos) */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-between items-center w-full">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Foto Kegiatan <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                Rasio 4:3 / 16:9 (1200x900px) • Maks 5 Foto
              </span>
            </div>
            <div
              className={`relative w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer group flex flex-col items-center justify-center transition-all ${
                isDragging 
                  ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 scale-[1.02]" 
                  : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 hover:border-blue-500 dark:hover:border-blue-400"
              }`}
              onClick={() => fileRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previews.length > 0 ? (
                <div className="w-full h-full p-2 grid grid-cols-3 gap-2 bg-white dark:bg-gray-950 overflow-y-auto">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <div className="aspect-square rounded-lg border border-dashed border-blue-400 flex flex-col items-center justify-center text-blue-500 hover:bg-blue-50/30">
                      <RiUploadCloud2Line size={20} />
                      <span className="text-[9px] font-bold mt-1">+ Tambah</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <RiUploadCloud2Line size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pilih berkas foto kegiatan</p>
                  <p className="text-xs text-gray-400 mt-1">Bisa pilih hingga 5 foto sekaligus (Maks 4MB/foto)</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFotoChange}
            />
          </div>

          {/* Judul Dokumentasi */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Judul Dokumentasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              required
              placeholder="Masukkan judul foto / kegiatan"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-880 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Kategori Kegiatan
            </label>
            <input
              type="text"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              placeholder="Contoh: rapat, event, pengabdian, dll."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-80-0 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Tahun */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Tahun Dokumentasi
            </label>
            <input
              type="number"
              value={form.tahun}
              onChange={(e) => setForm({ ...form, tahun: Number(e.target.value) })}
              min="2010"
              max="2100"
              placeholder="Contoh: 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-80-0 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Keterangan Tambahan
            </label>
            <textarea
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              placeholder="Masukkan catatan singkat terkait dokumentasi"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-880 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
            />
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
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Hapus Dokumentasi</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus dokumentasi <strong>"{title}"</strong>? Tindakan ini akan menghapus foto secara permanen.
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
// Halaman Utama: Kelola Galeri
// ─────────────────────────────────────────────
export default function GaleriAdmin() {
  const { showToast, showUndoToast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // null atau { id, judul }
  const [deleting, setDeleting] = useState(false);
  const auth = useSelector(selectAuthData);

  const fetchPhotos = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/galeri?page=${page}&per_page=12`, {
        headers: {
          "P3RT-HMTI-API-KEY": BASE_API_KEY,
        },
      });
      setPhotos(response.data?.data || []);
      setPagination({
        current_page: response.data?.current_page || 1,
        last_page: response.data?.last_page || 1,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(1);
  }, []);

  const handleDelete = () => {
    const itemToDelete = deleteTarget;
    setDeleteTarget(null);

    // Optimistically remove from state
    setPhotos((prev) => prev.filter((p) => p.id !== itemToDelete.id));

    showUndoToast({
      message: `Dokumentasi "${itemToDelete.judul}" dihapus`,
      onUndo: () => {
        fetchPhotos(pagination.current_page);
      },
      onConfirm: async () => {
        try {
          await axios.delete(`${BASE_API_URL}/api/admin/galeri/${itemToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "P3RT-HMTI-API-KEY": BASE_API_KEY,
            },
          });
        } catch (err) {
          fetchPhotos(pagination.current_page);
          showToast("Gagal menghapus foto dari server", "error");
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Galeri Dokumentasi</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Unggah dan kelola dokumentasi foto kegiatan HMTI Unkhair untuk dipublikasikan.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 self-start transition-all"
        >
          <RiAddLine size={18} />
          Unggah Dokumentasi
        </button>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="w-full flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada dokumentasi foto saat ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => {
              const imgUrl = photo.foto
                ? photo.foto.startsWith("http")
                  ? photo.foto
                  : `${BASE_API_URL}${photo.foto.startsWith("/") ? "" : "/"}${photo.foto}`
                : "/assets/img/galeryIMG.png";

              return (
                <div
                  key={photo.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative hover:shadow-md transition-all duration-200"
                >
                  {/* Photo Container */}
                  <div className="w-full h-40 overflow-hidden bg-gray-50 dark:bg-gray-950 relative border-b border-gray-100 dark:border-gray-850">
                    <img src={imgUrl} alt={photo.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* Category Tag */}
                    {photo.kategori && (
                      <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {photo.kategori}
                      </span>
                    )}
                  </div>
                  {/* Info Container */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{photo.judul}</h4>
                      <p className="text-xs text-gray-400 mt-1">Tahun: {photo.tahun || "—"}</p>
                      {photo.keterangan && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {photo.keterangan}
                        </p>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                      <button
                        onClick={() => setDeleteTarget({ id: photo.id, judul: photo.judul })}
                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-500/10 transition-colors flex items-center gap-1"
                      >
                        <RiDeleteBinLine size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Navigation */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => fetchPhotos(pagination.current_page - 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold px-2">
                Halaman {pagination.current_page} dari {pagination.last_page}
              </span>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => fetchPhotos(pagination.current_page + 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form Add */}
      {modalOpen && (
        <GaleriModal
          token={auth.token}
          onClose={() => setModalOpen(false)}
          onSaved={() => fetchPhotos(1)}
        />
      )}

      {/* Modal Delete */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.judul}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
