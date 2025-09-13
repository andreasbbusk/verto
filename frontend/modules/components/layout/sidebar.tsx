'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/modules/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/components/ui/card';
import { Badge } from '@/modules/components/ui/badge';
import { cn } from '@/modules/lib/utils';
import { getSets } from '@/modules/lib/api';
import type { FlashcardSet } from '@/modules/lib/api';
import { 
  BookOpen, 
  Library, 
  GraduationCap,
  TrendingUp,
  Clock,
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const setsData = await getSets();
        setSets(setsData.slice(0, 5)); // Show only first 5 sets
      } catch (error) {
        console.error('Error fetching sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  const recentSets = sets.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const quickStats = {
    totalSets: sets.length,
    totalCards: sets.reduce((sum, set) => sum + set.cardCount, 0),
    studiedToday: 0, // This would come from user activity data
  };

  if (!isOpen) return null;

  return (
    <div className={cn("h-full flex flex-col bg-gray-50 border-r border-gray-200", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Menu</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Dine Statistikker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sets</span>
              <Badge variant="secondary">{quickStats.totalSets}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Kort i alt</span>
              <Badge variant="secondary">{quickStats.totalCards}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Studeret i dag</span>
              <Badge variant="outline">{quickStats.studiedToday}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sets */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">
                Seneste Sets
              </CardTitle>
              <Link href="/sets">
                <Button variant="ghost" size="sm" className="text-xs">
                  Se alle
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : recentSets.length > 0 ? (
              recentSets.map((set) => (
                <Link
                  key={set.id}
                  href={`/study/${encodeURIComponent(set.name)}`}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors group",
                    pathname.includes(encodeURIComponent(set.name)) && "bg-blue-50 text-blue-700"
                  )}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {set.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2">
                    {set.cardCount}
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="text-center py-4">
                <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Ingen sets endnu</p>
                <Link href="/sets/new">
                  <Button variant="outline" size="sm" className="mt-2">
                    Opret dit første
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Hurtige Handlinger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/cards/new" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Nyt Kort
              </Button>
            </Link>
            <Link href="/sets/new" className="block">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Library className="h-4 w-4 mr-2" />
                Nyt Set
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Study Tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              💡 Studietip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 leading-relaxed">
              Brug tastaturet til hurtigere navigation: pile for at skifte kort, 
              mellemrum for at vende, og Esc for at afslutte.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Sidst opdateret: {new Date().toLocaleTimeString('da-DK', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}