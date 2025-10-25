import { BookOpen } from "lucide-react";
import Link from "next/link";
import { AuthVisual } from "@/modules/components/auth/auth-visual";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 bg-stone-100 flex flex-col text-zinc-950">
        {/* Header with Logo */}
        <header className="p-6 lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-8 h-8 border border-zinc-950 flex items-center justify-center group-hover:bg-zinc-950 transition-colors">
              <BookOpen className="h-4 w-4 text-zinc-950 group-hover:text-stone-100 transition-colors" />
            </div>
            <span className="font-mono text-lg tracking-tight text-zinc-950">
              Flashcards
            </span>
          </Link>
        </header>

        {/* Form Area - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 xl:px-24 pb-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right Panel - Visual Content */}
      <div className="flex-1 bg-zinc-950 hidden lg:flex items-center justify-center p-16 relative overflow-hidden">
        <AuthVisual />
      </div>
    </div>
  );
}
