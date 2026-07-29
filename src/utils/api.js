// ARQUIVO: src/utils/api.js
// ==========================================================
// Fala SÓ com o backend do integrador (apiBaseUrl) - nunca direto
// com o payment-system-mp. O componente não guarda nem vê token de
// API nenhum; quem tem o token é o backend do seu projeto.
//
// CONTRATO ESPERADO DO SEU BACKEND (mesmo formato do mp-test-client,
// que já construímos antes - reaproveite aquele server.js quase igual):
//
//   GET  {apiBaseUrl}/config              -> { publicKey }
//   POST {apiBaseUrl}/payments            -> cria pagamento
//   GET  {apiBaseUrl}/payments/:id        -> consulta (?syncWithMp=true opcional)
//   POST {apiBaseUrl}/payments/:id/refund
//   POST {apiBaseUrl}/payments/:id/cancel
//   GET  {apiBaseUrl}/payments/:id/receipt -> PDF do comprovante (só para APROVADOS)
//
// Todas as respostas JSON devem seguir o mesmo envelope do payment-system-mp:
//   { success, message, data, meta, timestamp }
// A rota de comprovante é a única exceção - devolve o PDF binário direto.
// ==========================================================

async function request(apiBaseUrl, path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(body?.message || `A API respondeu ${response.status}.`);
    error.statusCode = response.status;
    error.code = body?.code ?? null;
    error.details = body?.errors ?? null;
    throw error;
  }

  return body;
}

/**
 * @param {string} apiBaseUrl
 */
export function createApiClient(apiBaseUrl) {
  return {
    getConfig: () => request(apiBaseUrl, '/config'),
    createPayment: (payload) => request(apiBaseUrl, '/payments', { method: 'POST', body: payload }),
    getPayment: (id, { syncWithMp = false } = {}) =>
      request(apiBaseUrl, `/payments/${id}${syncWithMp ? '?syncWithMp=true' : ''}`),
    refundPayment: (id, amount) =>
      request(apiBaseUrl, `/payments/${id}/refund`, { method: 'POST', body: amount ? { amount } : {} }),
    cancelPayment: (id) => request(apiBaseUrl, `/payments/${id}/cancel`, { method: 'POST' }),
    // Não usa o helper `request` de propósito - o navegador abre/baixa
    // esse PDF direto (nova aba ou download), sem precisar de fetch +
    // parse de JSON. Navegação de <a href> não é bloqueada por CORS
    // (diferente de fetch/XHR lendo o corpo da resposta).
    getReceiptUrl: (id) => `${apiBaseUrl}/payments/${id}/receipt`,
  };
}