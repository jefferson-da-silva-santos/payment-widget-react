// ARQUIVO: src/masks/card.js
// ==========================================================
// Detecção de bandeira por BIN + máscara de número agrupada de forma
// correta por bandeira - Amex usa 4-6-5 (não 4-4-4-4 como os outros),
// e tem CVV de 4 dígitos em vez de 3. É assim que sistemas de verdade
// (Stripe, Mercado Pago Bricks) tratam isso.
// ==========================================================

import { onlyDigits } from './document.js';

// payment_method_id é o valor esperado pela API do Mercado Pago.
const BRANDS = [
  { id: 'amex', payment_method_id: 'amex', pattern: /^3[47]/, gaps: [4, 10], length: 15, cvvLength: 4 },
  { id: 'diners', payment_method_id: 'diners', pattern: /^3(?:0[0-5]|[68])/, gaps: [4, 10], length: 14, cvvLength: 3 },
  { id: 'hipercard', payment_method_id: 'hipercard', pattern: /^(606282|3841)/, gaps: [4, 8, 12], length: 16, cvvLength: 3 },
  {
    id: 'elo',
    payment_method_id: 'elo',
    pattern: /^(4011|4312|4389|4514|4573|4576|5041|5066|5067|509\d|6277|6362|6363|650\d|6516|6550)/,
    gaps: [4, 8, 12],
    length: 16,
    cvvLength: 3,
  },
  { id: 'mastercard', payment_method_id: 'master', pattern: /^(5[1-5]|2[2-7])/, gaps: [4, 8, 12], length: 16, cvvLength: 3 },
  { id: 'visa', payment_method_id: 'visa', pattern: /^4/, gaps: [4, 8, 12], length: 16, cvvLength: 3 },
];

const UNKNOWN_BRAND = { id: 'unknown', payment_method_id: null, gaps: [4, 8, 12], length: 16, cvvLength: 3 };

/**
 * @param {string} rawValue - número do cartão, com ou sem máscara
 * @returns {object} { id, payment_method_id, gaps, length, cvvLength }
 */
export function detectCardBrand(rawValue) {
  const digits = onlyDigits(rawValue);
  return BRANDS.find((brand) => brand.pattern.test(digits)) ?? UNKNOWN_BRAND;
}

/**
 * @param {string} rawValue
 * @returns {string} número com espaços nos lugares certos pra bandeira detectada
 */
export function maskCardNumber(rawValue) {
  const digits = onlyDigits(rawValue);
  const brand = detectCardBrand(digits);
  const limited = digits.slice(0, brand.length);

  let out = '';
  for (let i = 0; i < limited.length; i += 1) {
    if (brand.gaps.includes(i)) out += ' ';
    out += limited[i];
  }
  return out;
}

/**
 * @param {string} rawValue
 * @returns {string} MM/AA
 */
export function maskExpiry(rawValue) {
  const digits = onlyDigits(rawValue).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * @param {string} rawValue - "MM/AA" ou "MM/AAAA"
 * @returns {{ month: string, year: string }} ano sempre normalizado pra 4 dígitos
 */
export function parseExpiry(rawValue) {
  const digits = onlyDigits(rawValue);
  const month = digits.slice(0, 2);
  const yearRaw = digits.slice(2, 6);
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  return { month, year };
}

/**
 * @param {string} rawValue
 * @param {string} [cardNumber] - usado pra saber o tamanho certo (Amex = 4 dígitos)
 */
export function maskCvv(rawValue, cardNumber = '') {
  const brand = detectCardBrand(cardNumber);
  return onlyDigits(rawValue).slice(0, brand.cvvLength);
}
