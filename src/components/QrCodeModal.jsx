// ARQUIVO: src/components/QrCodeModal.jsx
import { useState, cloneElement } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

export default function QrCodeModal({ qrCodeBase64, trigger }) {
  const [open, setOpen] = useState(false);
  const src = `data:image/png;base64,${qrCodeBase64}`;

  return (
    <>
      {cloneElement(trigger, { onClick: () => setOpen(true) })}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          Escaneie com o app do seu banco
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
          <Box component="img" src={src} alt="QR Code Pix ampliado" sx={{ width: 320, height: 320, maxWidth: '100%' }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
