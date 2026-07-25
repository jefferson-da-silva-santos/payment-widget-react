// ARQUIVO: src/masks/currency.js
// ==========================================================
// Máscara de valor monetário no padrão usado por fintechs brasileiras
// (Nubank, PicPay, etc): os dígitos entram sempre pela direita, como
// centavos - "2" -> R$ 0,02 | "23" -> R$ 0,23 | "234" -> R$ 2,34.
//
// Implementação deliberada: em vez de tentar "adivinhar" o valor a
// partir do texto formatado (frágil com backspace em cima de vírgula/
// separador), o estado de verdade é sempre um INTEIRO de centavos.
// Cada tecla numérica empurra um dígito; Backspace divide por 10.
// Isso elimina qualquer ambiguidade de parsing.
// ==========================================================

/**
 * @param {number} cents - inteiro de centavos (ex: 12345 = R$ 123,45)
 * @param {string} [locale='pt-BR']
 * @param {string} [currency='BRL']
 */
export function formatCentsToCurrency(cents, locale = 'pt-BR', currency = 'BRL') {
  const value = (Number(cents) || 0) / 100;
  return value.toLocaleString(locale, { style: 'currency', currency });
}

/**
 * @param {number} cents
 * @returns {number} valor decimal (ex: 12345 -> 123.45)
 */
export function centsToAmount(cents) {
  return Math.round(Number(cents) || 0) / 100;
}

/**
 * @param {number} amount - valor decimal (ex: 123.45)
 * @returns {number} centavos (ex: 12345)
 */
export function amountToCents(amount) {
  return Math.round((Number(amount) || 0) * 100);
}

/**
 * Extrai centavos a partir de um texto colado (paste) - ex: colar
 * "150,00" ou "150.00" deve virar 15000 centavos.
 * @param {string} text
 */
export function centsFromPastedText(text) {
  const digits = String(text ?? '').replace(/\D/g, '');
  return digits === '' ? 0 : parseInt(digits, 10);
}

const DEFAULT_MAX_DIGITS = 12; // até R$ 9.999.999.999,99

/**
 * Processa uma tecla pressionada num input de moeda controlado.
 * Retorna o novo valor em centavos, ou `null` se a tecla deve seguir
 * o comportamento padrão do navegador (Tab, setas, Ctrl+C, etc).
 * @param {string} key - event.key
 * @param {number} currentCents
 * @param {object} [options]
 * @param {number} [options.maxDigits=12]
 */
export function reduceCurrencyKeydown(key, currentCents, { maxDigits = DEFAULT_MAX_DIGITS } = {}) {
  if (/^[0-9]$/.test(key)) {
    const next = currentCents * 10 + Number(key);
    const maxValue = 10 ** maxDigits - 1;
    return next > maxValue ? currentCents : next;
  }

  if (key === 'Backspace') {
    return Math.floor(currentCents / 10);
  }

  if (key === 'Delete') {
    return 0;
  }

  return null; // deixa o navegador tratar (Tab, setas, atalhos, etc.)
}
