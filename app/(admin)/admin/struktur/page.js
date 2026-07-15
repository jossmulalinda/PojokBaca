'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY, getImageUrl } from "@/lib/api";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/lib/redux/authSlice";
import * as XLSX from "xlsx";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiUploadCloud2Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { useToast } from "@/components/Admin/ToastProvider";

const placeholderImg = "/assets/img/placeholder-pengurus.png";

// ─────────────────────────────────────────────
// Komponen: Modal Form Pengurus
// ─────────────────────────────────────────────
const PengurusModal = ({ pengurus, bidangList, divisiList, pengurusList, allowedJabatans, onClose, onSaved, token, defaultPeriode }) => {
  const [form, setForm] = useState({
    nama: (pengurus?.isPlaceholder || !pengurus?.nama) ? "" : pengurus.nama,
    jabatan: pengurus?.jabatan || (allowedJabatans.length === 1 ? allowedJabatans[0] : ""),
    bidang_id: (pengurus?.isPlaceholder || !pengurus?.bidang_id) ? "" : pengurus.bidang_id,
    divisi_id: (pengurus?.isPlaceholder || !pengurus?.divisi_id) ? "" : pengurus.divisi_id,
    angkatan: (pengurus?.isPlaceholder || !pengurus?.angkatan) ? "" : pengurus.angkatan,
    periode: (pengurus?.isPlaceholder || !pengurus?.periode) ? (defaultPeriode || "") : pengurus.periode,
  });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(
    pengurus?.foto ? getImageUrl(pengurus.foto) : null
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
      processFotoFile(file);
    }
  };

  const processFotoFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format foto harus JPG, JPEG, PNG, WEBP, atau AVIF");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Ukuran foto maksimal 3MB");
      return;
    }
    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFotoFile(file);
  };

  const showBidang = ["Ketua Bidang", "Sekretaris Bidang", "Ketua Divisi", "Anggota"].includes(form.jabatan);
  
  // Sembunyikan dropdown divisi jika bidang terpilih belum memiliki divisi yang terdaftar di database
  const hasDivisiInSelectedBidang = divisiList.some((d) => d.bidang_id === Number(form.bidang_id));
  const showDivisi = ["Ketua Divisi", "Anggota"].includes(form.jabatan) && form.bidang_id && hasDivisiInSelectedBidang;

  // Filter Bidang Induk: Untuk tingkat Kadiv dan Anggota, hanya tampilkan bidang yang sudah memiliki Pengurus Inti (Kabid/Sekbid)
  const activeBidangIds = pengurusList
    .filter((p) => ["Ketua Bidang", "Sekretaris Bidang"].includes(p.jabatan))
    .map((p) => p.bidang_id);

  const isMemberOrKadiv = ["Ketua Divisi", "Anggota"].includes(form.jabatan);
  const selectableBidang = isMemberOrKadiv
    ? bidangList.filter((b) => activeBidangIds.includes(b.id))
    : bidangList;

  const isBPH = ["Ketua Umum", "Sekretaris Umum", "Sekretaris", "Bendahara Umum"].includes(form.jabatan);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") fd.append(k, v);
      });
      if (foto) fd.append("foto", foto);

      // Bersihkan ID jika jabatan tidak memerlukannya
      if (!showBidang) {
        fd.delete("bidang_id");
        fd.delete("divisi_id");
      } else if (!showDivisi) {
        fd.delete("divisi_id");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
      };

      if (pengurus?.id && !pengurus.isPlaceholder) {
        fd.append("_method", "PUT");
        await axios.post(
          `${BASE_API_URL}/api/admin/struktur/pengurus/${pengurus.id}`,
          fd,
          { headers }
        );
      } else {
        await axios.post(`${BASE_API_URL}/api/admin/struktur/pengurus`, fd, { headers });
      }
      onSaved((pengurus?.id && !pengurus.isPlaceholder) ? "Data pengurus berhasil diperbarui!" : "Pengurus baru berhasil ditambahkan!");
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {(pengurus?.id && !pengurus?.isPlaceholder) ? "Edit Pengurus" : "Tambah Pengurus"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <RiCloseLine size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Foto Upload */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              Rasio 3:4 / 1:1 (600x800px)
            </span>
            <div
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed cursor-pointer group flex flex-col items-center justify-center transition-all ${
                  isDragging 
                    ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 scale-[1.05]" 
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400"
                }`}
              onClick={() => fileRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <img
                src={preview || placeholderImg}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = placeholderImg; }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <RiUploadCloud2Line size={24} className="text-white" />
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFotoChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {preview ? "Ganti foto" : "Upload foto"}
            </button>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Jabatan <span className="text-red-500">*</span>
            </label>
            {isBPH ? (
              <input
                type="text"
                readOnly
                value={form.jabatan}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm focus:outline-none cursor-not-allowed font-semibold"
              />
            ) : allowedJabatans.length === 1 ? (
              <input
                type="text"
                readOnly
                value={form.jabatan}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm focus:outline-none cursor-not-allowed"
              />
            ) : (
              <select
                value={form.jabatan}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    jabatan: val,
                    bidang_id: ["Ketua Bidang", "Sekretaris Bidang", "Ketua Divisi", "Anggota"].includes(val) ? prev.bidang_id : "",
                    divisi_id: ["Ketua Divisi", "Anggota"].includes(val) ? prev.divisi_id : "",
                  }));
                }}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="">Pilih jabatan</option>
                {allowedJabatans.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            )}
          </div>

          {/* Bidang (jika jabatan membutuhkan bidang) */}
          {showBidang && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Bidang Induk <span className="text-red-500">*</span>
              </label>
              <select
                value={form.bidang_id}
                onChange={(e) => setForm({ ...form, bidang_id: e.target.value, divisi_id: "" })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="">Pilih bidang induk</option>
                {selectableBidang.map((b) => (
                  <option key={b.id} value={b.id}>{b.nama_bidang}</option>
                ))}
              </select>
            </div>
          )}

          {/* Divisi (jika jabatan divisi/anggota dan bidang sudah dipilih serta divisi terdaftar) */}
          {showDivisi && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Divisi {form.jabatan === "Ketua Divisi" && <span className="text-red-500">*</span>}
              </label>
              <select
                value={form.divisi_id}
                onChange={(e) => setForm({ ...form, divisi_id: e.target.value })}
                required={form.jabatan === "Ketua Divisi"}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                <option value="">Pilih divisi</option>
                {divisiList
                  .filter((d) => d.bidang_id === Number(form.bidang_id))
                  .map((d) => (
                    <option key={d.id} value={d.id}>{d.nama_divisi}</option>
                  ))}
              </select>
            </div>
          )}

          {/* Angkatan */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Angkatan
            </label>
            <input
              type="text"
              value={form.angkatan}
              onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
              placeholder="contoh: 2023"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <><RiCheckLine size={16} /> Simpan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Komponen: Modal Form Bidang (Tanpa input urutan)
// ─────────────────────────────────────────────
const BidangModal = ({ bidang, onClose, onSaved, token }) => {
  const [nama, setNama] = useState(bidang?.nama_bidang || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
        "Content-Type": "application/json",
      };
      const payload = { nama_bidang: nama };

      if (bidang?.id) {
        await axios.put(`${BASE_API_URL}/api/admin/struktur/bidang/${bidang.id}`, payload, { headers });
      } else {
        await axios.post(`${BASE_API_URL}/api/admin/struktur/bidang`, payload, { headers });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {bidang?.id ? "Edit Bidang" : "Tambah Bidang"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <RiCloseLine size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Nama Bidang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="contoh: Hubungan Masyarakat (HUMAS)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Menyimpan..." : <><RiCheckLine size={16} /> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Komponen: Modal Form Divisi (Tanpa input urutan)
// ─────────────────────────────────────────────
const DivisiModal = ({ divisi, bidangList, onClose, onSaved, token }) => {
  const [namaDivisi, setNamaDivisi] = useState(divisi?.nama_divisi || "");
  const [bidangId, setBidangId] = useState(divisi?.bidang_id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
        "Content-Type": "application/json",
      };
      const payload = {
        nama_divisi: namaDivisi,
        bidang_id: Number(bidangId),
      };

      if (divisi?.id) {
        await axios.put(`${BASE_API_URL}/api/admin/struktur/divisi/${divisi.id}`, payload, { headers });
      } else {
        await axios.post(`${BASE_API_URL}/api/admin/struktur/divisi`, payload, { headers });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {divisi?.id ? "Edit Divisi" : "Tambah Divisi"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <RiCloseLine size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Nama Divisi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaDivisi}
              onChange={(e) => setNamaDivisi(e.target.value)}
              required
              placeholder="contoh: Divisi Media & Kreatif"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Bidang Induk <span className="text-red-500">*</span>
            </label>
            <select
              value={bidangId}
              onChange={(e) => setBidangId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="">Pilih bidang induk</option>
              {bidangList.map((b) => (
                <option key={b.id} value={b.id}>{b.nama_bidang}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Menyimpan..." : <><RiCheckLine size={16} /> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Komponen: Modal Import Excel/CSV
// ─────────────────────────────────────────────
const ImportModal = ({ importType, onClose, onSaved, token }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadTemplate = () => {
    let templateData = [];
    let filename = "";
    if (importType === "inti") {
      templateData = [
        ["Nama Lengkap", "Angkatan", "Bidang Induk", "Jabatan"],
        ["Rian Wijaya", "2023", "Hubungan Masyarakat (HUMAS)", "Ketua Bidang"],
        ["Siti Aminah", "2024", "Pengembangan Sumber Daya Mahasiswa (PSDM)", "Sekretaris Bidang"]
      ];
      filename = "template_import_pengurus_inti.xlsx";
    } else if (importType === "pengurus_bidang") {
      templateData = [
        ["Nama Lengkap", "Angkatan", "Bidang Induk", "Divisi"],
        ["Andi Saputra", "2023", "Pembinaan Anggota & Organisasi (PAO)", "Divisi Kaderisasi"]
      ];
      filename = "template_import_pengurus_bidang.xlsx";
    } else {
      templateData = [
        ["Nama Lengkap", "Angkatan", "Bidang Induk", "Divisi"],
        ["Jos Gilbert", "2023", "Hubungan Masyarakat (HUMAS)", "Divisi Media & Kreatif"],
        ["Rian Wijaya", "2024", "Pengembangan Sumber Daya Mahasiswa (PSDM)", ""]
      ];
      filename = "template_import_anggota.xlsx";
    }
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Import");
    XLSX.writeFile(wb, filename);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (data.length === 0) {
          setError("File Excel kosong");
          return;
        }

        const headers = data[0].map(h => String(h || "").trim().toLowerCase());
        const namaIdx = headers.findIndex(h => h.includes('nama'));
        const angkatanIdx = headers.findIndex(h => h.includes('angkatan'));
        const bidangIdx = headers.findIndex(h => h.includes('bidang'));
        const divisiIdx = headers.findIndex(h => h.includes('divisi'));
        const jabatanIdx = headers.findIndex(h => h.includes('jabatan'));

        if (namaIdx === -1) {
          setError("Kolom 'Nama' tidak ditemukan di baris pertama Excel/CSV. Gunakan template standar.");
          return;
        }

        if (importType === "inti" && jabatanIdx === -1) {
          setError("Kolom 'Jabatan' tidak ditemukan. Untuk Pengurus Inti, kolom 'Jabatan' wajib diisi (Ketua Bidang atau Sekretaris Bidang).");
          return;
        }

        const parsedRows = data.slice(1).map(row => {
          let rowJabatan = "Anggota";
          if (importType === "inti") {
            rowJabatan = row[jabatanIdx] ? String(row[jabatanIdx]).trim() : "";
          } else if (importType === "pengurus_bidang") {
            rowJabatan = "Ketua Divisi";
          }

          return {
            nama: namaIdx !== -1 && row[namaIdx] ? String(row[namaIdx]).trim() : "",
            angkatan: angkatanIdx !== -1 && row[angkatanIdx] ? String(row[angkatanIdx]).trim() : "",
            bidang_name: bidangIdx !== -1 && row[bidangIdx] ? String(row[bidangIdx]).trim() : "",
            divisi_name: divisiIdx !== -1 && row[divisiIdx] ? String(row[divisiIdx]).trim() : "",
            jabatan: rowJabatan
          };
        }).filter(row => row.nama !== "");

        // Validasi jabatan untuk Pengurus Inti
        if (importType === "inti") {
          const invalidRoleRow = parsedRows.find(r => !["Ketua Bidang", "Sekretaris Bidang"].includes(r.jabatan));
          if (invalidRoleRow) {
            setError(`Jabatan "${invalidRoleRow.jabatan}" tidak diizinkan. Hanya boleh "Ketua Bidang" atau "Sekretaris Bidang" (BPH diisi manual).`);
            return;
          }
        }

        if (parsedRows.length === 0) {
          setError("Tidak ada data anggota/pengurus valid yang terbaca");
        } else {
          setPreviewData(parsedRows);
        }
      } catch (err) {
        setError("Gagal membaca file Excel. Pastikan formatnya benar.");
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleSubmit = async () => {
    if (previewData.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
        "Content-Type": "application/json",
      };
      await axios.post(
        `${BASE_API_URL}/api/admin/struktur/pengurus/import`,
        { members: previewData },
        { headers }
      );
      alert(`${previewData.length} orang pengurus/anggota berhasil diimport!`);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengunggah data ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-white font-[Poppins]">
            Import {importType === "inti" ? "Pengurus Inti" : importType === "pengurus_bidang" ? "Pengurus Bidang (Kadiv)" : "Anggota"} dari Excel/CSV
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <RiCloseLine size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-grow">
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Gunakan Template Standar</h4>
              <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-0.5">Unduh template Excel untuk melihat struktur kolom yang diperlukan.</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Unduh Template Excel
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <RiUploadCloud2Line size={32} className="text-gray-400 dark:text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {file ? file.name : "Pilih file Excel atau CSV"}
            </span>
            <span className="text-xs text-gray-400 mt-1">Maksimal file size 5MB</span>
          </div>

          {previewData.length > 0 && (
            <div className="flex-grow flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview Data ({previewData.length} orang)</h4>
              <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400">Nama</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400 w-20">Angkatan</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400">Jabatan</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400">Bidang</th>
                      {importType !== "inti" && <th className="text-left px-4 py-2 font-semibold text-gray-500 dark:text-gray-400">Divisi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {previewData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{row.nama}</td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{row.angkatan || "—"}</td>
                        <td className="px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold">{row.jabatan}</td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{row.bidang_name || "—"}</td>
                        {importType !== "inti" && <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{row.divisi_name || "—"}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || previewData.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Mengimpor..." : <><RiCheckLine size={16} /> Konfirmasi & Simpan</>}
          </button>
        </div>
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
      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Konfirmasi Hapus</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Yakin ingin menghapus <span className="font-medium text-gray-700 dark:text-gray-200">{label}</span>? Tindakan ini tidak bisa dibatalkan.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-colors border border-transparent"
        >
          {loading ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Halaman Utama: StrukturAdmin
// ─────────────────────────────────────────────
export default function StrukturAdmin() {
  const { showToast, showUndoToast } = useToast();
  const auth = useSelector(selectAuthData);
  const token = auth?.token;

  const [struktur, setStruktur] = useState(null);
  const [globalPeriode, setGlobalPeriode] = useState("");
  const [savePeriodeLoading, setSavePeriodeLoading] = useState(false);
  const [bidangList, setBidangList] = useState([]);
  const [divisiList, setDivisiList] = useState([]);
  const [pengurusList, setPengurusList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: "inti" | "pengurus_bidang" | "anggota"
  const [activeTab, setActiveTab] = useState("inti");
  // Active Sub-Tab (khusus untuk Tab Inti dan Tab Pengurus Bidang)
  const [activeSubTabInti, setActiveSubTabInti] = useState("pengurus"); // "pengurus" | "bidang"
  const [activeSubTabBidang, setActiveSubTabBidang] = useState("pengurus"); // "pengurus" | "divisi"

  // Modals state
  const [pengurusModal, setPengurusModal] = useState(null);
  const [bidangModal, setBidangModal] = useState(null);
  const [divisiModal, setDivisiModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'pengurus'|'bidang'|'divisi'|'all_*', id, label }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(null); // null | 'inti' | 'pengurus_bidang' | 'anggota'

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "P3RT-HMTI-API-KEY": BASE_API_KEY,
  };

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [strRes, bidangRes, divisiRes, pengurusRes] = await Promise.all([
        axios.get(`${BASE_API_URL}/api/struktur`, { headers: { "P3RT-HMTI-API-KEY": BASE_API_KEY } }),
        axios.get(`${BASE_API_URL}/api/admin/struktur/bidang`, { headers: authHeaders }),
        axios.get(`${BASE_API_URL}/api/admin/struktur/divisi`, { headers: authHeaders }),
        axios.get(`${BASE_API_URL}/api/admin/struktur/pengurus`, { headers: authHeaders }),
      ]);
      setStruktur(strRes.data);
      setGlobalPeriode(strRes.data.periode || "2024/2025");
      setBidangList(bidangRes.data);
      setDivisiList(divisiRes.data);
      setPengurusList(pengurusRes.data);
    } catch (e) {
      console.error("Gagal memuat data struktur:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = () => {
    const itemToDelete = deleteTarget;
    setDeleteTarget(null);

    let endpoint = "";
    if (itemToDelete.type === "bidang") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/bidang/${itemToDelete.id}`;
    } else if (itemToDelete.type === "divisi") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/divisi/${itemToDelete.id}`;
    } else if (itemToDelete.type === "all_bidang") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/bidang/all`;
    } else if (itemToDelete.type === "all_divisi") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/divisi/all`;
    } else if (itemToDelete.type === "all_inti") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/pengurus/inti/all`;
    } else if (itemToDelete.type === "all_bidang_pengurus") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/pengurus/bidang/all`;
    } else if (itemToDelete.type === "all_anggota") {
      endpoint = `${BASE_API_URL}/api/admin/struktur/pengurus/anggota/all`;
    } else {
      endpoint = `${BASE_API_URL}/api/admin/struktur/pengurus/${itemToDelete.id}`;
    }

    showUndoToast({
      message: `${itemToDelete.label || "Data"} dihapus`,
      onUndo: () => {
        fetchData();
      },
      onConfirm: async () => {
        try {
          await axios.delete(endpoint, { headers: authHeaders });
        } catch (e) {
          fetchData();
          showToast("Gagal menghapus data dari server", "error");
        }
      },
    });
  };

  const handleSavePeriode = async () => {
    if (!globalPeriode.trim()) {
      alert("Periode tidak boleh kosong!");
      return;
    }
    setSavePeriodeLoading(true);
    try {
      await axios.post(
        `${BASE_API_URL}/api/admin/struktur/periode`,
        { periode: globalPeriode },
        { headers: authHeaders }
      );
      alert("Periode kepengurusan berhasil diperbarui!");
      await fetchData();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal memperbarui periode.");
    } finally {
      setSavePeriodeLoading(false);
    }
  };

  const fotoUrl = (path) => {
    if (!path) return placeholderImg;
    return getImageUrl(path);
  };

  // Pengelompokan Jabatan
  const jabatansInti = ["Ketua Umum", "Sekretaris Umum", "Sekretaris", "Bendahara Umum", "Ketua Bidang", "Sekretaris Bidang"];
  const jabatansBidang = ["Ketua Divisi"];
  const jabatansAnggota = ["Anggota"];

  // static singleton rows untuk Ketum, Sekum, Bendum agar selalu muncul di tabel
  const ketumRecord = pengurusList.find((p) => p.jabatan === "Ketua Umum") || {
    id: "temp-ketum",
    jabatan: "Ketua Umum",
    nama: "—",
    foto: null,
    isPlaceholder: true,
  };

  const sekumRecord = pengurusList.find((p) => ["Sekretaris Umum", "Sekretaris"].includes(p.jabatan)) || {
    id: "temp-sekum",
    jabatan: "Sekretaris Umum",
    nama: "—",
    foto: null,
    isPlaceholder: true,
  };

  const bendumRecord = pengurusList.find((p) => p.jabatan === "Bendahara Umum") || {
    id: "temp-bendum",
    jabatan: "Bendahara Umum",
    nama: "—",
    foto: null,
    isPlaceholder: true,
  };

  const otherInti = pengurusList.filter(
    (p) => ["Ketua Bidang", "Sekretaris Bidang"].includes(p.jabatan)
  );

  const displayInti = [ketumRecord, sekumRecord, bendumRecord, ...otherInti];

  // Penyaringan list pengurus berdasarkan tab aktif
  const filteredPengurus = pengurusList.filter((p) => {
    if (activeTab === "inti") return jabatansInti.includes(p.jabatan);
    if (activeTab === "pengurus_bidang") return jabatansBidang.includes(p.jabatan);
    return jabatansAnggota.includes(p.jabatan);
  });

  // Tentukan options jabatan yang boleh dipilih di form modal
  const allowedJabatans =
    activeTab === "inti"
      ? (pengurusModal?.data ? [pengurusModal.data.jabatan] : ["Ketua Bidang", "Sekretaris Bidang"])
      : activeTab === "pengurus_bidang"
      ? jabatansBidang
      : jabatansAnggota;

  return (
    <div className="max-w-6xl mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Struktur Organisasi</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Kelola data pengurus, bidang, divisi, dan foto anggota HMTI.
          </p>
        </div>
        {/* Tombol Aksi */}
        <div className="flex gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Tombol Hapus Semua (Permanen) */}
          {((activeTab === "inti") ||
            (activeTab === "pengurus_bidang") ||
            (activeTab === "anggota")) && (
            <button
              onClick={() => {
                if (activeTab === "inti") {
                  if (activeSubTabInti === "pengurus") {
                    setDeleteTarget({ type: "all_inti", label: "semua pengurus inti" });
                  } else {
                    setDeleteTarget({ type: "all_bidang", label: "semua bidang" });
                  }
                } else if (activeTab === "pengurus_bidang") {
                  if (activeSubTabBidang === "pengurus") {
                    setDeleteTarget({ type: "all_bidang_pengurus", label: "semua pengurus bidang" });
                  } else {
                    setDeleteTarget({ type: "all_divisi", label: "semua divisi" });
                  }
                } else if (activeTab === "anggota") {
                  setDeleteTarget({ type: "all_anggota", label: "semua anggota" });
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-red-500/20"
            >
              <RiDeleteBinLine size={18} />
              {activeTab === "inti" ? (
                activeSubTabInti === "pengurus" ? "Hapus Semua Pengurus Inti" : "Hapus Semua Bidang"
              ) : activeTab === "pengurus_bidang" ? (
                activeSubTabBidang === "pengurus" ? "Hapus Semua Pengurus Bidang" : "Hapus Semua Divisi"
              ) : (
                "Hapus Semua Anggota"
              )}
            </button>
          )}

          {/* Tombol Import Excel/CSV */}
          {((activeTab === "inti" && activeSubTabInti === "pengurus") ||
            (activeTab === "pengurus_bidang" && activeSubTabBidang === "pengurus") ||
            (activeTab === "anggota")) && (
            <button
              onClick={() => setImportModalOpen(activeTab)}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-green-500/20 cursor-pointer"
            >
              <RiUploadCloud2Line size={18} />
              Import Excel/CSV
            </button>
          )}

          {/* Tombol Tambah Dinamis */}
          <button
            onClick={() => {
              if (activeTab === "inti") {
                if (activeSubTabInti === "pengurus") {
                  setPengurusModal({ data: null });
                } else {
                  setBidangModal({ data: null });
                }
              } else if (activeTab === "pengurus_bidang") {
                if (activeSubTabBidang === "pengurus") {
                  setPengurusModal({ data: null });
                } else {
                  setDivisiModal({ data: null });
                }
              } else {
                setPengurusModal({ data: null });
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-blue-500/30"
          >
            <RiAddLine size={18} />
            {activeTab === "inti" ? (
              activeSubTabInti === "pengurus" ? "Tambah Pengurus Inti" : "Tambah Bidang"
            ) : activeTab === "pengurus_bidang" ? (
              activeSubTabBidang === "pengurus" ? "Tambah Pengurus Bidang" : "Tambah Divisi"
            ) : (
              "Tambah Anggota"
            )}
          </button>
        </div>
      </div>

      {/* Global Periode Editor */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="font-semibold text-sm">P</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">Periode Aktif Kepengurusan</p>
            <p className="text-xs text-gray-400">Semua pengurus akan otomatis disamakan ke periode ini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={globalPeriode}
            onChange={(e) => setGlobalPeriode(e.target.value)}
            placeholder="contoh: 2024/2025"
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-40"
          />
          <button
            onClick={handleSavePeriode}
            disabled={savePeriodeLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            {savePeriodeLoading ? "Menyimpan..." : "Simpan Periode"}
          </button>
        </div>
      </div>

      {/* Tab Navigasi Utama */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
        {[
          { id: "inti", label: "Pengurus Inti" },
          { id: "pengurus_bidang", label: "Pengurus Bidang (Kadiv)" },
          { id: "anggota", label: "Anggota / Staf" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Reset sub-tabs
              if (tab.id === "inti") setActiveSubTabInti("pengurus");
              if (tab.id === "pengurus_bidang") setActiveSubTabBidang("pengurus");
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ============================================= */}
          {/* TAB 1: PENGURUS INTI */}
          {/* ============================================= */}
          {activeTab === "inti" && (
            <div className="flex flex-col gap-6">
              {/* Sub Tabs */}
              <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setActiveSubTabInti("pengurus")}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                    activeSubTabInti === "pengurus"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  Data Pengurus Inti
                </button>
                <button
                  onClick={() => setActiveSubTabInti("bidang")}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                    activeSubTabInti === "bidang"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  Kelola Bidang
                </button>
              </div>

              {activeSubTabInti === "pengurus" ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bidang</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Periode</th>
                          <th className="px-6 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {displayInti.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <img
                                  src={fotoUrl(p.foto)}
                                  alt={p.nama}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = placeholderImg; }}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{p.nama}</td>
                            <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{p.jabatan}</td>
                            <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                              {["Ketua Umum", "Sekretaris Umum", "Sekretaris", "Bendahara Umum"].includes(p.jabatan)
                                ? "—"
                                : (bidangList.find((b) => b.id === p.bidang_id)?.nama_bidang || p.bidang || "—")}
                            </td>
                            <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{p.periode || "—"}</td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => setPengurusModal({ data: p })}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                  title="Edit"
                                >
                                  <RiEditLine size={16} />
                                </button>
                                {!["Ketua Umum", "Sekretaris Umum", "Sekretaris", "Bendahara Umum"].includes(p.jabatan) && !p.isPlaceholder && (
                                  <button
                                    onClick={() => setDeleteTarget({ type: "pengurus", id: p.id, label: p.nama })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="Hapus"
                                  >
                                    <RiDeleteBinLine size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">No</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Bidang</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jumlah Anggota</th>
                          <th className="px-6 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {bidangList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                              Belum ada data bidang.
                            </td>
                          </tr>
                        ) : (
                          bidangList.map((b, idx) => (
                            <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{b.nama_bidang}</td>
                              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                {pengurusList.filter((p) => p.bidang_id === b.id).length} orang
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => setBidangModal({ data: b })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    title="Edit"
                                  >
                                    <RiEditLine size={16} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: "bidang", id: b.id, label: b.nama_bidang })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
            </div>
          )}

          {/* ============================================= */}
          {/* TAB 2: PENGURUS BIDANG (KADIV) */}
          {/* ============================================= */}
          {activeTab === "pengurus_bidang" && (
            <div className="flex flex-col gap-6">
              {/* Sub Tabs */}
              <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-2">
                <button
                  onClick={() => setActiveSubTabBidang("pengurus")}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                    activeSubTabBidang === "pengurus"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  Data Pengurus Bidang (Kadiv)
                </button>
                <button
                  onClick={() => setActiveSubTabBidang("divisi")}
                  className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                    activeSubTabBidang === "divisi"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  Kelola Divisi
                </button>
              </div>

              {activeSubTabBidang === "pengurus" ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bidang / Divisi</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Periode</th>
                          <th className="px-6 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredPengurus.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                              Belum ada data Pengurus Bidang (Kadiv).
                            </td>
                          </tr>
                        ) : (
                          filteredPengurus.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                  <img
                                    src={fotoUrl(p.foto)}
                                    alt={p.nama}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = placeholderImg; }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{p.nama}</td>
                              <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{p.jabatan}</td>
                              <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                                <div>
                                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                                    {bidangList.find((b) => b.id === p.bidang_id)?.nama_bidang || p.bidang || "—"}
                                  </p>
                                  {p.divisi_id && (
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                      {divisiList.find((d) => d.id === p.divisi_id)?.nama_divisi || "—"}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{p.periode || "—"}</td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => setPengurusModal({ data: p })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    title="Edit"
                                  >
                                    <RiEditLine size={16} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: "pengurus", id: p.id, label: p.nama })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">No</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Divisi</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bidang Induk</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jumlah Anggota</th>
                          <th className="px-6 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {divisiList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                              Belum ada data divisi.
                            </td>
                          </tr>
                        ) : (
                          divisiList.map((d, idx) => (
                            <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{d.nama_divisi}</td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                {bidangList.find((b) => b.id === d.bidang_id)?.nama_bidang || "—"}
                              </td>
                              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                {pengurusList.filter((p) => p.divisi_id === d.id).length} orang
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => setDivisiModal({ data: d })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                    title="Edit"
                                  >
                                    <RiEditLine size={16} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: "divisi", id: d.id, label: d.nama_divisi })}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
            </div>
          )}

          {/* ============================================= */}
          {/* TAB 3: ANGGOTA */}
          {/* ============================================= */}
          {activeTab === "anggota" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bidang / Divisi</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Periode</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredPengurus.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                          Belum ada data Anggota / Staf biasa.
                        </td>
                      </tr>
                    ) : (
                      filteredPengurus.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                              <img
                                src={fotoUrl(p.foto)}
                                alt={p.nama}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = placeholderImg; }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">{p.nama}</td>
                          <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{p.jabatan}</td>
                          <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-200">
                                {bidangList.find((b) => b.id === p.bidang_id)?.nama_bidang || p.bidang || "—"}
                              </p>
                              {p.divisi_id && (
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                  {divisiList.find((d) => d.id === p.divisi_id)?.nama_divisi || "—"}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{p.periode || "—"}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => setPengurusModal({ data: p })}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                title="Edit"
                              >
                                <RiEditLine size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: "pengurus", id: p.id, label: p.nama })}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        </>
      )}

      {/* Modals */}
      {pengurusModal && (
        <PengurusModal
          pengurus={pengurusModal.data}
          defaultPeriode={globalPeriode}
          bidangList={bidangList}
          divisiList={divisiList}
          pengurusList={pengurusList}
          allowedJabatans={allowedJabatans}
          onClose={() => setPengurusModal(null)}
          onSaved={fetchData}
          token={token}
        />
      )}

      {bidangModal && (
        <BidangModal
          bidang={bidangModal.data}
          onClose={() => setBidangModal(null)}
          onSaved={fetchData}
          token={token}
        />
      )}

      {divisiModal && (
        <DivisiModal
          divisi={divisiModal.data}
          bidangList={bidangList}
          onClose={() => setDivisiModal(null)}
          onSaved={fetchData}
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

      {importModalOpen && (
        <ImportModal
          importType={importModalOpen}
          onClose={() => setImportModalOpen(null)}
          onSaved={fetchData}
          token={token}
        />
      )}
    </div>
  );
}
