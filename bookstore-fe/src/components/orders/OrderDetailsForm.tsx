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
  MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";

import type {
  OrderDetailsResponseDto,
  OrderEditRequestDto,
  StatusType,
} from "../../dtos/orders/order.dto";

interface Props {
  open: boolean;
  order: OrderDetailsResponseDto | null;
  onClose: () => void;
  onSubmit: (order: OrderEditRequestDto) => Promise<void>;
}

const STATUS_TYPE: StatusType[] = ["PENDING", "PAID", "CANCELLED"];

type FormErrors = {
  status?: string;
  item?: {
    bookId?: string;
    quantity?: string;
  }[];
};

const validate = (data: OrderEditRequestDto, orderDetails: OrderDetailsResponseDto | null): FormErrors => {
  const errs: FormErrors = {};

  if (!Array.isArray(data.item) || data.item.length === 0) {
    errs.item = [{ bookId: "Book is required" }];
    return errs;
  }

  const itemErrors: FormErrors["item"] = [];

  data.item.forEach((item, index) => {
    const itemErr: { bookId?: string; quantity?: string } = {};

    if (item.quantity === null || item.quantity === undefined)
      itemErr.quantity = "Quantity is required";
    else if (!Number.isInteger(item.quantity) || item.quantity <= 0)
      itemErr.quantity = "Quantity must be integer and > 0";
    else if ( orderDetails && item.quantity > orderDetails.item[index].stock )
      itemErr.quantity = "Quantity must be less than stock quantity";

    itemErrors[index] = itemErr;
  });

  if (itemErrors.some((e) => Object.keys(e).length > 0)) errs.item = itemErrors;

  if (!STATUS_TYPE.includes(data.status as StatusType))
    errs.status = "Status invalid";

  return errs;
};

const initialForm: OrderEditRequestDto = {
  id: "",
  status: 'PENDING',
  item: [
    {
      bookId: '',
      quantity: null,
    },
  ],
  totalPrice: null,
}

export default function OrderDetailsPopupForm({
  open,
  order,
  onClose,
  onSubmit,
}: Props) {
  const [orderDetails, setOrderDetails] =
    useState<OrderDetailsResponseDto | null>(null);

  const [form, setForm] = useState<OrderEditRequestDto>(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open || !order) return;

    setOrderDetails(order);

    setForm({
      id: order.id,
      status: order.status,
      totalPrice: order.totalPrice,
      item: order.item.map((i) => ({
        bookId: i.bookId,
        quantity: i.quantity,
      })),
    });
  }, [open, order]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newForm = {
          ...form,
          status: e.target.value as StatusType
      };

      setForm(newForm);
      setErrors(validate(newForm, orderDetails));
  };

  const handleQuantityChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!orderDetails) return;

      const value = Number(e.target.value);

      const newItems = orderDetails.item.map((item, i) =>
        i === index ? { ...item, quantity: value } : item
      );

      const totalPrice = newItems.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
      );

      const newOrderDetails = {
        ...orderDetails,
        item: newItems,
        totalPrice: totalPrice,
      };

      setOrderDetails(newOrderDetails);

      const newForm: OrderEditRequestDto = {
        id: orderDetails.id,
        status: newOrderDetails.status,
        totalPrice,
        item: newItems.map((i) => ({
          bookId: i.bookId,
          quantity: i.quantity,
        })),
      };

      setForm(newForm);
      setErrors(validate(newForm, newOrderDetails));
    };

  const handleSubmit = async () => {
    const validationErrors = validate(form, orderDetails);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(form);
    handleClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    setOrderDetails(null);
    onClose();
  };

  const totalPrice =
    orderDetails?.item.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    ) ?? 0;

  const totalItem =
    orderDetails?.item.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Edit Order</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid size={{xs: 12}}>
            <Stack spacing={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Items</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Stock Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Sum</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orderDetails?.item.map((item, index) => (
                      <TableRow key={item.bookId}>
                        <TableCell>{item.title}</TableCell>

                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={handleQuantityChange(index)}
                            error={!!errors.item?.[index]?.quantity}
                            helperText={errors.item?.[index]?.quantity}
                            sx={{ width: 160 }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          {item.stock}
                        </TableCell>

                        <TableCell align="right">
                          {ccyFormat(item.price)}
                        </TableCell>

                        <TableCell align="right">
                          {ccyFormat(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell colSpan={4}>Customer</TableCell>
                      <TableCell align="right">{orderDetails?.name}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={4}>Total Items</TableCell>
                      <TableCell align="right">{totalItem}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={4}>Total</TableCell>
                      <TableCell align="right">
                        {ccyFormat(totalPrice)} $
                      </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4}>Order Status</TableCell>
                        <TableCell align="right">
                            <TextField
                            select
                            required
                            sx={{ width: 150, textAlign: 'center' }}
                            value={form.status}
                            onChange={handleStatusChange}
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            {STATUS_TYPE.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                        </TableCell>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ccyFormat(num: number | string | null | undefined) {
  return Number(num ?? 0).toFixed(2);
}