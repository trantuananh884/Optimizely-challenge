import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import { useSelector } from "react-redux";
import useFetchRepos from "../hooks/useFetchRepos";
import useFetchReposForPagination from "../hooks/useFetchReposForPagination";
import { fetchReposForPagination } from "../util/http";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import styles from "./Home.module.css";
import { activeRepoActions, type AppDispatch, type RootState } from "../store";
import { useNavigate } from "react-router-dom";

interface PaginationState {
  username: string;
  page: number;
  perPage: number;
}

function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector(
    (state: RootState) => state.debouncedQuery.debouncedQuery,
  );
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    username: "",
    page: 1,
    perPage: 5,
  });
  const page = pagination.username === username ? pagination.page : 1;
  const perPage = pagination.perPage;
  const { data: allRepos } = useFetchRepos(username);
  const maxPage = allRepos ? Math.ceil(allRepos.length / perPage) : 1;
  const { data, isPending, isFetching, isError, error } =
    useFetchReposForPagination(username, {
      page,
      per_page: perPage,
    });
  useEffect(() => {
    if (!username) return;
    if (page < maxPage) {
      void queryClient.prefetchQuery({
        queryKey: ["reposForPagination", username, page + 1, perPage],
        queryFn: () =>
          fetchReposForPagination(username, {
            page: page + 1,
            per_page: perPage,
          }),
        staleTime: 1 * 60 * 1000, // Cache for 1 minute
      });
    }
  }, [page, perPage, username, queryClient, maxPage]);
  function changePage(nextPage: number) {
    setPagination({ username, page: nextPage, perPage });
  }

  function changePerPage(event: ChangeEvent<HTMLSelectElement>) {
    setPagination({
      username,
      page: 1,
      perPage: Number(event.target.value),
    });
  }
  function handleClick(activeIndex: number) {
    dispatch(activeRepoActions.setActiveRepo(activeIndex));
    navigate("/detail");
  }
  return (
    <section className={styles.home}>
      <h1>Repositories</h1>
      {!username ? (
        <p className={styles.message}>
          Search for a GitHub username to see repositories.
        </p>
      ) : (
        <>
          <div className={styles.toolbar}>
            <p>
              Repositories for <strong>{username}</strong>
            </p>
            <label className={styles.pageSize}>
              Repositories per page
              <select
                onChange={changePerPage}
                value={perPage}
                disabled={isFetching}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>

          {isPending && (
            <p className={styles.message}>Loading repositories...</p>
          )}
          {isError && (
            <p className={styles.error} role="alert">
              Could not load repositories: {error.message}
            </p>
          )}
          {!isPending && !isError && data?.repos.length === 0 && (
            <p className={styles.message}>
              No repositories found on this page.
            </p>
          )}
          {data && data.repos.length > 0 && (
            <ul className={styles.repositoryList} aria-busy={isFetching}>
              {data.repos.map((repo, index) => (
                <li
                  onClick={() => {
                    handleClick(index);
                  }}
                  className={styles.repository}
                  key={repo.id}
                >
                  <div className={styles.repositoryInfo}>
                    <a href={repo.html_url} rel="noreferrer" target="_blank">
                      {repo.name}
                    </a>
                    <p>{repo.description || "No description provided."}</p>
                  </div>
                  <div className={styles.repositoryActions}>
                    <a
                      className={styles.repositoryLink}
                      href={repo.html_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on GitHub
                    </a>
                    <span className={styles.stars}>
                      <span aria-hidden="true">★</span>{" "}
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <nav className={styles.pagination} aria-label="Repository pages">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => changePage(page - 1)}
              type="button"
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={!data?.hasNextPage || isFetching}
              onClick={() => changePage(page + 1)}
              type="button"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}

export default HomePage;
