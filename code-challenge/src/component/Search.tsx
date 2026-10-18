import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Search.module.css";
import useFetchRepos from "../hooks/useFetchRepos";
import LoadingIndicator from "./LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import {
  activeRepoActions,
  debouncedQueryActions,
  type AppDispatch,
  type RootState,
} from "../store";
import { useNavigate } from "react-router-dom";

function Search(): JSX.Element {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const dispatch = useDispatch<AppDispatch>();
  const debouncedQuery = useSelector(
    (state: RootState) => state.debouncedQuery.debouncedQuery,
  );
  const { data, isFetching, error } = useFetchRepos(debouncedQuery);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    dispatch(activeRepoActions.setActiveRepo(activeIndex));

    if (activeIndex >= 0) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(debouncedQueryActions.setdebouncedQuery(query.trim()));
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpenSuggestions(false);

    if (activeIndex >= 0) {
      setActiveIndex(-1);
      navigate("/detail");
      return;
    }
    dispatch(debouncedQueryActions.setdebouncedQuery(query.trim()));
    navigate("/");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpenSuggestions(false);
    }
    if (!data?.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex + 1 == data.length ? prevIndex : prevIndex + 1,
      );
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex - 1 < 0 ? 0 : prevIndex - 1));
    }
  }
  return (
    <>
      {isOpenSuggestions &&
        createPortal(
          <div
            aria-hidden="true"
            className={styles.backdrop}
            onClick={() => setIsOpenSuggestions(false)}
          />,
          document.body,
        )}
      <form
        className={`${styles.search} ${isOpenSuggestions ? styles.searchOpen : ""}`}
        role="search"
        onSubmit={handleSubmit}
      >
        <label className={styles.field}>
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="6.75" cy="6.75" r="4.75" />
              <path d="m10.25 10.25 3.25 3.25" />
            </svg>
          </span>
          <input
            aria-label="Search GitHub repositories"
            autoComplete="off"
            name="query"
            onClick={() => setIsOpenSuggestions(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search GitHub repositories..."
            type="search"
            value={query}
          />
          {isOpenSuggestions && (
            <div className={styles.suggestions}>
              <ul>
                {isFetching && (
                  <li className={styles.suggestionStatus}>
                    <LoadingIndicator />
                  </li>
                )}
                {!query && (
                  <li className={styles.message} role="status">
                    Type a username to search for repositories
                  </li>
                )}
                {((error && error.response?.status === 404) ||
                  data?.length === 0) && (
                  <li className={styles.message} role="status">
                    No results found
                  </li>
                )}

                {error && error.response?.status !== 404 && (
                  <li className={styles.error} role="status">
                    {`Error: ${error.message}`}
                  </li>
                )}
                {data?.map((repo, index) => (
                  <li
                    onClick={(event: MouseEvent<HTMLLIElement>) => {
                      if (
                        event.target instanceof Element &&
                        event.target.closest("a")
                      )
                        return;
                      event.preventDefault();
                      dispatch(activeRepoActions.setActiveRepo(index));
                      navigate("/detail");
                      setIsOpenSuggestions(false);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    className={`${styles.repository} ${
                      index === activeIndex ? styles.repositoryActive : ""
                    }`}
                    key={repo.id}
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                  >
                    <span className={styles.repositoryName}>{repo.name}</span>
                    <span className={styles.repositoryDescription}>
                      {repo.description || "No description provided."}
                    </span>
                    <span
                      aria-label={`${repo.stargazers_count.toLocaleString()} stars`}
                      className={styles.repositoryStars}
                    >
                      <svg aria-hidden="true" viewBox="0 0 16 16">
                        <path d="m8 1.5 2 4.1 4.5.7-3.25 3.2.77 4.5L8 11.9l-4.02 2.1.77-4.5L1.5 6.3 6 5.6 8 1.5Z" />
                      </svg>
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    <a
                      className={styles.repositoryLink}
                      href={repo.html_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on GitHub
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </label>
        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    </>
  );
}

export default Search;
