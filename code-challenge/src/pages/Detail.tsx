import type { JSX } from "react";
import { useSelector } from "react-redux";
import useFetchRepos from "../hooks/useFetchRepos";
import styles from "./Detail.module.css";
import type { RootState } from "../store";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

function RepositoryDetail(): JSX.Element {
  const username = useSelector(
    (state: RootState) => state.debouncedQuery.debouncedQuery,
  );
  const activeIndex = useSelector(
    (state: RootState) => state.activeRepo.activeRepo,
  );
  const { data, isPending, isError, error } = useFetchRepos(username);

  const hasValidSelection =
    Array.isArray(data) &&
    Number.isInteger(activeIndex) &&
    activeIndex >= 0 &&
    activeIndex < data.length;
  const repo = hasValidSelection ? data[activeIndex] : null;
  const createdAt = repo ? new Date(repo.created_at) : null;

  if (isPending && username) {
    return (
      <main className={styles.state} aria-live="polite">
        Loading repository details...
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.state} role="alert">
        Could not load repository details: {error.message}
      </main>
    );
  }

  if (!repo) {
    return (
      <main className={styles.state}>
        No detailed repo to show
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <article className={styles.card}>
        <p className={styles.eyebrow}>Repository details</p>
        <h1 className={styles.name}>{repo.name}</h1>
        <p className={styles.description}>
          {repo.description || "No description provided."}
        </p>

        <dl className={styles.metadata}>
          <div className={styles.metadataItem}>
            <dt>Created</dt>
            <dd>
              {createdAt && Number.isNaN(createdAt.getTime())
                ? "Unknown"
                : createdAt
                  ? dateFormatter.format(createdAt)
                  : "Unknown"}
            </dd>
          </div>
          <div className={styles.metadataItem}>
            <dt>Stars</dt>
            <dd>
              <span className={styles.star} aria-hidden="true">
                ★
              </span>{" "}
              {repo.stargazers_count.toLocaleString()}
            </dd>
          </div>
        </dl>

        <a
          className={styles.githubLink}
          href={repo.html_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          View on GitHub
          <span aria-hidden="true">↗</span>
        </a>
      </article>
    </main>
  );
}

export default RepositoryDetail;
