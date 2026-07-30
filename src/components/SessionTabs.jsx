// ARQUIVO: src/components/SessionTabs.jsx
// Em telas largas, separa os campos de cada sessão em duas sub-abas
// ("Pagamento" e "Seus dados") usando um controle segmentado discreto
// (não compete visualmente com as abas de método no topo). Em mobile
// (e em janelas médias) mantém o empilhamento único, comportamento
// original. Os painéis ficam sempre montados (display:none no
// inativo) para não perder estado dos campos ao trocar de aba.
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function SessionTabs({ paymentPane, dataPane, paymentLabel = 'Pagamento', dataLabel = 'Seus dados' }) {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const [tab, setTab] = useState('payment');

  if (!isDesktop) {
    return (
      <Stack spacing={2.5}>
        {paymentPane}
        {dataPane}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Box className="pw-segmented" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'payment'} className={tab === 'payment' ? 'is-active' : ''} onClick={() => setTab('payment')}>
          {paymentLabel}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'data'} className={tab === 'data' ? 'is-active' : ''} onClick={() => setTab('data')}>
          {dataLabel}
        </button>
      </Box>
      <Box sx={{ display: tab === 'payment' ? 'block' : 'none' }}>
        <Stack spacing={2.5}>{paymentPane}</Stack>
      </Box>
      <Box sx={{ display: tab === 'data' ? 'block' : 'none' }}>
        <Stack spacing={2.5}>{dataPane}</Stack>
      </Box>
    </Stack>
  );
}
