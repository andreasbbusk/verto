'use client';

import { useState } from 'react';
import { SetCard } from './set-card';
import { SearchFilter } from '@/modules/components/layout/client-wrapper';
import { Card, CardContent } from '@/modules/components/ui/card';
import { Button } from '@/modules/components/ui/button';
import { Badge } from '@/modules/components/ui/badge';
import type { FlashcardSet } from '@/modules/types';
import { Grid, List, SortAsc, SortDesc, Calendar, Hash } from 'lucide-react';

interface SetGridProps {
  sets: FlashcardSet[];
  onEdit?: (set: FlashcardSet) => void;
  onDelete?: (set: FlashcardSet) => void;
  showActions?: boolean;
}

type SortOption = 'name' | 'created' | 'cardCount';
type SortDirection = 'asc' | 'desc';

export function SetGrid({ sets, onEdit, onDelete, showActions = true }: SetGridProps) {
  const [filteredSets, setFilteredSets] = useState<FlashcardSet[]>(sets);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sort filtered sets
  const sortedSets = [...filteredSets].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'da-DK');
        break;
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'cardCount':
        comparison = a.cardCount - b.cardCount;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (sets.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="text-gray-400 text-4xl">📚</div>
            <div>
              <h3 className="font-semibold text-lg">Ingen sets fundet</h3>
              <p className="text-gray-500">
                Start med at oprette dit første flashcard set
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            items={sets}
            onFiltered={setFilteredSets}
            searchKey="name"
            placeholder="Søg i sets..."
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort options */}
          <div className="flex items-center gap-1">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('name')}
              className="text-xs"
            >
              Navn {getSortIcon('name')}
            </Button>
            <Button
              variant={sortBy === 'created' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('created')}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Dato {getSortIcon('created')}
            </Button>
            <Button
              variant={sortBy === 'cardCount' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('cardCount')}
              className="text-xs"
            >
              <Hash className="h-3 w-3 mr-1" />
              Kort {getSortIcon('cardCount')}
            </Button>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-1 border-l pl-3">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>Viser {sortedSets.length} af {sets.length} sets</span>
        <Badge variant="outline">
          {sets.reduce((total, set) => total + set.cardCount, 0)} kort i alt
        </Badge>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSets.map((set) => (
            <Card key={set.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">{set.name}</h3>
                      <Badge variant="secondary">{set.cardCount} kort</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Oprettet {new Date(set.createdAt).toLocaleDateString('da-DK')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <SetCard
                      set={set}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      showActions={showActions}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredSets.length === 0 && sets.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-500">
                Ingen sets matcher din søgning
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}