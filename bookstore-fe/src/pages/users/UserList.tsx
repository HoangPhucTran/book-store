import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Box, Button, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const SeqCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();

  const { page, pageSize } =
    apiRef.current.state.pagination.paginationModel;

  const index =
    apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

  return page * pageSize + index + 1;
};

export default function UserTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [open, setOpen] = useState(false);
//   const [result, setResult] = useState<ImportResult | any>(null);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    // setLoading(true);
    // const onInit = () => {
    //   getUsers()
    //   .then((res) => setRows(res.data))
    //   .finally(() => setLoading(false));
    // }

    // onInit();

    // connectUserSocket(getToken() || '');

    // onUserListUpdate(() => {
    //   console.log('User list updated realtime');
    //   getUsers().then((res) => setRows(res.data));
    // });
    
  }, []);

//   const processRowUpdate = async (newRow: User, oldRow: User) => {
//     try {
//       await editUser(newRow);
//       return newRow; // ✅ commit
//     } catch (error) {
//       console.error(error);
//       return oldRow; // ✅ rollback
//     }
//   };
  
//   const handleDeleteUser = async (id: string) => {
//     try {
//       const res = await deleteUser(id);

//       setRows((prev) => prev.filter((row) => row.id !== id));

//       setAlert({
//         type: 'success',
//         message: 'Delete user thành công',
//       });
//     } catch (err) {
//       setAlert({
//         type: 'error',
//         message: 'Delete user thất bại',
//       });
//     }
//   };

//   const handleCreateUser = async (user: User, avatarFile?: File | null) => {
//     try {
//       const response = await createUser({...user, avatarUrl: ''});
//       const createdUser = response.data;

//       if(avatarFile) {
//         await uploadAvatar(createdUser.id,  avatarFile);
//       }
//       const res = await getUsers();
//       setRows(res.data);

//       setAlert({
//         type: 'success',
//         message: 'Create user thành công',
//       });
//     } catch (err) {
//       setAlert({
//         type: 'error',
//         message: 'Create user thất bại',
//       });
//       throw err;
//     }
//   };

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files)
//       return;

//     const file = e.target.files[0];

//     const formData = new FormData();
//     formData.append('file', file);

//      try {
//       const result = await uploadFile(formData);

//       console.log("result", result);
//       setOpen(true);
//       setResult(result.data);

//       const res = await getUsers();
//       setRows(res.data);

//       setAlert({
//         type: 'success',
//         message: 'Upload users thành công',
//       });
//     } catch (err) {
//       setAlert({
//         type: 'error',
//         message: 'Upload users thất bại',
//       });
//       throw err;
//     }
//   }

  const userColumns: GridColDef[] = [
    {
      field: 'seq',
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
      field: 'password',
      headerName: 'Password',
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
          label={params.value ? 'ADMIN' : 'USER'}
          color={params.value ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          {/* <button onClick={() => handleEditUser(params.row)}>Edit</button> */}
          {/* <IconButton aria-label="delete" onClick={() => handleDeleteUser(params.row.id)}><DeleteIcon /></IconButton> */}
        </>),
    }

  ];

  return (
    <Box sx={{ height: '55%', width: '100%' }}>

        {/* {result && (
  <ImportResultDialog
    open={open}
    onClose={() => setOpen(false)}
    result={result}
  />
)} */}
        <DataGrid
          rows={rows}
          columns={userColumns}
          loading={loading}
          editMode="cell"
        //   processRowUpdate={processRowUpdate}
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
          <Box sx={{mr: 'auto'}}>
            <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            >
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                // onChange={handleUpload}
              />
            </Button>

            <Button
            variant="outlined"
            component='a'
            sx={{ ml: 1 }}
            // href={getDownloadUrl("user-template.csv")}
            download
            startIcon={<CloudDownloadIcon />}
            >
              Download CSV Template
            </Button>
          </Box>
          
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenForm(true)}
          >
            Add user
          </Button>
        </Box>

        {/* <UserFormDialog
          open={openForm}
          onClose={() => setOpenForm(false)}
        //   onSubmit={handleCreateUser}
        /> */}
    </Box>);
}
