import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import {useEffect, useState } from 'react';
import type { BookDto } from '../../dtos/books/book.dto';

interface Props {
  open: boolean;
  book?: BookDto | null;
  onClose: () => void;
  onSubmit: (book: BookDto) => Promise<void>;
}

const initialForm: BookDto = {
    id: '',
    title: '',
    author: '',
    price: null,
    stock: null
}

type FormErrors = Partial<Record<keyof BookDto, string>>;

const validate = (data: BookDto): FormErrors => {
  const errs: FormErrors = {};

  if (!data.title.trim()) errs.title = 'Title is required';
  if (!data.author.trim()) errs.author = 'Author is required';

  if (data.price === null || data.price === undefined) 
    errs.price = 'Price is required';
  else if (!Number.isFinite(data.price) || data.price < 0) 
    errs.price = 'Price have to be number and greater or equal 0';

  if (data.stock === null || data.stock === undefined) 
    errs.stock = 'Stock is required';
  else if (!Number.isInteger(data.stock) || data.stock < 0) 
    errs.stock = 'Stock have to be Integer and greater or equal 0';

  return errs;
};

export default function BookPopupForm({ open, book, onClose, onSubmit }: Props) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [form, setForm] = useState<BookDto>(initialForm);
    

    useEffect(() => {
        if (!open)
            return;

        if ( book ) {
            setForm({
                ...book,
                price: book.price  ? Number(book.price) : null,
                stock: book.stock  ? Number(book.stock) : null,
            });
        } 
    }, [open, book]);

    const handleChange = (field: keyof BookDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = e.target.value;
        
        if (field === 'price' || field === 'stock') {
            const n = e.target.valueAsNumber;
            value = Number.isNaN(n) ? null : n;
        }
        
        setForm({ ...form, [field]: value });

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
        <DialogTitle>{book ? "Edit" : "Add"} Book</DialogTitle>

        <DialogContent>
            <Stack spacing={2} mt={1}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            </Box>
            <TextField
                required
                label="Title"
                value={form.title}
                onChange={handleChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
            />
            <TextField
                required
                label="Author"
                value={form.author}
                onChange={handleChange('author')}
                error={!!errors.author}
                helperText={errors.author}
                fullWidth
            />
            <TextField
                required
                label="Price"
                type="number"
                value={form.price}
                onChange={handleChange('price')}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
            />
            <TextField
                required
                label="Stock"
                type="number"
                value={form.stock}
                onChange={handleChange('stock')}
                error={!!errors.stock}
                helperText={errors.stock}
                fullWidth
            > 
            </TextField>
            
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
                {book ? "Save" : "Create"}
            </Button>
        </DialogActions>
        </Dialog>
    );
}
