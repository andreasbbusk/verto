'use client';

import { Label } from '@/modules/components/ui/label';
import { Button } from '@/modules/components/ui/button';
import { cn } from '@/modules/lib/utils';
import { Star, Circle } from 'lucide-react';

export interface DifficultyLevel {
  value: number;
  label: string;
  description: string;
  color: string;
}

const difficultyLevels: DifficultyLevel[] = [
  {
    value: 1,
    label: "Meget let",
    description: "Grundlæggende begreber",
    color: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
  },
  {
    value: 2,
    label: "Let",
    description: "Enkle emner",
    color: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
  },
  {
    value: 3,
    label: "Moderat",
    description: "Middel sværhedsgrad",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
  },
  {
    value: 4,
    label: "Svært",
    description: "Avancerede emner",
    color: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
  },
  {
    value: 5,
    label: "Meget svært",
    description: "Ekspert niveau",
    color: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
  }
];

interface DifficultySelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export function DifficultySelector({ 
  value, 
  onChange, 
  label = "Sværhedsgrad",
  className 
}: DifficultySelectorProps) {
  const selectedLevel = difficultyLevels.find(level => level.value === value) || difficultyLevels[2];

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Visual Stars Display */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "transition-colors",
              level <= value ? "text-yellow-500" : "text-gray-300"
            )}
          >
            <Star 
              className={cn(
                "h-5 w-5",
                level <= value ? "fill-current" : ""
              )}
            />
          </div>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {selectedLevel.label}
        </span>
      </div>

      {/* Button Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {difficultyLevels.map((level) => (
          <Button
            key={level.value}
            variant="outline"
            onClick={() => onChange(level.value)}
            className={cn(
              "h-auto p-3 text-center flex flex-col items-center space-y-1 transition-all duration-200 border-2",
              value === level.value 
                ? level.color + " ring-2 ring-offset-1 ring-blue-400" 
                : "hover:" + level.color.split(' ').slice(-1)[0]
            )}
          >
            <div className="flex items-center gap-1">
              {[...Array(level.value)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
              {[...Array(5 - level.value)].map((_, i) => (
                <Circle key={i} className="h-3 w-3" />
              ))}
            </div>
            <span className="font-medium text-xs">{level.label}</span>
            <span className="text-xs opacity-75 leading-tight">
              {level.description}
            </span>
          </Button>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600">
        Sværhedsgraden hjælper med at tilpasse studieintervaller og forventninger.
      </p>
    </div>
  );
}

export { difficultyLevels };