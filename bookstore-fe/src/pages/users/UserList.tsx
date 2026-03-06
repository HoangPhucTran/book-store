import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Box, Button, Chip, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { addUser, deleteUser, editUser, getUserById, getUsers } from '../../api/users/user.api';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import type { UserDto } from '../../dtos/users/user.dto';
import UserPopupForm from '../../components/users/UserPopupForm';
import AlertDialogForm from '../../components/common/AlertDialog';

const SeqCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();

  const { page, pageSize } = apiRef.current.state.pagination.paginationModel;

  const index = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

  return page * pageSize + index + 1;
};

export default function UserTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [pickedUser, setPickedUser] = useState<UserDto | null> (null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [confirmAlert, setConfirmAlert] = useState<((result: boolean) => void) | null>(null);

  useEffect(() => {
    setLoading(true);
    const onInit = () => {
      getUsers()
      .then((res) => setRows(res.data))
      .finally(() => setLoading(false));
    }

    onInit();
  },[]);

  const processRowUpdate = async (newRow: UserDto, oldRow: UserDto) => {
    try {
      await editUser(newRow);
      return newRow; // ?�� commit
    } catch (error) {
      console.error(error);
      return oldRow; // ?�� rollback
    }
  };

  const handleEditUser = async (id: string) => {
    try {
      const user = await getUserById(id);

      if (!user)
        return;

      setPickedUser(user);   
      setOpenForm(true);     
    } catch (err) {
      throw err;
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    try {
      setOpenAlert(true);
      setAlertTitle("Delete User");
      setAlertContent("Do you want to delete this user?");

      setConfirmAlert(() => async(ok: boolean) => {
        if(!ok)
          return;

        await deleteUser(id);
        setRows((prev) => prev.filter((row) => row.id !== id));
      })

    } catch (err) {
      throw err;
    }
  };

  const handleSubmitUser = async (user: UserDto) => {
    try {
      if(pickedUser !== null) {
        await editUser(user);
      }
      else {
        await addUser(user);
      }
      const res = await getUsers();
      setRows(res.data);
    } catch (err) {
      throw err;
    }
  };

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
      editable: true,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      type: 'singleSelect',
      flex: 1,
      editable: true,

      valueOptions: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'USER', label: 'User' },
      ],

      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ADMIN' ? 'success' : 'warning'}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'createDate',
      headerName: 'Create Date',
      flex: 1,
      editable: false,
      type: 'dateTime',
      valueFormatter: (value) => {
        const date = new Date(value);
        return date.toLocaleString('vi-VN');
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEditUser(params.row.id)}><ModeEditIcon/></IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteUser(params.row.id)}><DeleteIcon /></IconButton>
        </>),
    }
  ];

  return (
    <Box sx={{ height: '55%', width: '100%' }}>

        <DataGrid
          rows={rows}
          columns={userColumns}
          loading={loading}
          editMode="cell"
          processRowUpdate={processRowUpdate}
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
            Add user
          </Button>
        </Box>

        {openForm && (
          <UserPopupForm
            open={openForm}
            user={pickedUser}
            onClose={() => {
              setOpenForm(false);
              setPickedUser(null);
            }}
            onSubmit={handleSubmitUser}
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
