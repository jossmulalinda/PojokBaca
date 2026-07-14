# Design Documentation — HMTI Unkhair Website

> Dokumentasi desain resmi untuk website **HMTI Universitas Khairun** berbasis Next.js.
> File ini menjelaskan design system, struktur komponen, arsitektur halaman, dan keputusan desain yang diambil selama pengembangan.

---

## 📋 Daftar Isi

1. [Tech Stack](#tech-stack)
2. [Design System](#design-system)
   - [Palet Warna](#palet-warna)
   - [Tipografi](#tipografi)
   - [Animasi & Transisi](#animasi--transisi)
3. [Struktur Halaman (Routing)](#struktur-halaman-routing)
4. [Struktur Komponen](#struktur-komponen)
5. [Dark Mode](#dark-mode)
6. [Arsitektur State Management](#arsitektur-state-management)
7. [Utilitas & Library](#utilitas--library)
8. [Keputusan Desain](#keputusan-desain)

---

## Tech Stack

| Kategori         | Teknologi                              |
|------------------|----------------------------------------|
| Framework        | Next.js 16.2.9 (App Router)            |
| UI Library       | React 19                               |
| Styling          | Tailwind CSS v4                        |
| Animasi          | Framer Motion, GSAP, AOS              |
| State Management | Redux Toolkit + React Redux            |
| Icon Library     | Phosphor Icons, React Icons, FontAwesome, Heroicons |
| Maps             | Leaflet + React Leaflet                |
| HTTP Client      | Axios                                  |
| Tema             | next-themes (Dark/Light mode)          |
| Utility          | clsx, xlsx, react-loading-skeleton     |

---

## Design System

### Palet Warna

Warna utama didefinisikan di `tailwind.config.js` dan `app/globals.css`:

| Token             | Hex        | Penggunaan                                 |
|-------------------|------------|--------------------------------------------|
| `good-blue`       | `#126BF1`  | Warna utama (CTA, tombol, aksen aktif)     |
| `dark-blue`       | `#162741`  | Background gelap, header                   |
| `bad-blue`        | `#072D66`  | Background section dark, footer            |
| `light-blue`      | `#E8EEF8`  | Background section terang, border          |
| `white` (custom)  | `#FAF9F6`  | Warna teks & background utama light mode   |

**Dark mode overrides (Deep Tech Navy Theme):**
- **Background Utama:** `#080c14` (Midnight Space Blue)
- **Glassmorphic Card:** `rgba(15, 23, 42, 0.45)` (Deep Navy Slate)
- **Subtle Card Border:** `rgba(59, 130, 246, 0.15)` (Electric Blue Glow)
- **Teks Utama:** `#f8fafc`
- **Teks Deskripsi/Sekunder:** `#94a3b8`
- **Aksen Biru:** `#3b82f6` (Lebih kontras dan terang dari `good-blue`)
- **Ambient Glow Blobs:** 2 bulatan besar blur (`blur-[130px]`) berwarna biru & indigo di background `fixed` untuk efek kedalaman.

---

### Tipografi

| Font               | Penggunaan                                  |
|--------------------|---------------------------------------------|
| **Poppins**        | Font utama — semua elemen body & UI         |
| **Plus Jakarta Sans** | Font heading — `h1` s/d `h6`, `.font-heading` |

Diimport langsung dari **Google Fonts** di `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:...');
```

**Skala teks dan kelas khusus:**
- `.text-border` — outline teks berwarna `#8FB6EF` (1px stroke)
- `.text-border-2` — outline teks berwarna `#E8EEF8` (1.5px stroke)
- Di dark mode, elemen outline otomatis menjadi transparan agar tetap konsisten.

---

### Animasi & Transisi

| Nama               | Konfigurasi                             | Library        |
|--------------------|-----------------------------------------|----------------|
| `slideup`          | `translateY(100% → 0)`, 0.2s ease-out  | Tailwind CSS   |
| Marquee (partners) | Infinite scroll horizontal, 30s linear | Custom CSS      |
| Scroll Animations  | Fade-in, slide, zoom saat scroll        | AOS            |
| Page Transitions   | Animasi antar halaman/komponen          | Framer Motion  |
| Complex Animations | Timeline, stagger, morphing             | GSAP           |

**Marquee (Partners Section):**
- Berjalan otomatis ke kiri secara infinite
- Pause saat di-hover
- Tepi kiri/kanan di-fade menggunakan `mask-image` gradient

---

## Struktur Halaman (Routing)

Menggunakan **App Router** Next.js dengan Route Groups:

```
app/
├── (auth)/                  # Route group auth (tanpa layout publik)
│   └── admin/               # Halaman login admin
│
├── (admin)/                 # Route group admin (dengan layout dashboard)
│   ├── layout.js            # Layout khusus dashboard admin
│   └── admin/
│       ├── page.js          # Dashboard utama admin
│       ├── berita/          # Manajemen berita
│       ├── events/          # Manajemen events
│       ├── galeri/          # Manajemen galeri
│       ├── partners/        # Manajemen partner
│       └── struktur/        # Manajemen struktur pengurus
│
├── berita/                  # Halaman publik berita
├── contact/                 # Halaman kontak & lokasi
├── event/                   # Halaman publik events
├── galery/                  # Halaman galeri foto
├── kenangan/                # Halaman kenangan / arsip (Redirect ke /galery)
├── profile/                 # Halaman profil organisasi
├── ProjectList.jsx          # Daftar proyek per kategori + ComingSoonCard jika kosong
│
├── layout.js                # Root layout (Navbar, Footer, Provider)
├── page.js                  # Halaman Beranda (Home)
├── providers.js             # Provider wrapper (Redux, Theme)
└── globals.css              # Global styles & design tokens
```

---

## Struktur Komponen

```
components/
│
├── Beranda/                          # Komponen khusus halaman Beranda
│   ├── HeroBeranda.jsx               # Hero section dengan animasi teks
│   ├── TextType.jsx                  # Animasi typewriter effect
│   ├── GradientText.jsx              # Teks dengan gradient warna
│   ├── ShapeGrid.jsx                 # Dekorasi grid bentuk geometris
│   ├── NewsCard.jsx                  # Card berita (desktop)
│   ├── NewsCardSmartphone.jsx        # Card berita (mobile)
│   ├── NewsCardSkeleton.jsx          # Skeleton loader card berita desktop
│   ├── NewsCardSmartphoneSkeleton.jsx# Skeleton loader card berita mobile
│   ├── NewsSlider.jsx                # Slider berita interaktif
│   ├── EventCard.jsx                 # Card preview event
│   ├── ImageCard.jsx                 # Card gambar galeri
│   ├── ImageCardSkeleton.jsx         # Skeleton loader card gambar
│   ├── Partners.jsx                  # Marquee logo partner/sponsor
│   └── SectionTitle.jsx             # Komponen judul section
│
├── Berita/                           # Komponen halaman berita
├── Project/                          # Komponen halaman proyek
│
├── Navbar/                           # Navigasi
│   ├── index.jsx                     # Navbar utama (responsive)
│   ├── NavList.jsx                   # Daftar item navigasi
│   ├── MobileNav.jsx                 # Menu navigasi mobile
│   └── DarkModeToggle.jsx            # Toggle light/dark mode
│
├── Footer/
│   └── Footer.jsx                    # Footer dengan info kontak & sosial media
│
├── BidangPengurus.jsx                # Tampilan bidang/departemen pengurus
├── BounceLoading.jsx                 # Loading indicator animasi bounce
├── CardPengurus.jsx                  # Card profil anggota pengurus
├── ClientLayoutWrapper.jsx           # Wrapper client-side untuk layout
├── HeaderStruktur.jsx                # Header halaman struktur pengurus
├── MyMaps.jsx                        # Komponen peta interaktif (Leaflet)
├── NotFound.jsx                      # Komponen 404 Not Found
├── OtherNews.jsx                     # Berita lainnya / related news
├── ScrollToTop.jsx                   # Tombol scroll ke atas
├── SidebarPengurus.jsx               # Sidebar filter pengurus per bidang
└── TopLink.jsx                       # Link navigasi atas / breadcrumb
```

---

## Dark Mode

Implementasi dark mode menggunakan **`next-themes`** dengan class strategy:

- Konfigurasi: `darkMode: "class"` di `tailwind.config.js`
- CSS custom variant: `@custom-variant dark (&:where(.dark, .dark *))`
- Toggle: `DarkModeToggle.jsx` di Navbar

**Strategi override dark mode di `globals.css`:**

| Kelas target         | Perilaku di Dark Mode                         |
|----------------------|-----------------------------------------------|
| `.bg-white`          | Glassmorphism — semi-transparan + blur         |
| `.bg-slate-50`       | Semi-transparan + blur ringan                  |
| `.text-slate-900`, heading | Warna `#f8fafc` (soft white)           |
| `.text-gray-600/500` | Warna `#94a3b8` (soft blue-gray)              |
| `.text-good-blue`    | `#3b82f6` (lebih terang)                      |
| `.border`, `hr`      | `rgba(255,255,255,0.08)` (subtle)             |

---

## Arsitektur State Management

Menggunakan **Redux Toolkit** untuk state global:

```
lib/
├── redux/          # Folder Redux store, slices, dll.
├── api.js          # Konfigurasi base URL Axios
├── date-libs.js    # Helper fungsi format tanggal
└── string-libs.js  # Helper fungsi manipulasi string
```

Provider Redux dan Theme dibungkus di `app/providers.js` lalu digunakan di root `layout.js`.

---

## Utilitas & Library

| File / Library         | Fungsi                                        |
|------------------------|-----------------------------------------------|
| `lib/api.js`           | Base instance Axios untuk API request         |
| `lib/date-libs.js`     | Format & manipulasi tanggal                   |
| `lib/string-libs.js`   | Fungsi truncate, slug, dsb.                   |
| `clsx`                 | Conditional class names yang bersih           |
| `react-loading-skeleton` | Skeleton loading placeholder               |
| `xlsx`                 | Export/import data Excel (panel admin)        |
| `leaflet`              | Peta interaktif halaman kontak                |

---

## Keputusan Desain

### 1. Glassmorphism di Dark Mode
Dark mode menggunakan efek glassmorphism pada card dan section container (`backdrop-filter: blur`) untuk memberikan kesan modern dan premium tanpa terasa berat.

### 2. CodePen-Style News Cards
Card berita menggunakan gaya "CodePen premium card" dengan efek hover 3D — background card bergeser naik saat hover, mengekspos panel belakang berisi metadata (tombol like, komentar, views). Diimplementasikan sepenuhnya dengan pure CSS di `globals.css`.

### 3. Route Groups untuk Admin
Admin dashboard dipisahkan menggunakan Route Groups `(auth)` dan `(admin)` sehingga:
- Halaman admin memiliki layout berbeda (sidebar, dll.) tanpa mempengaruhi halaman publik
- Routing tetap bersih tanpa prefix `/auth` atau `/admin` yang terekspos

### 4. Skeleton Loading
Setiap card data dari API (berita, gambar) memiliki skeleton loader tersendiri (`*Skeleton.jsx`) untuk UX yang lebih halus saat data loading.

### 5. News Detail Pop-up Modal (Single Page Application & Beranda)
Mengklik kartu berita baik di halaman berita utama (`/berita`) maupun di section "Berita Pilihan" pada **Beranda (Homepage)** kini memunculkan pop-up modal detail interaktif (tanpa pindah halaman/tanpa loading delay). Ini meminimalisir delay loading visual di seluruh alur eksplorasi berita. Modal ini mencakup:
- Gambar penuh, tagline penulis & tanggal, judul, dan isi berita HTML lengkap.
- Integrasi tombol share media sosial (WhatsApp, Facebook, Twitter, Telegram, Salin Tautan) di bagian bawah.
- Tombol X di bagian kanan atas dengan aksi dismiss.

### 6. Post Back Redirect Button
Untuk akses langsung (via direct link), halaman detail tunggal berita (`/berita/[slug]`) kini dilengkapi dengan tombol "← Kembali ke Semua Berita" yang menonjol dan berdesain premium di bagian paling atas konten utama untuk mempermudah navigasi kembali.

### 7. Redirect `/kenangan` → `/galery`
Halaman `/kenangan` dihapus dan diganti dengan redirect otomatis ke `/galery` menggunakan `next/navigation`. Ini menyederhanakan routing dan menghilangkan duplikasi halaman dengan konten yang identik.

### 8. Duplikasi Endpoint Galeri
Halaman Beranda dan `/galery` keduanya fetch dari `/api/galeri-terbaru`. Ini **disengaja dan tidak bermasalah** karena:
- Keduanya memang menampilkan konten yang sama
- Yang berbeda hanya jumlah item (Beranda: 6, Galeri: semua)
- Tidak ada overhead signifikan di sisi client
- Jika ke depan data perlu dipisah, cukup tambah endpoint baru di backend tanpa refactor besar

### 9. Full-Width Hero News Slider
Slider rekomendasi berita di halaman utama berita (`/berita`) diubah agar memenuhi 100% lebar viewport layar (full-width) tanpa rounded border dan margin. Slider ini dipasang secara permanen di bagian atas halaman (y=0) untuk semua kategori berita, merapat ke bawah navbar transparan, guna menyajikan visual hero section yang konsisten dan premium.

### 10. Pembatasan Berita Pilihan Beranda (Top 3 Popular)
Halaman Beranda kini disederhanakan dengan hanya menampilkan **3 berita pilihan terpopuler** teratas (`beritaPilihan.slice(0, 3)`). Kontrol pagination (`currentPage`, `totalPages`) telah dihapus sepenuhnya dari section berita Beranda baik untuk laptop maupun smartphone guna mempercepat waktu muat halaman dan merampingkan tampilan UI. Pengguna yang ingin mengeksplorasi berita lainnya dapat mengklik tombol "Lihat Berita Lainnya" untuk diarahkan ke halaman `/berita`.

Terdapat dua file config Tailwind (`tailwind.config.js` dan `next.config.ts`) karena proyek masih dalam migrasi dari Tailwind v3 ke v4. Konfigurasi utama aktif adalah melalui `@theme` di `globals.css` (Tailwind v4 approach).

---

*Dokumen ini dibuat untuk keperluan tim pengembang HMTI Unkhair. Update dokumen ini setiap ada perubahan desain signifikan.*
