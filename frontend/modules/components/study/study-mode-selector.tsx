'use client';

import { Button } from '@/modules/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/components/ui/card';
import { Badge } from '@/modules/components/ui/badge';
import { cn } from '@/modules/lib/utils';
import { 
  BookOpen, 
  RotateCcw, 
  Shuffle, 
  Clock,
  TrendingUp,
  Play
} from 'lucide-react';

export type StudyMode = 'new' | 'review' | 'mixed' | 'due-only';

interface StudyModeOption {
  mode: StudyMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

interface StudyModeSelectorProps {
  studyStats: {
    totalCards: number;
    newCards: number;
    reviewCards: number;
    dueCards: number;
    overdueCards: number;
  };
  onSelectMode: (mode: StudyMode) => void;
  className?: string;
}

export function StudyModeSelector({ 
  studyStats, 
  onSelectMode, 
  className 
}: StudyModeSelectorProps) {
  const modes: StudyModeOption[] = [
    {
      mode: 'mixed',
      title: 'Blandet studie',
      description: 'Kombination af nye kort og gentagelser',
      icon: <Shuffle className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
      badge: `${studyStats.dueCards} kort`
    },
    {
      mode: 'new',
      title: 'Nye kort',
      description: 'Kun kort du ikke har set før',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
      badge: `${studyStats.newCards} kort`
    },
    {
      mode: 'review',
      title: 'Gentagelse',
      description: 'Kun kort du allerede har studeret',
      icon: <RotateCcw className="h-6 w-6" />,
      color: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500',
      badge: `${studyStats.reviewCards} kort`
    },
    {
      mode: 'due-only',
      title: 'Forfaldne kort',
      description: 'Kun kort der skal gennemgås i dag',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
      badge: `${studyStats.dueCards} kort`
    }
  ];

  const getRecommendedMode = (): StudyMode => {
    if (studyStats.overdueCards > 5) return 'due-only';
    if (studyStats.newCards > 0 && studyStats.reviewCards > 0) return 'mixed';
    if (studyStats.newCards > 0) return 'new';
    return 'review';
  };

  const recommendedMode = getRecommendedMode();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Vælg studiemodus</h2>
        <p className="text-gray-600">
          Hvordan vil du studere i dag?
        </p>
      </div>

      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{studyStats.totalCards}</div>
              <div className="text-xs text-blue-800">Total kort</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{studyStats.newCards}</div>
              <div className="text-xs text-green-800">Nye kort</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{studyStats.reviewCards}</div>
              <div className="text-xs text-purple-800">Til gentagelse</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{studyStats.dueCards}</div>
              <div className="text-xs text-orange-800">Forfaldne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const isRecommended = mode.mode === recommendedMode;
          const isDisabled = (mode.mode === 'new' && studyStats.newCards === 0) ||
                           (mode.mode === 'review' && studyStats.reviewCards === 0) ||
                           (mode.mode === 'due-only' && studyStats.dueCards === 0);

          return (
            <Card 
              key={mode.mode}
              className={cn(
                'relative cursor-pointer transition-all duration-200 hover:shadow-lg border-2',
                isRecommended && 'ring-2 ring-blue-400 ring-offset-2',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !isDisabled && onSelectMode(mode.mode)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-lg', mode.color)}>
                      {mode.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {mode.title}
                        {isRecommended && (
                          <Badge variant="default" className="text-xs bg-blue-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Anbefalet
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                  {mode.badge && !isDisabled && (
                    <Badge variant="outline" className="font-medium">
                      {mode.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">
                  {mode.description}
                </p>
                <Button 
                  className={cn('w-full', mode.color)}
                  disabled={isDisabled}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start studie
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 text-gray-800">💡 Studietips</h3>
          <div className="space-y-1 text-xs text-gray-600">
            {studyStats.overdueCards > 0 && (
              <p>• Du har {studyStats.overdueCards} forfaldne kort - start med dem først</p>
            )}
            {studyStats.newCards > 10 && (
              <p>• Mange nye kort - overvej at studere 5-10 ad gangen</p>
            )}
            <p>• Blandet modus giver den bedste balance mellem læring og gentagelse</p>
            <p>• Gentagelse styrker hukommelsen og forbedrer langsigtede huskning</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}