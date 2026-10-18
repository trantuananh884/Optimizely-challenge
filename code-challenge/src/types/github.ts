export interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  created_at: string;
}

export interface PaginatedRepositories {
  repos: GitHubRepository[];
  hasNextPage: boolean;
}
