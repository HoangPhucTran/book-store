import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Box, Button, Chip, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { addOrder, deleteOrder, editOrder, getOrderById, getOrders } from '../../api/orders/order.api';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
// import OrderPopupForm from '../../components/orders/OrderPopupForm';
import AlertDialogForm from '../../components/common/AlertDialog';
import type {OrderDetailsResponseDto, OrderEditRequestDto, OrderListResponseDto, OrderRequestDto, StatusType } from '../../dtos/orders/order.dto';
import OrderPopupForm from '../../components/orders/OrderPopupForm';
import OrderDetailsPopupForm from '../../components/orders/OrderDetailsForm';

const SeqCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();

  const { page, pageSize } = apiRef.current.state.pagination.paginationModel;

  const index = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

  return page * pageSize + index + 1;
};

export default function OrderTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDetailsForm, setOpenDetailsForm] = useState(false);
  const [pickedOrder, setPickedOrder] = useState<OrderDetailsResponseDto | null> (null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [confirmAlert, setConfirmAlert] = useState<((result: boolean) => void) | null>(null);

  useEffect(() => {
    setLoading(true);
    const onInit = () => {
      getOrders()
      .then((res) => setRows(res.data))
      .finally(() => setLoading(false));
    }

    onInit();
  },[]);

  const processRowUpdate = async (newRow: OrderListResponseDto, oldRow: OrderListResponseDto) => {
    try {
      const editRow: OrderEditRequestDto = {
        id: newRow.id,
        status: newRow.status,
      }
      await editOrder(newRow);
      return newRow; // ✅ commit
    } catch (error) {
      console.error(error);
      return oldRow; // ✅ rollback
    }
  };

  const handleEditOrder = async (id: string) => {
    try {
      const order = await getOrderById(id);

      if (!order)
        return;

      console.log("Edit details", order);
      setPickedOrder(order);   
      setOpenDetailsForm(true);     
    } catch (err) {
      throw err;
    }
  };
  
  const handleDeleteOrder = async (id: string) => {
    try {
      setOpenAlert(true);
      setAlertTitle("Delete Order");
      setAlertContent("Do you want to delete this order?");

      setConfirmAlert(() => async(ok: boolean) => {
        if(!ok)
          return;

        await deleteOrder(id);
        setRows((prev) => prev.filter((row) => row.id !== id));
      })

    } catch (err) {
      throw err;
    }
  };

  const handleSubmitOrder = async (order: OrderRequestDto | OrderEditRequestDto) => {
    try {
      if(pickedOrder !== null) {
        await editOrder(order as OrderEditRequestDto);
      }
      else {
        await addOrder(order as OrderRequestDto);
      }
      const res = await getOrders();
      setRows(res.data);
    } catch (err) {
      throw err;
    }
  };

  const getStatusColor = ( status: StatusType) : 'warning' | 'success' | 'error' => {
    if (status === 'PAID') return 'success';
    if (status === 'CANCELLED') return 'error';
    return 'warning'; 
  };

  const orderColumns: GridColDef[] = [
    {
      field: '',
      headerName: 'SEQ',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => <SeqCell {...params}/>
    },
    {
      field: 'userName',
      headerName: 'Customer Name',
      flex: 1,
      editable: false,
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      flex: 1,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'singleSelect',
      flex: 1,
      editable: true,

      valueOptions: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'PAID', label: 'Paid' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],

      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'createDate',
      headerName: 'Create Date',
      flex: 1,
      type: 'dateTime',
      valueFormatter: (value) => {
        const date = new Date(value);
        return date.toLocaleString('vi-VN');
      },
      editable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton disableRipple aria-label="edit" onClick={() => handleEditOrder(params.row.id)}><ModeEditIcon/></IconButton>
          <IconButton disableRipple aria-label="delete" onClick={() => handleDeleteOrder(params.row.id)}><DeleteIcon /></IconButton>
        </>),
    }

  ];

  return (
    <Box sx={{ height: '55%', width: '100%' }}>

        <DataGrid
          rows={rows}
          columns={orderColumns}
          processRowUpdate={processRowUpdate}
          loading={loading}
          editMode="cell"
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          
          
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenForm(true)}
          >
            Add order
          </Button>
        </Box>

        {openDetailsForm && (
          <OrderDetailsPopupForm
            open={openDetailsForm}
            order={pickedOrder}
            onClose={() => {
              setOpenDetailsForm(false);
              setPickedOrder(null);
            }}
            onSubmit={handleSubmitOrder}
          />
        )}

        {openForm && (
          <OrderPopupForm
            open={openForm}
            onClose={() => {
              setOpenForm(false);
              setPickedOrder(null);
            }}
            onSubmit={handleSubmitOrder}
          />
        )}
        

        { openAlert && (
          <AlertDialogForm 
            open={openAlert}
            alertTitle={alertTitle}
            alertContent={alertContent}
            onClose={() => {
              setOpenAlert(false);
              setConfirmAlert(null); // reset
            }}
            onSubmit={(result) => {
              confirmAlert?.(result);
              setOpenAlert(false);
              setConfirmAlert(null); // reset
            }}
          />
        )}
    </Box>);
}
