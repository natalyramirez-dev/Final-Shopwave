"use client";

import Link from "next/link";
import { Product } from "@/models/product.model";
import { formatCurrency } from "@/utils/currency.util";
import styles from "@/components/ui/scss/ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/products/${product.id}`} className={styles.imageLink}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${product.id}`} className={styles.titleLink}>
          <h2>{product.title}</h2>
        </Link>

        <p>{product.category?.name}</p>

        <div className={styles.prices}>
          <span className={styles.discounted}>
            {formatCurrency(product.discountedPrice)}
          </span>

          {product.price !== product.discountedPrice && (
            <span className={styles.original}>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
