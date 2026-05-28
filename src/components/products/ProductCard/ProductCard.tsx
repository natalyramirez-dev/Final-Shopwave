"use client";

import { Product } from "@/models/product.model";
import { useCart } from "@/context/CartContext";
import styles from "@/components/ui/scss/ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].name : "M";
    addToCart(product.id, defaultSize, 1);
  };

  return (
    <article className={styles.card}>
      <img
        src={product.imageUrl}
        alt={product.title}
        className={styles.image}
      />

      <div className={styles.content}>
        <h2>{product.title}</h2>

        <p>{product.category.name}</p>

        <div className={styles.prices}>
          <span className={styles.discounted}>
            ${product.discountedPrice}
          </span>

          <span className={styles.original}>
            ${product.price}
          </span>
        </div>

        <button onClick={handleAddToCart} className={styles.addToCartBtn}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}