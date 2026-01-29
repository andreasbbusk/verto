import type { UseQueryOptions } from "@tanstack/react-query";
import { getMe } from "@/modules/server/actions/user";
import type { Profile } from "@/modules/types/types";
import { queryKeys } from "./queryKeys";

type ProfileQueryOptions = UseQueryOptions<
  Profile,
  Error,
  Profile,
  typeof queryKeys.me
>;

export const profileQuery = (): ProfileQueryOptions => ({
  queryKey: queryKeys.me,
  queryFn: getMe,
  staleTime: 5 * 60 * 1000,
});
