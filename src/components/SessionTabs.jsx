// ARQUIVO: src/components/SessionTabs.jsx
// Em telas largas, separa os campos de cada sessão em duas sub-abas
// ("Pagamento" e "Seus dados") para reduzir o formulário visível de
// uma vez. Em mobile mantém o empilhamento único (comportamento
// original). Os painéis ficam sempre montados (display:none no
// inativo) para não perder estado dos campos ao trocar de aba.
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function SessionTabs({ paymentPane, dataPane, paymentLabel = 'Pagamento', dataLabel = 'Seus dados' }) {
  const isDesktop = useMediaQuery('(min-width:640px)');
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
      <Tabs
        className="pw-subtabs"
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        TabIndicatorProps={{ sx: { height: 2, borderRadius: 999 } }}
      >
        <Tab value="payment" label={paymentLabel} />
        <Tab value="data" label={dataLabel} />
      </Tabs>
      <Box sx={{ display: tab === 'payment' ? 'block' : 'none' }}>
        <Stack spacing={2.5}>{paymentPane}</Stack>
      </Box>
      <Box sx={{ display: tab === 'data' ? 'block' : 'none' }}>
        <Stack spacing={2.5}>{dataPane}</Stack>
      </Box>
    </Stack>
  );
}
