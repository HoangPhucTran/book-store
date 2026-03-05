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
  TextField,
} from '@mui/material';
import {useEffect, useState } from 'react';
import type { OrderRequestDto, StatusType } from '../../dtos/orders/order.dto';
import { DataGrid, useGridApiContext, type GridColDef, type GridRenderCellParams, type GridRowParams } from '@mui/x-data-grid';
import type { UserDto } from '../../dtos/users/user.dto';
import type { BookDto } from '../../dtos/books/book.dto';
import { getUsers } from '../../api/users/user.api';
import { getBooks } from '../../api/books/book.api';
import CustomFooter from '../common/CustomFooter';

interface Props {
  open: boolean;
  order?: OrderRequestDto | null;
  onClose: () => void;
  onSubmit: (order: OrderRequestDto) => Promise<void>;
}

const initialForm: OrderRequestDto = {
    userId: '',
    status: 'PENDING',
    item: [
        {
            bookId: '',
            quantity: null,
            price: null
        },
    ],
    totalPrice: null
}

const STATUS_TYPE: StatusType[] = ['PENDING', 'PAID', 'CANCELLED'];

type FormErrors = {
    userId?: string,
    status?: string,
    item?: {
        bookId?: string,
        quantity?: string
    }[],
};

const validate = (data: OrderRequestDto): FormErrors => {
    const errs: FormErrors = {};

    if (data.userId === null || data.userId === undefined || data.userId.trim() === '') 
        errs.userId = 'Buyer is required';

    if ( 
        !Array.isArray(data.item) || 
        data.item.length === 0    ) {
        errs.item = [{bookId: 'Book is required'}];

        return errs;
    }

    const itemErrors: FormErrors["item"] = [];

    data.item.forEach((item, index) => {
        const itemErr: { bookId?: string; quantity?: string } = {};

        if (!item.bookId || !item.bookId.trim()) {
            itemErr.bookId = "Book is required";
        }

        if (item.quantity === null || item.quantity === undefined) {
            itemErr.quantity = "Quantity is required";
        } 
        else if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            itemErr.quantity = "Quantity must be integer > 0";
        }

        itemErrors[index] = itemErr;
    });

    if (itemErrors.some(e => Object.keys(e).length > 0)) {
        errs.item = itemErrors;
    }

    if (!STATUS_TYPE.includes(data.status as StatusType) ) errs.status = 'Status is invalid';

    console.log('Check Error', errs);

    return errs;
};

interface BillItem {
  bookId: string;
  title: string;
  price: number ;
  quantity: number; 
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

        console.log("Form change", billItems);

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

    const handleQuantityChange = (bookId: string, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        const newBillItems = billItems.map(b =>
            b.bookId === bookId ? { ...b, quantity: value } : b
        );

        setBillItems(newBillItems);

        const newForm = {
            ...form,
            totalPrice: totalPrice,
            item: newBillItems.map(b => ({
                bookId: b.bookId,
                quantity: b.quantity,
                price: b.price
            }))
        };

        setForm(newForm);

        setErrors(validate(newForm));
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

    const totalPrice = billItems.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
    );

    const totalItem = billItems.reduce(
        (sum, i) => sum + i.quantity,
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

                            const newForm = {
                                ...form,
                                userId: firstId ?? '',
                            };

                            setForm(newForm);
                            setErrors(validate(newForm)); 
                        }}
                        sx={{ border: 0 }}
                        
                        slots={{
                            footer: () => <CustomFooter error={errors.userId}/>
                        }}
                    />

                </Grid>
                <Grid size={{xs: 6}} >
                    <DataGrid
                        aria-label="sticky table"
                        rows={bookRows}
                        loading={bookLoading}
                        columns={bookColumns}
                        isRowSelectable={(params: GridRowParams) => params.row.stock > 0}
                        initialState={{
                            pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        checkboxSelection
                        rowSelectionModel={
                            {
                                type: 'include',
                                ids: new Set(billItems.map(b => b.bookId))
                            }
                        }
                        onRowSelectionModelChange={(model) => {
                            const selectedIds = Array.from(model.ids) as string[];

                            setBillItems(prev => {

                                const next = prev.filter(item => selectedIds.includes(item.bookId));

                                selectedIds.forEach(id => {
                                    if (!next.some(item => item.bookId === id)) {
                                        const book = bookRows.find(b => b.id === id);
                                        if (!book || !book.id || !book.price) 
                                            return;

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

                                const newForm = {
                                    ...form,
                                    item: next.map(b => ({
                                        bookId: b.bookId,
                                        quantity: b.quantity,
                                        price: b.price
                                    }))
                                };

                                setForm(newForm);
                                setErrors(validate(newForm)); 

                                return next;
                            });
                        }}
                        sx={{ border: 0 }}

                        slots={{
                            footer: () => <CustomFooter error={errors.item?.find(e => e.bookId)?.bookId}/>
                        }}
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
                                {billItems.map((item, index) => (
                                    <TableRow key={item.bookId}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            required
                                            sx={{width: 200}}
                                            type='number'
                                            value={item.quantity}
                                            onChange={handleQuantityChange(item.bookId, index)}
                                            error={!!errors.item?.[index]?.quantity}
                                            helperText={errors.item?.[index]?.quantity}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell align="right">{item.price}</TableCell>
                                    <TableCell align="right">{ccyFormat(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell rowSpan={2} />
                                    <TableCell colSpan={2}>Total Items</TableCell>
                                    <TableCell align="right">{ccyFormat(totalItem)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2}>Total</TableCell>
                                    <TableCell align="right">{`${ccyFormat(totalPrice)} $`}</TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
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