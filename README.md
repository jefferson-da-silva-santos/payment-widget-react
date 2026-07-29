# @payment-system-mp/react-widget

Componente React de checkout — Pix, cartão, boleto e saldo Mercado Pago
— pronto pra integrar em qualquer projeto que use o `payment-system-mp`
como backend de pagamentos.

## Instalação

⚠️ **O pacote NÃO está publicado no registro público do npm** — ele
só existe neste repositório GitHub. O comando **precisa** ter o
prefixo `github:`, senão o npm procura no registro público, não
encontra, e dá erro:

```bash
# ❌ ERRADO - procura no registro público do npm (não existe lá)
npm install @payment-system-mp/react-widget

# ✅ CERTO - busca direto deste repositório
npm install github:jefferson-da-silva-santos/payment-widget-react @mui/material @mui/icons-material @emotion/react @emotion/styled
```

O nome `@payment-system-mp/react-widget` é só o nome **interno** do
pacote (usado no `import`, dentro do `package.json` da lib) — ele não
tem relação com de onde o npm baixa o código. Isso é definido só pelo
que vem depois de `npm install` no terminal.

## ⚠️ Antes de tudo: o contrato do SEU backend

O componente **nunca** fala direto com o `payment-system-mp` — ele fala
com o **backend do seu próprio projeto**, que por sua vez tem o token
de API guardado com segurança (nunca no navegador). Isso é o mesmo
padrão de segurança usado em todos os outros projetos que já
integramos (currículo, mp-test-client).

Seu backend precisa expor 4 rotas, todas repassando pro
`payment-system-mp` com o `Authorization: Bearer <seu-token>` embutido
no servidor:

```
GET  {apiBaseUrl}/config              -> { publicKey }
POST {apiBaseUrl}/payments            -> cria pagamento
GET  {apiBaseUrl}/payments/:id        -> consulta (?syncWithMp=true opcional)
POST {apiBaseUrl}/payments/:id/refund
POST {apiBaseUrl}/payments/:id/cancel
GET  {apiBaseUrl}/payments/:id/receipt -> PDF do comprovante (só para pagamentos APROVADOS - resposta binária, não JSON)
```

Todas as respostas devem seguir o mesmo envelope do `payment-system-mp`
(`{ success, data, message, ... }`). Se você já tem o `server.js` do
`mp-test-client` que construímos antes, é **praticamente esse mesmo
arquivo** — copie e adapte.

## Uso básico

```jsx
import { PaymentWidget } from '@payment-system-mp/react-widget';

function Checkout() {
  return (
    <PaymentWidget
      apiBaseUrl="https://api.seuapp.com"
      publicKey="APP_USR-xxxx"
      amount={150.0}
      description="Pedido #123"
      externalReference="pedido-123"
      methods={['PIX', 'CREDIT_CARD', 'BOLETO']}
      theme="light"
      onPaymentApproved={(payment) => console.log('Pago!', payment)}
    />
  );
}
```

## Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `apiBaseUrl` | string | — | **obrigatório**. Base URL do seu backend |
| `publicKey` | string | — | **obrigatório**. Public key do Mercado Pago (segura pra expor) |
| `amount` | number | — | **obrigatório**. Valor a cobrar |
| `description` | string | — | Descrição do pagamento |
| `externalReference` | string | — | Referência do seu próprio sistema |
| `methods` | string[] | todos | `['PIX','CREDIT_CARD','DEBIT_CARD','BOLETO','ACCOUNT_MONEY']` — omita o que não quiser oferecer |
| `payer` | object | `{}` | Pré-preenche `{ email, firstName, lastName, document }` |
| `savedCards` | object[] | `[]` | Cartões salvos: `{ id, brand, lastFourDigits }` — ver limitação abaixo |
| `allowSaveCard` | boolean | `true` | Mostra o checkbox "salvar este cartão" |
| `onSaveCardRequested` | function | — | Chamado quando o usuário marca salvar — **você decide o que fazer** (ver limitação) |
| `persistDraft` | boolean | `true` | Salva progresso do formulário no localStorage |
| `draftKey` | string | `'pw-draft'` | Chave de armazenamento (isole por contexto se precisar) |
| `onPaymentCreated` | function | — | Chamado assim que o pagamento é criado (qualquer status) |
| `onPaymentApproved` | function | — | Chamado quando o status vira `APPROVED` (inclusive via polling) |
| `onError` | function | — | Chamado em qualquer falha de criação |
| `accentColor` | string | `#6d5ef8` | Sobrescreve a cor de destaque |
| `theme` | `'dark'` \| `'light'` | `'dark'` | Tema do componente - paleta própria pra cada um, não é só inverter cores |

## Sobre o tema (Material UI)

A partir da v2, o componente usa **Material UI** por baixo dos panos,
com um `<ThemeProvider>` próprio - o tema não vaza pro app hospedeiro,
e o app hospedeiro não interfere no tema do componente. De propósito
**não** usamos `<CssBaseline>` (isso resetaria estilos globais de
`html`/`body` do seu app, o que uma biblioteca embutida nunca deve
fazer).

Todos os menus, dropdowns e modais (que o MUI renderiza via Portal)
herdam a cor certa automaticamente, porque o MUI propaga o tema via
**contexto do React**, não via CSS variable - isso é inclusive o que
resolveu de vez o bug do dropdown de parcelas com fundo transparente
que tínhamos na versão anterior (baseada em Radix UI).

## ⚠️ Limitação importante: cartões e endereços salvos

O componente está **pronto pra receber** cartões salvos (`savedCards`)
e já sugere endereços recentes **deste navegador** (`localStorage`,
funciona hoje, sem mudança nenhuma no backend). Mas:

- **Salvar cartão de verdade, reutilizável em qualquer dispositivo**,
  exige a API de **Customers & Cards** do Mercado Pago
  (`POST /v1/customers`, `POST /v1/customers/{id}/cards`) — isso é uma
  superfície da API do Mercado Pago **diferente** da que o
  `payment-system-mp` implementa hoje (que só cria pagamentos avulsos).
  O `payment-system-mp` também não tem, hoje, o conceito de "cliente
  final" (só conhece o "Client" = o SaaS que consome a API) — precisa
  de um model novo pra isso.
- **Endereço salvo entre dispositivos** (não só neste navegador) tem a
  mesma limitação — precisaria desse mesmo conceito de cliente final.

O componente já expõe os *slots* certos (`savedCards`,
`onSaveCardRequested`) pra você plugar isso assim que o backend
existir — só não finge que já funcina hoje.

## Máscaras (exportadas separadamente, se quiser usar sozinhas)

```js
import { formatCentsToCurrency, reduceCurrencyKeydown } from '@payment-system-mp/react-widget';
import { maskDocument, isValidCpf } from '@payment-system-mp/react-widget';
import { maskCardNumber, detectCardBrand } from '@payment-system-mp/react-widget';
```

Validadas em `scripts/validate-masks.mjs` (`npm run test:masks`).