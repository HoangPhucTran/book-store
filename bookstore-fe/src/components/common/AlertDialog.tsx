import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import { Fragment } from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  alertTitle: string;
  alertContent: string;
  onClose: () => void;
  onSubmit: (isSubmit: boolean) => void;
}

export default function AlertDialogForm({ open, alertTitle, alertContent, onClose, onSubmit }: Props) {
  const handleClose = () => {
    onSubmit(false);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(true);
    onClose();
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{alertTitle ? alertTitle : "Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alertContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
