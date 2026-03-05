import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import {useEffect, useState } from 'react';
import type { OrderDto, OrderRequestDto, StatusType } from '../../dtos/orders/order.dto';
import { DataGrid, useGridApiContext, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import type { UserDto } from '../../dtos/users/user.dto';
import type { BookDto } from '../../dtos/books/book.dto';
import { getUsers } from '../../api/users/user.api';
import { getBooks } from '../../api/books/book.api';

interface Props {
  open: boolean;
  order?: OrderRequestDto | null;
  onClose: () => void;
  onSubmit: (order: OrderRequestDto) => Promise<void>;
}

const initialForm: OrderRequestDto = {
    userId: '',
    bookId: [],
    quantity: null,
    status: 'PENDING'
}

const STATUS_TYPE: StatusType[] = ['PENDING', 'PAID', 'CANCELLED'];

type FormErrors = Partial<Record<keyof OrderRequestDto, string>>;

const validate = (data: OrderRequestDto): FormErrors => {
    const errs: FormErrors = {};

    if (data.userId === null || data.userId === undefined) 
        errs.userId = 'Buyer is required';

    if ( 
        !Array.isArray(data.bookId) || 
        data.bookId.length === 0 || 
        data.bookId.some(id => !id || !id.trim()) 
    ) {
        errs.bookId = 'Book is required';
    }

    if (data.quantity === null || data.quantity === undefined) 
        errs.quantity = 'Quantity is required';
    else if (!Number.isInteger(data.quantity) || data.quantity < 0) 
        errs.quantity = 'Quantity have to be integer and greater or equal 0';

    if (!STATUS_TYPE.includes(data.status as StatusType)) errs.status = 'Status is invalid';

    return errs;
};

interface BillItem {
  bookId: string;
  title: string;
  price: number ;
  quantity: number; // >= 1
}

export default function OrderPopupForm({ open, order, onClose, onSubmit }: Props) {
    const [userRows, setUserRows] = useState<UserDto[]>([]);
    const [bookRows, setBookRows] = useState<BookDto[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [bookLoading, setBookLoading] = useState(false);
    const [billItems, setBillItems] = useState<BillItem[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [form, setForm] = useState<OrderRequestDto>(initialForm);    

    useEffect(() => {
        if (!open)
            return;

        if ( order ) {
            setForm({
                ...order,
                quantity: order.quantity  ? Number(order.quantity) : null,
            });
        } 

        setUserLoading(true);
        setBookLoading(true);
        const onInit = () => {
            getUsers()
            .then((res) => setUserRows(res.data))
            .finally(() => setUserLoading(false));

            getBooks()
            .then((res) => setBookRows(res.data))
            .finally(() => setBookLoading(false));
        }

        onInit();
    }, [open, order]);

    const handleChange = (field: keyof OrderRequestDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = e.target.value;
        
        if (field === 'quantity' ) {
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

    const invoiceSubtotal = billItems.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
        <DialogTitle>{order ? "Edit" : "Add"} Order</DialogTitle>

        <DialogContent>
            <Grid container spacing={2} mt={1}>
                <Grid size={{xs: 6}} >
                    <DataGrid
                        aria-label="sticky table"
                        rows={userRows}
                        loading={userLoading}
                        columns={userColumns}
                        initialState={{
                            pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        rowSelectionModel={
                            form.userId
                            ? { type: 'include', ids: new Set([form.userId]) }
                            : { type: 'include', ids: new Set() }
                        }
                        onRowSelectionModelChange={(model) => {
                            const firstId = model.ids.values().next().value as string | undefined;

                            setForm(prev => ({
                            ...prev,
                            userId: firstId ?? '',
                            }));
                        }}
                        sx={{ border: 0 }}
                    />
                </Grid>
                <Grid size={{xs: 6}} >
                    <DataGrid
                        aria-label="sticky table"
                        rows={bookRows}
                        loading={bookLoading}
                        columns={bookColumns}
                        initialState={{
                            pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        checkboxSelection
                        onRowSelectionModelChange={(model) => {
                            const selectedIds = Array.from(model.ids) as string[];

                            setBillItems(prev => {
                            const next = [...prev];

                            selectedIds.forEach(id => {
                                if (!next.some(item => item.bookId === id)) {
                                    const book = bookRows.find(b => b.id === id);
                                    if (!book || !book.id || !book.price) return prev;

                                    if (book) {
                                        next.push({
                                            bookId: book.id,
                                            title: book.title,
                                            price: book.price,
                                            quantity: 1,
                                        });
                                    }
                                }
                            });

                            return next;
                            });

                            setForm(prev => ({
                            ...prev,
                            bookId: selectedIds,
                            }));
                        }}
                        sx={{ border: 0 }}
                    />
                </Grid>

                <Grid size={{xs: 12}} >
                    <Stack spacing={2} mt={1}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan={3}>
                                        Details
                                    </TableCell>
                                    <TableCell align="right">Price</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Items</TableCell>
                                    <TableCell align="right">Qty.</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Sum</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {billItems.map((item) => (
                                    <TableRow key={item.bookId}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{item.price}</TableCell>
                                    <TableCell align="right">{ccyFormat(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell rowSpan={2} />
                                    <TableCell colSpan={2}>Total Items</TableCell>
                                    <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2}>Total</TableCell>
                                    <TableCell align="right">{`${ccyFormat(5)} $`}</TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        
                        {/* <TextField
                            required
                            type='number'
                            label="Total Price"
                            value={form.totalPrice}
                            onChange={handleChange('totalPrice')}
                            error={!!errors.totalPrice}
                            helperText={errors.totalPrice}
                            fullWidth
                        />
                        <TextField
                            select
                            required
                            label="Status"
                            value={form.status}
                            onChange={handleChange('status')}
                            error={!!errors.status}
                            helperText={errors.status}
                            fullWidth
                        > 
                            {STATUS_TYPE.map((status) => (
                                <MenuItem key={status} value={status}>
                                {status}
                                </MenuItem>
                            ))}
                        </TextField> */}
                    </Stack>
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
                {order ? "Save" : "Create"}
            </Button>
        </DialogActions>
        </Dialog>
    );
}

const SeqCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();

  const { page, pageSize } = apiRef.current.state.pagination.paginationModel;

  const index = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

  return page * pageSize + index + 1;
};

const bookColumns: GridColDef[] = [
    {
        field: '',
        headerName: 'SEQ',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => <SeqCell {...params}/>
    },
    {
        field: 'title',
        headerName: 'Title',
        flex: 1,
    },
    {
        field: 'author',
        headerName: 'Author',
        flex: 1,
    },
    {
        field: 'price',
        headerName: 'Price',
        flex: 1,
    },
    {
        field: 'stock',
        headerName: 'Stock',
        flex: 1,
    }
];

const userColumns: GridColDef[] = [
    {
      field: '',
      headerName: 'SEQ',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => <SeqCell {...params}/>
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
    },
];

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

