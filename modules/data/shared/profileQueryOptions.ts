import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/modules/server/actions/user";
import { queryKeys } from "./queryKeys";

export const profileQuery = () =>
  queryOptions({
    queryKey: queryKeys.me,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
