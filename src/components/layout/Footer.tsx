import Link from "next/link";
import { Home, MessageCircle } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t pt-16 pb-8 md:pb-8 pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="FINDKOS Logo" className="h-8 w-auto object-contain" />
              <span className="font-bold text-xl tracking-tight">FINDKOS</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Platform pencarian kos terbaik untuk mahasiswa dengan kemudahan akses dan transparansi harga.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Produk</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/cari" className="hover:text-primary transition-colors">Cari Kos</Link></li>
              <li><Link href="/favorit" className="hover:text-primary transition-colors">Favorit</Link></li>
              <li><Link href="/cara-kerja" className="hover:text-primary transition-colors">Cara Kerja</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/tentang" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link href="/karir" className="hover:text-primary transition-colors">Karir</Link></li>
              <li><Link href="/kontak" className="hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t text-sm text-muted-foreground">
          <p>© 2024 FINDKOS. Dibuat untuk mahasiswa Indonesia.</p>
          <div className="flex gap-6">
            <Link href="/kebijakan-privasi" className="hover:text-primary">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="hover:text-primary">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
