import styles from "../../ui/scss/Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>Discover New Products</h1>

        <p>
            Trending products and exclusive collections.
        </p>
      </div>
    </section>
  );
}