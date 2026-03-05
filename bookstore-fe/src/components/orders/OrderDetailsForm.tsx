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
} from "@mui/material";

import { useEffect, useState } from "react";

import type {
  OrderDetailsResponseDto,
  OrderRequestDto,
  StatusType,
} from "../../dtos/orders/order.dto";

interface Props {
  open: boolean;
  order?: OrderDetailsResponseDto;
  onClose: () => void;
  onSubmit: (order: OrderRequestDto) => Promise<void>;
}

const STATUS_TYPE: StatusType[] = ["PENDING", "PAID", "CANCELLED"];

type FormErrors = {
  userId?: string;
  status?: string;
  item?: {
    bookId?: string;
    quantity?: string;
  }[];
};

const initialForm: OrderRequestDto = {
  userId: "",
  status: "PENDING",
  totalPrice: 0,
  item: [],
};

const validate = (data: OrderRequestDto): FormErrors => {
  const errs: FormErrors = {};

  if (!data.userId?.trim()) errs.userId = "Buyer is required";

  if (!Array.isArray(data.item) || data.item.length === 0) {
    errs.item = [{ bookId: "Book is required" }];
    return errs;
  }

  const itemErrors: FormErrors["item"] = [];

  data.item.forEach((item, index) => {
    const itemErr: { bookId?: string; quantity?: string } = {};

    if (!item.bookId?.trim()) itemErr.bookId = "Book is required";

    if (item.quantity === null || item.quantity === undefined)
      itemErr.quantity = "Quantity is required";
    else if (!Number.isInteger(item.quantity) || item.quantity <= 0)
      itemErr.quantity = "Quantity must be integer > 0";

    itemErrors[index] = itemErr;
  });

  if (itemErrors.some((e) => Object.keys(e).length > 0)) errs.item = itemErrors;

  if (!STATUS_TYPE.includes(data.status as StatusType))
    errs.status = "Status invalid";

  return errs;
};

export default function OrderDetailsPopupForm({
  open,
  order,
  onClose,
  onSubmit,
}: Props) {
  const [orderDetails, setOrderDetails] =
    useState<OrderDetailsResponseDto | null>(null);

  const [form, setForm] = useState<OrderRequestDto>(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open || !order) return;

    setOrderDetails(order);

    setForm({
      userId: order.userId,
      status: order.status,
      totalPrice: order.totalPrice,
      item: order.item.map((i) => ({
        bookId: i.bookId,
        quantity: i.quantity,
        price: i.price,
      })),
    });
  }, [open, order]);

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
        totalPrice,
      };

      setOrderDetails(newOrderDetails);

      const newForm: OrderRequestDto = {
        userId: newOrderDetails.userId,
        status: newOrderDetails.status,
        totalPrice,
        item: newItems.map((i) => ({
          bookId: i.bookId,
          quantity: i.quantity,
          price: i.price,
        })),
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
                            sx={{ width: 120 }}
                          />
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
                      <TableCell colSpan={2}>Total Items</TableCell>
                      <TableCell align="right">{totalItem}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align="right">
                        {ccyFormat(totalPrice)} $
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