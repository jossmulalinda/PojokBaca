import 'leaflet/dist/leaflet.css';
import 'aos/dist/aos.css';
import './globals.css';
import { Providers } from './providers';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

export const metadata = {
  title: 'HMTI Unkhair — Himpunan Mahasiswa Teknik Informatika',
  description: 'Website resmi Himpunan Mahasiswa Teknik Informatika Universitas Khairun Ternate.',
  keywords: 'HMTI, Unkhair, Teknik Informatika, Ternate, Universitas Khairun',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-[#FAF9F6] dark:bg-[#080c14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </div>
        </Providers>
      </body>
    </html>
  );
}
