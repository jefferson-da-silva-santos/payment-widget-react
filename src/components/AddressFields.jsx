// ARQUIVO: src/components/AddressFields.jsx
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { maskCep } from '../masks/document.js';

export default function AddressFields({ address, onChange, recentAddresses = [] }) {
  const update = (field) => (e) => onChange({ ...address, [field]: e.target.value });

  return (
    <Stack spacing={2}>
      {recentAddresses.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {recentAddresses.map((addr) => (
            <Chip
              key={addr.zipCode}
              label={`${addr.streetName}, ${addr.streetNumber}`}
              size="small"
              variant="outlined"
              onClick={() => onChange(addr)}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1.5 }}>
        <TextField
          label="CEP"
          value={address.zipCode}
          onChange={(e) => onChange({ ...address, zipCode: maskCep(e.target.value) })}
          placeholder="00000-000"
          inputMode="numeric"
        />
        <TextField
          label="UF"
          value={address.federalUnit}
          onChange={(e) => onChange({ ...address, federalUnit: e.target.value.toUpperCase().slice(0, 2) })}
          placeholder="SP"
        />
      </Box>

      <TextField label="Rua" value={address.streetName} onChange={update('streetName')} placeholder="Av. Paulista" />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <TextField label="Número" value={address.streetNumber} onChange={update('streetNumber')} placeholder="1000" />
        <TextField label="Bairro" value={address.neighborhood} onChange={update('neighborhood')} placeholder="Bela Vista" />
      </Box>

      <TextField label="Cidade" value={address.city} onChange={update('city')} placeholder="São Paulo" />
    </Stack>
  );
}
