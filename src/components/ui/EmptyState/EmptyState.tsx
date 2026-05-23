import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}