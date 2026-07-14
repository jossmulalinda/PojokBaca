'use client';

import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/lib/api";
import dynamic from "next/dynamic";

const MyMap = dynamic(() => import("@/components/MyMaps"), {
  ssr: false,
});

const SocialCard = () => {
  return (
    <div className="flex justify-start my-6">
      <div className="social-card-wrapper">
        <div className="card">
          <span>Social Media</span>
          <a className="social-link" href="https://www.youtube.com/@hmti_unkhair" target="_blank" rel="noopener noreferrer">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.001 461.001" className="h-6 w-6">
              <path style={{fill: '#F61C0D'}} d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z" />
            </svg>
          </a>
          <a className="social-link" href="https://www.tiktok.com/@hmti_unkhair" target="_blank" rel="noopener noreferrer">
            <svg fill="#000000" viewBox="0 0 512 512" id="icons" className="h-6 w-6">
              <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
            </svg>
          </a>
          <a className="social-link" href="https://www.facebook.com/share/tY5yzZb1U55xiAMq/" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a className="social-link" href="https://www.instagram.com/hmti_unkhair" target="_blank" rel="noopener noreferrer">
            {/* Instagram icon */}
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="url(#igGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="url(#igGrad)" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
      
      <style jsx="true">{`
        /* ── Card wrapper ──────────────────────────────────────── */
        .social-card-wrapper .card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.18);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          height: 50px;
          width: 225px;
          border-radius: 12px;
          border: 1px solid rgba(18, 107, 241, 0.15);
        }

        /* ── Two cover halves (default: cover the icons) ───────── */
        .social-card-wrapper .card::before,
        .social-card-wrapper .card::after {
          position: absolute;
          content: "";
          display: flex;
          align-items: center;
          width: 50%;
          height: 100%;
          transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: 2;           /* above icons (z-index: 1) */
        }

        .social-card-wrapper .card::before {
          left: 0;
          justify-content: flex-end;
          background-color: #126BF1;  /* HMTI good-blue */
        }

        .social-card-wrapper .card::after {
          right: 0;
          justify-content: flex-start;
          background-color: #0d52c4;  /* slightly darker HMTI blue */
        }

        /* ── Hover: slide covers away ──────────────────────────── */
        .social-card-wrapper .card:hover {
          box-shadow: 0 14px 28px rgba(18,107,241,0.25), 0 10px 10px rgba(0,0,0,0.3);
        }

        .social-card-wrapper .card:hover::before {
          transform: translateY(-100%);
        }

        .social-card-wrapper .card:hover::after {
          transform: translateY(100%);
        }

        /* ── Text label (default: visible above covers) ────────── */
        .social-card-wrapper .card span {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          opacity: 1;
          transition: opacity 0.2s ease;
          z-index: 3;           /* above both covers */
          letter-spacing: 2px;
          pointer-events: none;
        }

        /* ── Hover: fade out label ─────────────────────────────── */
        .social-card-wrapper .card:hover span {
          opacity: 0;
        }

        /* ── Social icon links (default: HIDDEN behind covers) ─── */
        .social-card-wrapper .card .social-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25%;
          height: 100%;
          text-decoration: none;
          transition: background-color 0.2s ease, opacity 0.3s ease;
          z-index: 1;           /* behind covers (z-index: 2) */
          opacity: 0;           /* fully hidden until hover */
          background-color: #ffffff;
        }

        /* ── Hover: reveal icons ───────────────────────────────── */
        .social-card-wrapper .card:hover .social-link {
          opacity: 1;
        }

        .social-card-wrapper .card .social-link svg {
          transition: transform 0.2s ease;
        }

        .social-card-wrapper .card .social-link:hover {
          background-color: rgba(18, 107, 241, 0.15);
          animation: bounce_613 0.4s linear;
        }

        .social-card-wrapper .card .social-link:hover svg {
          transform: scale(1.2);
        }

        @keyframes bounce_613 {
          40% { transform: scale(1.4); }
          60% { transform: scale(0.8); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1);  }
        }
      `}</style>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subject: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      message: "Contact Form Submission",
      kontak: {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: 0,
      },
    };

    try {
      const response = await axios.post(`${BASE_API_URL}/api/kontak`, payload);
      if (response.status === 200) {
        setFormData({
          nama: "",
          email: "",
          subject: "",
          pesan: "",
        });
        alert("Pesan berhasil dikirim!");
      } else {
        setError("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Error while sending message:", err);
      if (err.response) {
        setError(`Kesalahan: ${err.response.data.message || err.message}`);
      } else {
        setError("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow min-h-screen flex justify-center items-center py-10">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Image & Map */}
        <div className="flex flex-col gap-8 justify-center animate-fade-in">
          <div className="flex justify-center items-center">
            <img
              src="/assets/img/contact.gif"
              alt="Contact"
              className="max-w-full h-auto object-contain bg-transparent select-none pointer-events-none"
            />
          </div>
          {/* Map Container */}
          <div className="w-full flex flex-col items-start">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=0.776036,127.374373" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-start text-left mb-2 cursor-pointer"
            >
              <p className="text-xs uppercase font-extrabold tracking-widest text-blue-600 group-hover:text-blue-700 transition-colors font-heading flex items-center gap-1.5">
                <span>Lokasi Sekretariat HMTI (Buka di Google Maps)</span>
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </p>
            </a>
            <MyMap />
            <a 
              href="https://www.google.com/maps/search/?api=1&query=0.776036,127.374373" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed hover:text-blue-500 hover:underline transition-all cursor-pointer block"
            >
              📍 Kampus II Unkhair, Jl. Jati Metro, Jati, Kec. Ternate Sel., Kota Ternate, Maluku Utara
            </a>
          </div>
        </div>

        {/* Right Column: Form Section */}
        <div className="flex flex-col p-6 md:p-8 bg-white dark:bg-[#0c1220]/45 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none h-fit md:self-start">
          <p className="text-sm uppercase font-extrabold tracking-widest text-blue-600 mb-1 font-heading">
            Informatika Tetap Satu
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
            Hubungi Kami
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk mengirimkan pesan kepada kami.
          </p>
          
          <SocialCard />

          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama Anda"
                  className="w-full bg-slate-50/50 dark:bg-[#0f172a]/55 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Anda"
                  className="w-full bg-slate-50/50 dark:bg-[#0f172a]/55 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Subjek / Perihal</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subjek pesan"
                className="w-full bg-slate-50/50 dark:bg-[#0f172a]/55 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pesan / Deskripsi</label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                placeholder="Tuliskan detail pesan Anda..."
                className="w-full bg-slate-50/50 dark:bg-[#0f172a]/55 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 resize-none h-36 custom-scrollbar"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 cursor-pointer flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  <span>Kirim Pesan</span>
                </>
              )}
            </button>

            {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
