"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Home, AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // React 19 useActionState
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-background">
        <Link href="/" className="inline-flex items-center gap-2 mb-12 text-foreground hover:text-primary transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-semibold text-sm">Kembali ke Beranda</span>
        </Link>
        
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Selamat Datang Kembali</h1>
            <p className="text-muted-foreground">
              Masuk ke akun Anda untuk mengelola kos favorit dan melanjutkan pemesanan.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="nama@email.com" 
                required 
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <Link href="#" className="text-sm text-primary hover:underline font-medium">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="h-12 pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember" className="font-normal text-muted-foreground">
                Ingat saya di perangkat ini
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : "Masuk"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full h-12">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-primary font-medium hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side: Image overlay */}
      <div className="hidden md:block relative bg-muted">
        <img 
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1400&auto=format&fit=crop" 
          alt="Login illustration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-12 lg:p-24">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 shadow-sm">
            Temukan kenyamanan layaknya di rumah sendiri.
          </h2>
          <p className="text-white/90 text-lg max-w-lg">
            Bergabung dengan platform pencarian kos terpercaya yang menghubungkan Anda dengan hunian terbaik.
          </p>
        </div>
      </div>
    </div>
  );
}
