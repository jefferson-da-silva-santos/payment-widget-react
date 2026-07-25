// ARQUIVO: src/components/MethodSelector.jsx
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

const METHOD_LABEL = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  BOLETO: 'Boleto',
  ACCOUNT_MONEY: 'Saldo Mercado Pago',
};

/**
 * @param {object} props
 * @param {string[]} props.methods - métodos habilitados, na ordem de exibição
 * @param {string} props.active
 * @param {(method: string) => void} props.onChange
 */
export default function MethodSelector({ methods, active, onChange }) {
  if (methods.length <= 1) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}>
      <Tabs
        value={active}
        onChange={(_, value) => onChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{ sx: { height: 2, borderRadius: 999 } }}
      >
        {methods.map((method, index) => (
          <Tab
            key={method}
            value={method}
            label={METHOD_LABEL[method] ?? method}
            iconPosition="start"
            icon={
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: active === method ? 'primary.main' : 'action.selected',
                  color: active === method ? 'primary.contrastText' : 'text.secondary',
                }}
              >
                {index + 1}
              </Avatar>
            }
            sx={{
              minHeight: 44,
              fontSize: 12.5,
              fontWeight: 650,
              textTransform: 'none',
              gap: 1,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export { METHOD_LABEL };