import type { UseQueryOptions } from "@tanstack/react-query";
import { getSetById, getSets } from "@/modules/server/actions/sets";
import type { FlashcardSet } from "@/modules/types/types";
import { queryKeys } from "./queryKeys";

type SetsQueryOptions = UseQueryOptions<
  FlashcardSet[],
  Error,
  FlashcardSet[],
  typeof queryKeys.sets
>;
type SetByIdQueryOptions = UseQueryOptions<
  FlashcardSet,
  Error,
  FlashcardSet,
  ReturnType<typeof queryKeys.setById>
>;

export const setsQuery = (): SetsQueryOptions => ({
  queryKey: queryKeys.sets,
  queryFn: getSets,
  staleTime: 5 * 60 * 1000,
});

export const setByIdQuery = (id: string): SetByIdQueryOptions => ({
  queryKey: queryKeys.setById(id),
  queryFn: () => getSetById(id),
  enabled: !!id,
  staleTime: 5 * 60 * 1000,
});
