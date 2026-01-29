import { queryOptions } from "@tanstack/react-query";
import { getSetById, getSets } from "@/modules/server/actions/sets";
import { queryKeys } from "./queryKeys";

export const setsQuery = () =>
  queryOptions({
    queryKey: queryKeys.sets,
    queryFn: getSets,
    staleTime: 5 * 60 * 1000,
  });

export const setByIdQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.setById(id),
    queryFn: () => getSetById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
