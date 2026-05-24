import styles from "../../ui/scss/Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>Drop culture meets everyday style.</h1>
        <p>Shop sneakers, apparel and more.</p>
      </div>
    </section>
  );
}