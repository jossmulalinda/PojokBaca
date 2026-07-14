'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
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
  RiHashtag,
} from "react-icons/ri";

// ─────────────────────────────────────────────
// Komponen: Modal Form Partner
// ─────────────────────────────────────────────
const PartnerModal = ({ partner, onClose, onSaved, token }) => {
  const [form, setForm] = useState({
    nama: partner?.nama || "",
    link: partner?.link || "",
    urutan: partner?.urutan ?? 0,
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(
    partner?.logo
      ? partner.logo.startsWith("http")
        ? partner.logo
        : `${BASE_API_URL}${partner.logo.startsWith("/") ? "" : "/"}${partner.logo}`
      : null
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
      processLogoFile(file);
    }
  };

  const processLogoFile = (file) => {
    // Mendukung jpg, jpeg, png, svg, webp, avif
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".svg")) {
      setError("Format logo harus JPG, JPEG, PNG, WEBP, AVIF, atau SVG");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran logo maksimal 2MB");
      return;
    }

    setLogo(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("nama", form.nama);
      if (form.link) fd.append("link", form.link);
      fd.append("urutan", form.urutan);
      
      if (logo) {
        fd.append("logo", logo);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
      };

      if (partner?.id) {
        fd.append("_method", "PUT");
        await axios.post(
          `${BASE_API_URL}/api/admin/partners/${partner.id}`,
          fd,
          { headers }
        );
      } else {
        if (!logo) {
          setError("Logo wajib diunggah untuk partner baru");
          setLoading(false);
          return;
        }
        await axios.post(`${BASE_API_URL}/api/admin/partners`, fd, { headers });
      }
      onSaved(partner?.id ? "Data partner berhasil diperbarui!" : "Partner baru berhasil ditambahkan!");
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
            {partner?.id ? "Edit Partner / Sponsor" : "Tambah Partner Baru"}
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

          {/* Logo Upload Box */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-between items-center w-full">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Logo Partner <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                Rasio 1:1 (PNG Transparan)
              </span>
            </div>
            <div
                className={`relative w-full h-36 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer group flex flex-col items-center justify-center transition-all ${
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
                <div className="relative w-full h-full p-4 flex items-center justify-center bg-white dark:bg-gray-950">
                  <img
                    src={preview}
                    alt="Preview logo"
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <RiUploadCloud2Line size={28} className="text-white animate-bounce" />
                    <span className="text-xs text-white ml-2 font-medium">Ganti Logo</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <RiUploadCloud2Line size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pilih berkas logo</p>
                  <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, atau SVG (Maks. 2MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/svg+xml,image/webp,image/avif"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Nama Partner */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Nama Partner / Instansi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              placeholder="Masukkan nama partner/sponsor"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              URL Website Partner (Opsional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <RiLinkM size={16} />
              </span>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Urutan Tampil */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Urutan Tampilan
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <RiHashtag size={16} />
              </span>
              <input
                type="number"
                value={form.urutan}
                onChange={(e) => setForm({ ...form, urutan: e.target.value !== "" ? Number(e.target.value) : 0 })}
                min="0"
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Angka lebih kecil akan ditampilkan lebih dahulu.</p>
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
const ConfirmDelete = ({ label, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-2">Hapus Partner?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        Apakah Anda yakin ingin menghapus partner <span className="font-semibold text-gray-800 dark:text-gray-200">{label}</span>? Data logo yang tersimpan di server juga akan dihapus permanen.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-all shadow-md shadow-red-500/10"
        >
          {loading ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Halaman Utama: PartnersAdmin
// ─────────────────────────────────────────────
export default function PartnersAdmin() {
  const { showToast, showUndoToast } = useToast();
  const auth = useSelector(selectAuthData);
  const token = auth?.token;

  const [partnersList, setPartnersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modals state
  const [partnerModal, setPartnerModal] = useState(null); // null | { data } (edit) | { data: null } (create)
  const [deleteTarget, setDeleteTarget] = useState(null); // null | { id, label }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "P3RT-HMTI-API-KEY": BASE_API_KEY,
  };

  const fetchPartners = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_API_URL}/api/admin/partners`, { headers: authHeaders });
      setPartnersList(res.data);
    } catch (err) {
      console.error("Gagal memuat data partner:", err);
      setErrorMsg("Gagal memuat data partner dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = () => {
    const itemToDelete = deleteTarget;
    setDeleteTarget(null);

    // Optimistically remove from state
    setPartnersList((prev) => prev.filter((p) => p.id !== itemToDelete.id));

    showUndoToast({
      message: `Partner "${itemToDelete.nama}" dihapus`,
      onUndo: () => {
        fetchPartners();
      },
      onConfirm: async () => {
        try {
          await axios.delete(
            `${BASE_API_URL}/api/admin/partners/${itemToDelete.id}`,
            { headers: authHeaders }
          );
        } catch (err) {
          fetchPartners();
          showToast("Gagal menghapus partner dari server", "error");
        }
      },
    });
  };

  const getLogoSrc = (logoPath) => {
    if (!logoPath) return "";
    if (logoPath.startsWith("http")) return logoPath;
    return `${BASE_API_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;
  };

  return (
    <div className="max-w-6xl mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Partner</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Kelola logo dan link partner kerja sama HMTI.
          </p>
        </div>
        <button
          onClick={() => setPartnerModal({ data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto cursor-pointer"
        >
          <RiAddLine size={18} />
          Tambah Partner
        </button>
      </div>

      {errorMsg && (
        <div className="px-4 py-3 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <div className="w-9 h-9 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat data partner...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/30">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">Logo</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Mitra</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Website URL</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-28">Urutan</th>
                  <th className="px-6 py-4 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {partnersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400 text-sm leading-relaxed">
                      <p className="font-medium text-gray-500 dark:text-gray-300">Belum ada partner terdaftar</p>
                      <p className="text-xs text-gray-400 mt-1">Klik tombol "Tambah Partner" di atas untuk menambahkan sponsor baru.</p>
                    </td>
                  </tr>
                ) : (
                  partnersList.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                      {/* Logo Cell */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-50 dark:bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <img
                            src={getLogoSrc(partner.logo)}
                            alt={partner.nama}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fb = e.target.nextSibling;
                              if (fb) fb.style.display = "flex";
                            }}
                          />
                          <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase rounded">
                            {partner.nama?.charAt(0) || "P"}
                          </div>
                        </div>
                      </td>
                      
                      {/* Nama Cell */}
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">
                        {partner.nama}
                      </td>

                      {/* Link Cell */}
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {partner.link ? (
                          <a
                            href={partner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-all"
                          >
                            <span className="truncate max-w-[200px]">{partner.link}</span>
                            <RiExternalLinkLine size={14} className="shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Tidak ada link</span>
                        )}
                      </td>

                      {/* Urutan Cell */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                          {partner.urutan ?? 0}
                        </span>
                      </td>

                      {/* Actions Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setPartnerModal({ data: partner })}
                            className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            title="Edit"
                          >
                            <RiEditLine size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: partner.id, label: partner.nama })}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Hapus"
                          >
                            <RiDeleteBinLine size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {partnerModal && (
        <PartnerModal
          partner={partnerModal.data}
          onClose={() => setPartnerModal(null)}
          onSaved={(msg) => {
          fetchPartners();
          if (msg) showToast(msg, "success");
        }}
          token={token}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.label}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
