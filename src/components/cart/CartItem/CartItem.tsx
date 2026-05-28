"use client";

import { CartItem as ICartItem } from "@/models/cart.model";
import { useCart } from "@/context/CartContext";
import styles from "@/components/ui/scss/CartItem.module.scss";

interface Props {
  item: ICartItem;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <article className={styles.cartItem}>
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
          <span className={styles.discountedPrice}>${item.discountedPrice}</span>
          {item.price !== item.discountedPrice && (
            <span className={styles.originalPrice}>${item.price}</span>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.quantityControls}>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button 
            className={styles.removeBtn} 
            onClick={() => removeItem(item.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}