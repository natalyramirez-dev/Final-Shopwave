"use client";

import { useState } from "react";
import { CartItem as ICartItem } from "@/models/cart.model";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/currency.util";
import styles from "@/components/ui/scss/CartItem.module.scss";

interface Props {
  item: ICartItem;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    await updateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await removeItem(item.id);
  };

  return (
    <article className={`${styles.cartItem} ${isUpdating ? styles.updating : ""}`}>
      <div className={styles.imageWrapper}>
        <img
          src={item.product.imageUrl || "/placeholder.jpg"}
          alt={item.product.title}
          className={styles.image}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <h3>{item.product.title}</h3>
          <p className={styles.brand}>{item.product.brand}</p>
          <p className={styles.size}>Talla: {item.size}</p>
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.discountedPrice}>
            {formatCurrency(item.discountedPrice)}
          </span>
          {item.price !== item.discountedPrice && (
            <span className={styles.originalPrice}>
              {formatCurrency(item.price)}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.quantityControls}>
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              aria-label="Reducir cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <span aria-live="polite" aria-atomic="true">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              aria-label="Aumentar cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>

          <button
            className={styles.removeBtn}
            onClick={handleRemove}
            disabled={isUpdating}
            title="Eliminar del carrito"
            aria-label={`Eliminar ${item.product.title} del carrito`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
