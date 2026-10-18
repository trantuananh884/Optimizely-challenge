import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { fetchReposForPagination } from "../util/http";
import type { PaginatedRepositories } from "../types/github";

export default function useFetchReposForPagination(
  username: string,
  { page = 1, per_page = 10 }: { page?: number; per_page?: number } = {},
) {
  return useQuery<PaginatedRepositories, AxiosError>({
    queryKey: ["reposForPagination", username, page, per_page],
    queryFn: () => fetchReposForPagination(username, { page, per_page }),
    staleTime: 1 * 60 * 1000,
    enabled: !!username, // Only run the query if username is provided
  });
}
