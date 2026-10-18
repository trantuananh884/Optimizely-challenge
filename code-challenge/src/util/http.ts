import HttpClient from "../api/httpClient";
import axios from "axios";
import type { GitHubRepository, PaginatedRepositories } from "../types/github";

export async function fetchRepos(username: string): Promise<GitHubRepository[]> {
  try {
    const response = await HttpClient.get<GitHubRepository[]>(`/${username}/repos`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.status);
    }
    throw error;
  }
}

export async function fetchReposForPagination(
  username: string,
  { page = 1, per_page = 10 }: { page?: number; per_page?: number } = {},
): Promise<PaginatedRepositories> {
  try {
    const response = await HttpClient.get<GitHubRepository[]>(`/${username}/repos`, {
      params: { page, per_page },
    });
    return {
      repos: response.data,
      hasNextPage: /rel="next"/.test(String(response.headers["link"] ?? "")),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API request failed:", error.response?.status);
    }
    throw error;
  }
}
