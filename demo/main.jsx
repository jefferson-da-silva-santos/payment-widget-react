import React from 'react';
import ReactDOM from 'react-dom/client';
import { PaymentWidget } from '../src/index.js';

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40, background: '#000', minHeight: '100vh' }}>
      <PaymentWidget
        apiBaseUrl="http://localhost:4000/api"
        publicKey="TEST-fake-public-key"
        amount={150.0}
        description="Pedido de teste"
        methods={['PIX', 'CREDIT_CARD', 'BOLETO']}
        onPaymentCreated={(p) => console.log('criado', p)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
