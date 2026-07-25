// ARQUIVO: src/masks/document.js
// ==========================================================
// Máscara progressiva de CPF/CNPJ - detecta automaticamente qual dos
// dois pelo número de dígitos digitados (troca de padrão ao passar de
// 11 pra 12+ dígitos), sem precisar de um seletor "CPF ou CNPJ" à parte.
// ==========================================================

export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * @param {string} rawValue - texto do input (com ou sem máscara)
 * @returns {string} texto mascarado - CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
 */
export function maskDocument(rawValue) {
  const digits = onlyDigits(rawValue).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * @param {string} digits - já sem máscara
 * @returns {'CPF'|'CNPJ'}
 */
export function documentType(digits) {
  return onlyDigits(digits).length > 11 ? 'CNPJ' : 'CPF';
}

/**
 * Validação de dígito verificador de CPF (não só formato).
 * @param {string} rawValue
 */
export function isValidCpf(rawValue) {
  const cpf = onlyDigits(rawValue);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i += 1) sum += Number(base[i]) * (base.length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9));
  const d2 = calcDigit(cpf.slice(0, 9) + d1);
  return cpf === cpf.slice(0, 9) + String(d1) + String(d2);
}

/**
 * Validação de dígito verificador de CNPJ.
 * @param {string} rawValue
 */
export function isValidCnpj(rawValue) {
  const cnpj = onlyDigits(rawValue);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDigit = (base, weights) => {
    let sum = 0;
    for (let i = 0; i < base.length; i += 1) sum += Number(base[i]) * weights[i];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(cnpj.slice(0, 12), w1);
  const d2 = calcDigit(cnpj.slice(0, 12) + d1, w2);
  return cnpj === cnpj.slice(0, 12) + String(d1) + String(d2);
}

/**
 * @param {string} rawValue
 */
export function isValidDocument(rawValue) {
  const digits = onlyDigits(rawValue);
  return digits.length > 11 ? isValidCnpj(digits) : isValidCpf(digits);
}

/**
 * @param {string} rawValue
 * @returns {string} 00000-000
 */
export function maskCep(rawValue) {
  const digits = onlyDigits(rawValue).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
