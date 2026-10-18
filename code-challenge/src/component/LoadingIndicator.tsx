import styles from "./LoadingIndicator.module.css";

import type { JSX } from "react";

function LoadingIndicator(): JSX.Element {
  return (
    <div aria-live="polite" className={styles.status} role="status">
      <span aria-hidden="true" className={styles.spinner} />
      <span>Loading suggestions...</span>
    </div>
  );
}

export default LoadingIndicator;
