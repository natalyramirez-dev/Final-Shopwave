"use client";

import Link from "next/link";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que se abra la página de detalles al dar clic en el botón
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].name : "M";
    addToCart(product.id, defaultSize, 1);
  };

  return (
    <article className={styles.card}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className={styles.image}
        />
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>{product.title}</h2>
        </Link>

        <p>{product.category?.name}</p>

        <div className={styles.prices}>
          <span className={styles.discounted}>
            ${product.discountedPrice}
          </span>

          {product.price !== product.discountedPrice && (
            <span className={styles.original}>
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}