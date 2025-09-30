"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/modules/components/ui/card";
import { Button } from "@/modules/components/ui/button";
import { Badge } from "@/modules/components/ui/badge";
import type { FlashcardSet } from "@/modules/types";
import { BookOpen, Edit, Trash2, Play } from "lucide-react";
import Link from "next/link";

interface SetCardProps {
  set: FlashcardSet;
  onEdit?: (set: FlashcardSet) => void;
  onDelete?: (set: FlashcardSet) => void;
  showActions?: boolean;
}

export function SetCard({
  set,
  onEdit,
  onDelete,
  showActions = true,
}: SetCardProps) {
  const handleEdit = () => {
    onEdit?.(set);
  };

  const handleDelete = () => {
    if (confirm(`Er du sikker på du vil slette set "${set.name}"?`)) {
      onDelete?.(set);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
              {set.name}
            </h3>
          </div>
          <BookOpen className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-medium">
              {set.cardCount} kort
            </Badge>
            <span>{new Date(set.createdAt).toLocaleDateString("da-DK")}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50">
        <div className="flex w-full gap-2">
          <Link
            href={`/study/${encodeURIComponent(set.name)}`}
            className="flex-1"
          >
            <Button className="w-full" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Studer
            </Button>
          </Link>

          {showActions && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="px-3"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
