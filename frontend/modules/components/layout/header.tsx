'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/modules/components/ui/button';
import { Badge } from '@/modules/components/ui/badge';
import { cn } from '@/modules/lib/utils';
import { 
  BookOpen, 
  Menu, 
  X, 
  Home, 
  Library, 
  GraduationCap,
  Plus,
  Settings
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Sets', href: '/sets', icon: Library },
    { name: 'Alle Kort', href: '/cards', icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                FlashCards
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/cards/new">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nyt Kort
              </Button>
            </Link>
            <Link href="/sets/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nyt Set
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium",
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/cards/new"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5" />
                <span>Nyt Kort</span>
              </Link>
              <Link
                href="/sets/new"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5" />
                <span>Nyt Set</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Study mode indicator */}
      {pathname.startsWith('/study/') && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  Studiemodus
                </Badge>
                <span className="text-sm text-blue-700">
                  Brug piletaster til navigation
                </span>
              </div>
              <Link href="/sets">
                <Button variant="ghost" size="sm" className="text-blue-700">
                  Afslut studie
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}