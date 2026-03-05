import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  MenuItem
} from '@mui/material';
import {useEffect, useState } from 'react';
import type { UserDto, UserRole } from '../../dtos/users/user.dto';

interface Props {
  open: boolean;
  user?: UserDto | null;
  onClose: () => void;
  onSubmit: (user: UserDto) => Promise<void>;
}

const initialForm: UserDto = {
    id: '',
    name: '',
    username: '',
    password: '',
    role: 'USER',
}

type FormErrors = Partial<Record<keyof UserDto, string>>;

const validate = (data: UserDto): FormErrors => {
  const errs: FormErrors = {};

  if (!data.name.trim()) errs.name = 'Name is required';
  if (!data.username.trim()) errs.username = 'Username is required';
  if (!data.password.trim()) errs.password = 'Password is required';
  if (!data.role.trim()) errs.role = 'Role is required';

  return errs;
};

export default function UserPopupForm({ open, user, onClose, onSubmit }: Props) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [form, setForm] = useState<UserDto>(initialForm);
    const USER_ROLES: UserRole[] = ['ADMIN', 'USER'];
    
    useEffect(() => {
        if (open && user ) {
            setForm(user);
        }
    }, [open]);

    const handleChange = (field: keyof UserDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });

        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field]; 
            return copy;
        });
    };

    const handleSubmit = async () => {
        const validationErrors = validate(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await onSubmit(form);
        handleClose();
    };

    const handleClose = async () => {
        setForm(initialForm);
        setErrors({});
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} disableEnforceFocus fullWidth maxWidth="sm">
        <DialogTitle>{user ? "Edit" : "Add"} User</DialogTitle>

        <DialogContent>
            <Stack spacing={2} mt={1}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            </Box>
            <TextField
                required
                label="Name"
                value={form.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
            />
            <TextField
                required
                label="Username"
                value={form.username}
                onChange={handleChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
            />
            <TextField
                required
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
            />
            <TextField
                select
                required
                label="Role"
                value={form.role}
                onChange={handleChange('role')}
                error={!!errors.role}
                helperText={errors.role}
                fullWidth
            > 
                {USER_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                    {role}
                    </MenuItem>
                ))}
            </TextField>
            
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
                {user ? "Save" : "Create"}
            </Button>
        </DialogActions>
        </Dialog>
    );
}
