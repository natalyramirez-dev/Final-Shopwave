export const isRequired = (value: string): string | null =>
  value.trim() ? null : "Este campo es obligatorio.";

export const minLength = (value: string, min: number): string | null =>
  value.trim().length >= min ? null : `Debe tener al menos ${min} caracteres.`;

export const isEmail = (value: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? null
    : "Ingresa un correo electrónico válido.";

export const isValidUrl = (value: string): string | null => {
  try {
    new URL(value);
    return null;
  } catch {
    return "Ingresa una URL válida (https://...).";
  }
};

export const isPositiveNumber = (value: number | string): string | null =>
  Number(value) > 0 ? null : "Debe ser un número mayor a 0.";

export const isNonNegativeNumber = (value: number | string): string | null =>
  Number(value) >= 0 ? null : "No puede ser un número negativo.";

export const inRange = (value: number | string, min: number, max: number): string | null =>
  Number(value) >= min && Number(value) <= max
    ? null
    : `Debe estar entre ${min} y ${max}.`;

export const isValidPhone = (value: string): string | null =>
  /^[0-9]{7,15}$/.test(value.trim())
    ? null
    : "Ingresa un número de teléfono válido (solo dígitos, 7-15 caracteres).";

export const isValidCardNumber = (value: string): string | null => {
  const digits = value.replace(/\s/g, "");
  return /^\d{16}$/.test(digits) ? null : "El número de tarjeta debe tener 16 dígitos.";
};