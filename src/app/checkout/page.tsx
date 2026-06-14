"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar/Navbar";
import { AuthGuard } from "@/guards/AuthGuard";
import { orderService } from "@/services/order.service";
import { CreateOrderRequest } from "@/models/order.model";
import { useCart } from "@/context/CartContext";
import { cartService } from "@/services/cart.service";
import styles from "@/components/ui/scss/checkout.module.scss";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cart, fetchCart, finalCalculatedTotal } = useCart();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateOrderRequest>({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mobile: "",
    paymentMethod: "CREDIT_CARD",
    cardholderName: "",
    cardNumber: ""
  });

  const [visualCardData, setVisualCardData] = useState({
    expMonth: "",
    expYear: "",
    cvc: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVisualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisualCardData({ ...visualCardData, [e.target.name]: e.target.value });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim();
    if (value.length <= 19) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  const nextStep = () => {
    if (
      formData.firstName && 
      formData.lastName && 
      formData.streetAddress && 
      formData.city && 
      formData.mobile
    ) {
      setStep(2);
    } else {
      alert("Por favor completa todos los campos obligatorios del envío.");
    }
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newOrder = await orderService.createOrder(formData);
      
      if (cart?.cartItems && cart.cartItems.length > 0) {
        const deletePromises = cart.cartItems.map(item => 
          cartService.removeCartItem(item.id)
        );
        await Promise.all(deletePromises);
      }

      await fetchCart();
      router.push(`/orders/${newOrder.id}`); 
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <Navbar />
      <section className={styles.content}>
        <div className={styles.header}>
          <h1>Finalizar Compra</h1>
          <p>Completa los detalles de tu pedido de forma segura.</p>
        </div>

        <div className={styles.stepper}>
          <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ""}`}>
            <div className={styles.stepCircle}>1</div>
            <span>Envío</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ""}`}>
            <div className={styles.stepCircle}>2</div>
            <span>Pago</span>
          </div>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.formElement}>
            {step === 1 && (
              <div className={styles.stepSlide}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Nombre</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej. Carlos" className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Apellido</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej. Mendoza" className={styles.inputField} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Dirección de entrega</label>
                  <input required type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="Ej. Av. Blanco Galindo Km 2, Edificio Los Pinos" className={styles.inputField} />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Departamento</label>
                    <select required name="city" value={formData.city} onChange={handleChange} className={styles.inputField}>
                      <option value="" disabled>Selecciona un departamento</option>
                      <option value="Beni">Beni</option>
                      <option value="Chuquisaca">Chuquisaca</option>
                      <option value="Cochabamba">Cochabamba</option>
                      <option value="La Paz">La Paz</option>
                      <option value="Oruro">Oruro</option>
                      <option value="Pando">Pando</option>
                      <option value="Potosí">Potosí</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Tarija">Tarija</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Provincia / Zona (Opcional)</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Ej. Cercado" className={styles.inputField} />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label>Código Postal (Opcional)</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Ej. 0000" className={styles.inputField} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Teléfono Celular</label>
                    <input required type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Ej. 70012345" className={styles.inputField} />
                  </div>
                </div>

                <div className={styles.actionButtonsRight}>
                  <button type="button" onClick={nextStep} className={styles.primaryBtn}>
                    Siguiente paso
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepSlide}>
                <div className={styles.paymentAmountBanner}>
                  <span>Monto del pago</span>
                  <span className={styles.amount}>${finalCalculatedTotal?.toFixed(2)}</span>
                </div>

                <div className={styles.cardMockup}>
                  <div className={styles.inputGroup}>
                    <label>Número de tarjeta</label>
                    <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleCardNumberChange} placeholder="5559 0000 0000 0000" className={styles.inputField} />
                  </div>

                  <div className={styles.cardRow}>
                    <div className={styles.inputGroup} style={{ flex: 2 }}>
                      <label>Poseedor</label>
                      <input required type="text" name="cardholderName" value={formData.cardholderName} onChange={handleChange} placeholder="LUIS TORREZ" className={styles.inputField} />
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label>Mes</label>
                      <input required type="text" name="expMonth" value={visualCardData.expMonth} onChange={handleVisualChange} placeholder="MM" maxLength={2} className={styles.inputField} />
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label>Año</label>
                      <input required type="text" name="expYear" value={visualCardData.expYear} onChange={handleVisualChange} placeholder="YY" maxLength={2} className={styles.inputField} />
                    </div>
                  </div>

                  <div className={styles.cardRow}>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <label>CVC/CVV</label>
                      <input required type="password" name="cvc" value={visualCardData.cvc} onChange={handleVisualChange} placeholder="***" maxLength={4} className={styles.inputField} />
                    </div>
                    <div style={{ flex: 2 }}></div>
                  </div>
                </div>

                <div className={styles.actionButtonsSplit}>
                  <button type="button" onClick={prevStep} className={styles.secondaryBtn}>
                    Volver atrás
                  </button>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? "Procesando pago..." : "Continuar"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}