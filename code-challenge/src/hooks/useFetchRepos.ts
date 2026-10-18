import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { fetchRepos } from "../util/http";
import type { GitHubRepository } from "../types/github";

function useFetchRepos(username: string) {
  return useQuery<GitHubRepository[], AxiosError>({
    queryKey: ["repos", username],
    queryFn: () => fetchRepos(username),
    staleTime: 1 * 60 * 1000,
    enabled: !!username, // Only run the query if username is provided
  });
}

export default useFetchRepos;
