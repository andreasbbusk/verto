'use client';

import { Button } from '@/modules/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/components/ui/card';
import { Badge } from '@/modules/components/ui/badge';
import { cn } from '@/modules/lib/utils';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Home, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface StudyResultsProps {
  sessionStats: {
    totalReviewed: number;
    correctAnswers: number;
    accuracy: number;
    averageResponseTime: number;
    averageDifficulty: number;
    timeSpent: number;
  };
  setName: string;
  onStudyAgain: () => void;
  onBackToDashboard: () => void;
  onNextSet?: () => void;
}

export function StudyResults({
  sessionStats,
  setName,
  onStudyAgain,
  onBackToDashboard,
  onNextSet
}: StudyResultsProps) {
  const {
    totalReviewed,
    correctAnswers,
    accuracy,
    averageResponseTime,
    averageDifficulty,
    timeSpent
  } = sessionStats;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (accuracy >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
    if (accuracy >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 95) return "Fantastisk! Du behersker dette set perfekt! 🌟";
    if (accuracy >= 85) return "Virkelig godt arbejde! Du er næsten der! 🎉";
    if (accuracy >= 75) return "Godt gået! Du lærer støt og roligt! 👍";
    if (accuracy >= 60) return "Fint arbejde! Øvelse gør mester! 💪";
    return "Godt forsøg! Fortsæt med at øve dig! 🎯";
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return { text: "Udfordrende", color: "text-red-600" };
    if (difficulty <= 3) return { text: "Moderat", color: "text-yellow-600" };
    return { text: "Let", color: "text-green-600" };
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return `${Math.round(minutes * 60)} sek`;
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}t ${mins}m`;
  };

  const formatResponseTime = (milliseconds: number) => {
    if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
    return `${(milliseconds / 1000).toFixed(1)}s`;
  };

  const difficultyInfo = getDifficultyText(averageDifficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Studiemøde afsluttet!</h1>
            <p className="text-lg text-gray-600">{setName}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {totalReviewed} kort gennemgået
          </Badge>
        </div>

        {/* Results Overview */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className={cn("text-4xl font-bold", getAccuracyColor(accuracy))}>
              {Math.round(accuracy)}% korrekte
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              {getAccuracyMessage(accuracy)}
            </p>
          </CardHeader>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Rigtige svar</div>
              <div className="text-xs text-gray-500 mt-1">
                ud af {totalReviewed} kort
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Total tid</div>
              <div className="text-xs text-gray-500 mt-1">
                ⌀ {formatResponseTime(averageResponseTime)}/kort
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className={cn("text-2xl font-bold", difficultyInfo.color)}>
                {difficultyInfo.text}
              </div>
              <div className="text-sm text-gray-600">Gennemsnitlig</div>
              <div className="text-xs text-gray-500 mt-1">
                sværhedsgrad ({averageDifficulty.toFixed(1)}/5)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((totalReviewed / 20) * 100) || 1}
              </div>
              <div className="text-sm text-gray-600">XP optjent</div>
              <div className="text-xs text-gray-500 mt-1">
                baseret på præstation
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onStudyAgain}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Studér igen
          </Button>
          
          {onNextSet && (
            <Button
              variant="outline"
              size="lg"
              onClick={onNextSet}
              className="flex items-center gap-2"
            >
              Næste set
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToDashboard}
            className="flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Tilbage til dashboard
          </Button>
        </div>

        {/* Study Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">💡 Studietips</h3>
            <div className="space-y-2 text-sm text-blue-700">
              {accuracy < 75 && (
                <p>• Prøv at studere kortene igen om lidt - gentagelse styrker hukommelsen</p>
              )}
              {averageDifficulty > 3 && (
                <p>• Godt arbejde! Du behersker dette emne godt</p>
              )}
              {averageResponseTime > 10000 && (
                <p>• Tag dig god tid - det er bedre at svare rigtigt end hurtigt</p>
              )}
              <p>• Kom tilbage i morgen for at styrke din langsigtede hukommelse</p>
              <p>• Fokusér på kortene du fandt sværest næste gang</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}