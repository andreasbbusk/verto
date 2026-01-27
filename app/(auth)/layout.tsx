import { BookOpen } from "lucide-react";
import Link from "next/link";
import { AuthVisual } from "@/modules/components/auth/auth-visual";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-accent-foreground">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex flex-col text-accent">
        {/* Header with Logo */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 border border-accent flex items-center justify-center group-hover:bg-accent transition-colors">
              <BookOpen className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
            </div>
            <span className="font-mono text-lg tracking-tight text-accent">
              Verto
            </span>
          </Link>
        </header>

        {/* Form Area - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12  pb-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right Panel - Visual Content */}
      <div className="flex-1 bg-black hidden lg:flex items-center justify-center p-16 xl:px-32 relative overflow-hidden m-2 rounded-xl">
        {/* SVG Noise Texture - Fine grain */}
        <svg className="absolute inset-0 w-0 h-0">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* Bright orange glow - NO FILTER */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, oklch(0.668 0.2212 33.71 / 0.8) 0%, oklch(0.668 0.2212 33.71 / 0.5) 30%, oklch(0.668 0.2212 33.71 / 0.25) 50%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        {/* Large gray overlay - NO FILTER */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 140% 140% at 40% 45%, oklch(0.35 0 0 / 0.4) 0%, oklch(0.28 0 0 / 0.25) 30%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* Grainy texture overlay - SEPARATE */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            filter: "url(#noiseFilter) contrast(180%) brightness(1000%)",
            mixBlendMode: "overlay",
          }}
        />

        <AuthVisual />
      </div>
    </div>
  );
}
