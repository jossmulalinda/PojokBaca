'use client';

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { useSelector } from "react-redux";
import { selectAuthData } from "@/lib/redux/authSlice";
import { useToast } from "@/components/Admin/ToastProvider";
import {
  RiAddLine,
  RiUploadCloud2Line,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
  RiCheckLine,
  RiAlertLine,
  RiDeleteBinLine,
} from "react-icons/ri";

const KATEGORI_OPTIONS = [
  { value: "berita-umum", label: "Informasi" },
  { value: "akademik", label: "Akademik" },
  { value: "kegiatan", label: "Kegiatan" },
  { value: "prestasi", label: "Prestasi" },
];

const getPrettyKategori = (val) => {
  const found = KATEGORI_OPTIONS.find(o => o.value === val);
  return found ? found.label : "Informasi";
};

// ─────────────────────────────────────────────
// Komponen: Modal Form Berita dengan TinyMCE
// ─────────────────────────────────────────────
const BeritaModal = ({ berita, onClose, onSaved, token }) => {
  const [form, setForm] = useState({
    judul: berita?.judul || "",
    konten: berita?.konten || "",
    kategori: berita?.kategori || "berita-umum",
    penulis: berita?.penulis || "Admin HMTI",
    excerpt: berita?.excerpt || "",
    is_published: berita?.id ? (berita.is_published ?? true) : true,
    published_at: berita?.created_at ? new Date(berita.created_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  });
  const [thumbnail, setThumbnail] = useState(null);
  const initialThumbnail = berita?.thumbnail || berita?.gambar;
  const [preview, setPreview] = useState(
    initialThumbnail ? getImageUrl(initialThumbnail) : null
  );
  
  const initialExtras = Array.isArray(berita?.foto_tambahan)
    ? berita.foto_tambahan
    : (typeof berita?.foto_tambahan === 'string'
        ? (() => { try { return JSON.parse(berita.foto_tambahan); } catch { return []; } })()
        : []);

  // Foto Tambahan (Max 2 foto tambahan, Total 3 foto)
  const [fotoTambahan, setFotoTambahan] = useState([]);
  const [previewsTambahan, setPreviewsTambahan] = useState(
    initialExtras.map(f => getImageUrl(f))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  const fileRef = useRef();
  const extraFilesRef = useRef();
  const editorRef = useRef(null);
  const initTimeoutRef = useRef(null);

  const [isDraggingExtra, setIsDraggingExtra] = useState(false);

  const processExtraFiles = (incomingFiles) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    
    // Accumulate existing + new files, max 2
    const combinedFiles = [...fotoTambahan, ...incomingFiles].slice(0, 2);
    const validFiles = [];
    const validPreviews = [];

    for (const f of combinedFiles) {
      if (!allowedTypes.includes(f.type)) {
        setError("Format foto tambahan harus JPG, JPEG, PNG, WEBP, atau AVIF");
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        setError("Ukuran masing-masing foto tambahan maksimal 2MB");
        return;
      }
      validFiles.push(f);
      validPreviews.push(URL.createObjectURL(f));
    }

    setFotoTambahan(validFiles);
    setPreviewsTambahan(validPreviews);
    setError("");
  };

  const handleRemoveExtraPhoto = (indexToRemove, e) => {
    e.stopPropagation();
    const updatedFiles = fotoTambahan.filter((_, idx) => idx !== indexToRemove);
    const updatedPreviews = previewsTambahan.filter((_, idx) => idx !== indexToRemove);
    setFotoTambahan(updatedFiles);
    setPreviewsTambahan(updatedPreviews);
  };

  const isDuplicateExtra = fotoTambahan.length === 2 && (
    fotoTambahan[0].name === fotoTambahan[1].name && fotoTambahan[0].size === fotoTambahan[1].size
  );

  const handleExtraPhotosChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) processExtraFiles(selectedFiles);
  };

  const handleExtraDragOver = (e) => {
    e.preventDefault();
    setIsDraggingExtra(true);
  };

  const handleExtraDragLeave = () => {
    setIsDraggingExtra(false);
  };

  const handleExtraDrop = (e) => {
    e.preventDefault();
    setIsDraggingExtra(false);
    const selectedFiles = Array.from(e.dataTransfer.files);
    if (selectedFiles.length > 0) processExtraFiles(selectedFiles);
  };

  // Dynamic TinyMCE Script Loading
  useEffect(() => {
    if (window.tinymce) {
      setEditorLoaded(true);
      initEditor();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js";
      script.referrerPolicy = "origin";
      script.onload = () => {
        setEditorLoaded(true);
        initEditor();
      };
      document.body.appendChild(script);
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (window.tinymce) {
        window.tinymce.remove("#tinymce-editor");
        try {
          window.tinymce.remove();
        } catch (e) {
          console.error("Error removing tinymce", e);
        }
      }
      // Remove any leftover TinyMCE UI containers (toolbars, dialogs)
      const auxContainers = document.querySelectorAll(".tox-tinymce-aux");
      auxContainers.forEach((container) => container.remove());
    };
  }, []);

  const initEditor = () => {
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }
    initTimeoutRef.current = setTimeout(() => {
      if (window.tinymce) {
        window.tinymce.remove("#tinymce-editor");
        
        const isDark = document.documentElement.classList.contains('dark');
        
        window.tinymce.init({
          selector: "#tinymce-editor",
          height: 320,
          skin: isDark ? 'oxide-dark' : 'oxide',
          content_css: isDark ? 'dark' : 'default',
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'wordcount', 'help'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image media table | help',
          content_style: 'body { font-family:Poppins,Helvetica,Arial,sans-serif; font-size:14px; line-height: 1.6; }',
          setup: (editor) => {
            editorRef.current = editor;
            editor.on('change', () => {
              setForm(prev => ({ ...prev, konten: editor.getContent() }));
            });
            editor.on('init', () => {
              editor.setContent(berita?.konten || "");
            });
          }
        });
      }
    }, 150);
  };

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
      processThumbnailFile(file);
    }
  };

  const processThumbnailFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format gambar harus JPG, JPEG, PNG, WEBP, atau AVIF");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2MB");
      return;
    }

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processThumbnailFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Ambil konten dari editor jika instance terdeteksi
    const finalContent = editorRef.current ? editorRef.current.getContent() : form.konten;
    if (!finalContent || finalContent.trim() === "") {
      setError("Isi artikel wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("judul", form.judul);
      fd.append("konten", finalContent);
      fd.append("kategori", form.kategori);
      fd.append("penulis", form.penulis);
      fd.append("is_published", form.is_published ? "1" : "0");
      if (form.published_at) {
        fd.append("published_at", form.published_at);
      }
      
      // Auto-generate 15-word excerpt
      const cleanText = finalContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      const words = cleanText.split(/\s+/);
      const autoExcerpt = words.slice(0, 15).join(" ") + (words.length > 15 ? "..." : "");
      fd.append("excerpt", autoExcerpt);
      
      if (thumbnail) {
        fd.append("thumbnail", thumbnail);
      }

      if (fotoTambahan.length > 0) {
        fotoTambahan.forEach((file) => {
          fd.append("foto_tambahan[]", file);
        });
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "P3RT-HMTI-API-KEY": BASE_API_KEY,
      };

      if (berita?.id) {
        fd.append("_method", "PUT");
        await axios.post(
          `${BASE_API_URL}/api/admin/berita/${berita.id}`,
          fd,
          { headers }
        );
      } else {
        await axios.post(`${BASE_API_URL}/api/admin/berita`, fd, { headers });
      }
      onSaved(
        form.is_published
          ? (berita?.id ? "Artikel berita berhasil diperbarui dan dipublikasikan!" : "🎉 Artikel berita berhasil dipublikasikan ke publik!")
          : (berita?.id ? "Artikel berita berhasil diperbarui sebagai draf." : "Artikel berita disimpan sebagai draf.")
      );
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-150 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-800/20">
          <h3 className="font-bold text-gray-800 dark:text-white">
            {berita?.id ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: Upload thumbnail & additional photos */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Foto Utama Sampul <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                    Rasio 16:9 (1280x720px)
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
                    <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-gray-950 p-2">
                      <img
                        src={preview}
                        alt="Preview thumbnail"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <RiUploadCloud2Line size={24} className="text-white animate-bounce" />
                        <span className="text-xs text-white ml-2 font-medium">Ganti Sampul</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-3">
                      <RiUploadCloud2Line size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">Foto Sampul Utama</p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WEBP, AVIF</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </div>

              {/* Foto Tambahan (Opsional, Maks 2 Foto lagi - Total 3) */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Foto Tambahan
                  </label>
                  {isDuplicateExtra ? (
                    <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 dark:border-amber-800 animate-pulse">
                      <RiAlertLine size={12} /> 2/2 Foto (Identik/Sama!)
                    </span>
                  ) : previewsTambahan.length === 2 ? (
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                      <RiCheckLine size={12} /> 2/2 Foto (Berbeda/Penuh)
                    </span>
                  ) : previewsTambahan.length === 1 ? (
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                      1/2 Foto Terpilih
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400">
                      Maks 2 Foto
                    </span>
                  )}
                </div>

                <div
                  onClick={() => {
                    if (previewsTambahan.length < 2) {
                      extraFilesRef.current.click();
                    }
                  }}
                  onDragOver={handleExtraDragOver}
                  onDragLeave={handleExtraDragLeave}
                  onDrop={handleExtraDrop}
                  className={`border-2 border-dashed rounded-xl p-3 transition-all text-center ${
                    isDuplicateExtra
                      ? "border-amber-400 dark:border-amber-600 bg-amber-50/20 dark:bg-amber-950/20"
                      : previewsTambahan.length === 2
                      ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20"
                      : isDraggingExtra
                      ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/20 scale-[1.02]"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-blue-400 cursor-pointer"
                  }`}
                >
                  {previewsTambahan.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {previewsTambahan.map((src, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={src} alt={`Extra ${idx+1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Foto {idx + 1}
                            </span>
                            {/* Tombol Hapus Foto Individu */}
                            <button
                              type="button"
                              onClick={(e) => handleRemoveExtraPhoto(idx, e)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md cursor-pointer"
                              title="Hapus foto ini"
                            >
                              <RiCloseLine size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {isDuplicateExtra ? (
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/50 py-1 px-2 rounded-md flex items-center justify-center gap-1">
                          <RiAlertLine size={13} /> Foto 1 & Foto 2 adalah berkas gambar yang persis sama!
                        </p>
                      ) : previewsTambahan.length === 2 ? (
                        <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          ✓ 2 foto berbeda terpilih. Klik (X) pada foto jika ingin menghapus.
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            extraFilesRef.current.click();
                          }}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer py-1"
                        >
                          + Tambah 1 Foto Lagi (Foto 2)
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <RiUploadCloud2Line size={20} className="text-gray-400 mb-1" />
                      <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">+ Tambah Foto Lain</span>
                      <span className="text-[9px] text-gray-400">Opsional (Maksimal 2 foto)</span>
                    </div>
                  )}
                </div>

                <input
                  ref={extraFilesRef}
                  type="file"
                  multiple
                  accept="image/jpg,image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={handleExtraPhotosChange}
                />
              </div>
            </div>

            {/* Right side: News forms */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Status Publikasi / Draf Switch */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div>
                  <p className="text-xs font-extrabold text-gray-800 dark:text-white">Status Publikasi Berita</p>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    {form.is_published ? "🟢 Langsung Terbit & Tampil di Website Publik" : "🟡 Simpan sebagai Draf (Hanya terlihat di Admin)"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-gray-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Tanggal Rilis & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-semibold"
                  >
                    {KATEGORI_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="text-gray-805 dark:text-black">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Tanggal Rilis / Histori
                  </label>
                  <input
                    type="datetime-local"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                  placeholder="Masukkan judul berita"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Konten Utama TinyMCE */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Isi Artikel <span className="text-red-500">*</span>
            </label>
            {!editorLoaded && (
              <div className="w-full h-80 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl border border-gray-200 dark:border-gray-750 flex items-center justify-center text-xs text-gray-400 font-semibold">
                Membuat Microsoft Word WYSIWYG Editor...
              </div>
            )}
            <div className={editorLoaded ? "block" : "hidden"}>
              <textarea id="tinymce-editor" defaultValue={form.konten} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 border-t border-gray-100 dark:border-gray-850 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-250 dark:border-gray-750 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? "Menyimpan..." : "SIMPAN"}
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-150 dark:border-gray-850 p-6 text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Hapus Artikel</h3>
        <p className="text-sm text-gray-550 dark:text-gray-400 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus artikel <strong>"{title}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-250 dark:border-gray-750 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-650 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-md shadow-red-500/20"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Halaman Utama: Kelola Berita
// ─────────────────────────────────────────────
export default function BeritaAdmin() {
  const { showToast, showUndoToast } = useToast();
  const [beritaList, setBeritaList] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [beritaModal, setBeritaModal] = useState(null); // null atau { ...data }
  const [deleteTarget, setDeleteTarget] = useState(null); // null atau { id, judul }
  const [deleting, setDeleting] = useState(false);
  const auth = useSelector(selectAuthData);

  const fetchBerita = async (page = 1) => {
    setLoading(true);
    try {
      // Endpoint admin/berita
      const response = await axios.get(
        `${BASE_API_URL}/api/admin/berita?page=${page}&per_page=10&q=${search}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "P3RT-HMTI-API-KEY": BASE_API_KEY,
          },
        }
      );
      
      const payload = response.data;
      setBeritaList(payload?.data || []);
      setPagination({
        current_page: payload?.current_page || 1,
        last_page: payload?.last_page || 1,
        from: payload?.from || 0,
        to: payload?.to || 0,
        total: payload?.total || 0,
        per_page: payload?.per_page || 10
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchBerita(1);
    }
  }, [auth]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchBerita(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Trigger search on typing stop
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (auth?.token) {
        fetchBerita(1);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handlePublishToggle = async (beritaItem) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/admin/berita/${beritaItem.id}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "P3RT-HMTI-API-KEY": BASE_API_KEY,
          },
        }
      );
      const isPublishedNow = response.data?.is_published;
      showToast(
        isPublishedNow
          ? `🎉 Artikel "${beritaItem.judul}" berhasil dipublikasikan ke website!`
          : `Artikel "${beritaItem.judul}" di-unpublish ke draf.`,
        isPublishedNow ? "success" : "info"
      );
      fetchBerita(pagination.current_page);
    } catch (err) {
      showToast("Gagal memperbarui status publikasi artikel", "error");
    }
  };

  const handleDelete = () => {
    const itemToDelete = deleteTarget;
    setDeleteTarget(null);

    // Optimistically remove from state
    setBeritaList((prev) => prev.filter((b) => b.id !== itemToDelete.id));

    showUndoToast({
      message: `Artikel "${itemToDelete.judul}" dihapus`,
      onUndo: () => {
        fetchBerita(pagination.current_page);
      },
      onConfirm: async () => {
        try {
          await axios.delete(`${BASE_API_URL}/api/admin/berita/${itemToDelete.id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "P3RT-HMTI-API-KEY": BASE_API_KEY,
            },
          });
        } catch (err) {
          fetchBerita(pagination.current_page);
          showToast("Gagal menghapus berita", "error");
        }
      },
    });
  };

  // Generate pagination pages array
  const renderPaginationPages = () => {
    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => fetchBerita(i)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
            pagination.current_page === i
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Berita</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Tulis dan kelola artikel berita HMTI dengan WYSIWYG editor.
          </p>
        </div>
        <button
          onClick={() => setBeritaModal({})}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 self-start transition-all"
        >
          <RiAddLine size={18} />
          Tulis Berita
        </button>
      </div>

      {/* Top controls: Search */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-t-2xl px-6 py-4 flex justify-between items-center shadow-sm">
        <div />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Search:</span>
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={handleSearchChange}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
          />
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800 w-full flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : beritaList.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada artikel berita.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-y border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-400">
                  <th className="px-6 py-3.5 w-16">No</th>
                  <th className="px-6 py-3.5 w-20">Sampul</th>
                  <th className="px-6 py-3.5">Judul</th>
                  <th className="px-6 py-3.5 w-44">Kategori</th>
                  <th className="px-6 py-3.5 w-36 text-center">Proses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-xs font-medium text-gray-800 dark:text-gray-300">
                {beritaList.map((beritaItem, index) => {
                  const noIndex = (pagination.current_page - 1) * pagination.per_page + index + 1;

                  return (
                    <tr key={beritaItem.id} className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-colors">
                      {/* Index No */}
                      <td className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">
                        {noIndex}
                      </td>
                      {/* Sampul Preview */}
                      <td className="px-6 py-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                          <img
                            src={getImageUrl(beritaItem.thumbnail || beritaItem.gambar)}
                            alt={beritaItem.judul}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-6 py-4 leading-relaxed font-semibold text-gray-900 dark:text-white">
                        {beritaItem.judul}
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-600 dark:text-gray-400">
                        {getPrettyKategori(beritaItem.kategori)}
                      </td>
                      {/* Actions / Process */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          {/* Publish/Draft toggle */}
                          <button
                            onClick={() => handlePublishToggle(beritaItem)}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded cursor-pointer transition-colors border ${
                              beritaItem.is_published
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-500/25 hover:bg-emerald-100"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-500/25 hover:bg-amber-100"
                            }`}
                            title={beritaItem.is_published ? "Ubah ke Draf" : "Publikasikan Artikel"}
                          >
                            {beritaItem.is_published ? "PUBLISHED" : "DRAFT"}
                          </button>
                          
                          {/* EDIT Button */}
                          <button
                            onClick={() => setBeritaModal(beritaItem)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded transition-colors"
                          >
                            EDIT
                          </button>
                          
                          {/* HAPUS Button */}
                          <button
                            onClick={() => setDeleteTarget({ id: beritaItem.id, judul: beritaItem.judul })}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded transition-colors"
                          >
                            HAPUS
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

      {/* Footer controls: showing entries and pagination */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Showing {pagination.from} to {pagination.to} of {pagination.total} entries
        </div>

        {pagination.last_page > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => fetchBerita(pagination.current_page - 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {renderPaginationPages()}
            </div>
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchBerita(pagination.current_page + 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900 disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal Form Add/Edit */}
      {beritaModal && (
        <BeritaModal
          berita={beritaModal.id ? beritaModal : null}
          token={auth.token}
          onClose={() => setBeritaModal(null)}
          onSaved={(msg) => {
          fetchBerita(pagination.current_page);
          if (msg) showToast(msg, "success");
        }}
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
