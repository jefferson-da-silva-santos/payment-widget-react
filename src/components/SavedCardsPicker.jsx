// ARQUIVO: src/components/SavedCardsPicker.jsx
// ==========================================================
// Lista de cartões salvos, vinda de fora via prop `savedCards`.
// Ver README: só EXIBE e deixa ESCOLHER - não persiste nada sozinho.
// ==========================================================
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function SavedCardsPicker({ savedCards, selected, onSelect }) {
  if (!savedCards || savedCards.length === 0) return null;

  return (
    <RadioGroup value={selected ?? 'new'} onChange={(e) => onSelect(e.target.value)}>
      <Stack spacing={1}>
        {savedCards.map((card) => (
          <Paper
            key={card.id}
            variant="outlined"
            sx={{
              px: 1.5,
              borderColor: selected === card.id ? 'primary.main' : 'divider',
              bgcolor: selected === card.id ? 'action.selected' : 'transparent',
            }}
          >
            <FormControlLabel
              value={card.id}
              control={<Radio size="small" />}
              sx={{ width: '100%', m: 0, py: 0.5 }}
              label={
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <Typography variant="body2">•••• {card.lastFourDigits}</Typography>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                    {card.brand}
                  </Typography>
                </Stack>
              }
            />
          </Paper>
        ))}

        <Paper variant="outlined" sx={{ px: 1.5, borderColor: selected === 'new' ? 'primary.main' : 'divider' }}>
          <FormControlLabel value="new" control={<Radio size="small" />} label="Usar outro cartão" sx={{ width: '100%', m: 0, py: 0.5 }} />
        </Paper>
      </Stack>
    </RadioGroup>
  );
}
