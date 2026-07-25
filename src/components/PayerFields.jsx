// ARQUIVO: src/components/PayerFields.jsx
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { maskDocument, isValidDocument } from '../masks/document.js';

export default function PayerFields({ payer, onChange, errors = {} }) {
  const update = (field) => (e) => onChange({ ...payer, [field]: e.target.value });
  const documentError = errors.document || (payer.document && !isValidDocument(payer.document) ? 'Documento inválido' : '');

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <TextField label="Nome" value={payer.firstName} onChange={update('firstName')} placeholder="Ana" error={!!errors.firstName} helperText={errors.firstName} />
        <TextField label="Sobrenome" value={payer.lastName} onChange={update('lastName')} placeholder="Silva" error={!!errors.lastName} helperText={errors.lastName} />
      </Box>

      <TextField
        label="E-mail"
        type="email"
        value={payer.email}
        onChange={update('email')}
        placeholder="voce@exemplo.com"
        error={!!errors.email}
        helperText={errors.email}
      />

      <TextField
        label="CPF ou CNPJ"
        value={payer.document}
        onChange={(e) => onChange({ ...payer, document: maskDocument(e.target.value) })}
        placeholder="000.000.000-00"
        inputMode="numeric"
        error={!!documentError}
        helperText={documentError}
      />
    </Stack>
  );
}
