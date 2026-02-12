import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface UnsavedChangesDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifiche non salvate</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hai delle modifiche non salvate. Sei sicuro di voler uscire? Le modifiche andranno perse.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Annulla
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Esci senza salvare
        </Button>
      </DialogActions>
    </Dialog>
  );
}

