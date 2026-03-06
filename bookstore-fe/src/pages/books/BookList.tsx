import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Box, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { addBook, deleteBook, editBook, getBookById, getBooks } from '../../api/books/book.api';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import type { BookDto } from '../../dtos/books/book.dto';
import AlertDialogForm from '../../components/common/AlertDialog';
import BookPopupForm from '../../components/books/BookPopupForm';

const SeqCell = (params: GridRenderCellParams) => {
  const apiRef = useGridApiContext();

  const { page, pageSize } = apiRef.current.state.pagination.paginationModel;

  const index = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

  return page * pageSize + index + 1;
};

export default function BookTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [pickedBook, setPickedBook] = useState<BookDto | null> (null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [confirmAlert, setConfirmAlert] = useState<((result: boolean) => void) | null>(null);

  useEffect(() => {
    setLoading(true);
    const onInit = () => {
      getBooks()
      .then((res) => setRows(res.data))
      .finally(() => setLoading(false));
    }

    onInit();
  },[]);

  const processRowUpdate = async (newRow: BookDto, oldRow: BookDto) => {
    try {
      await editBook(newRow);
      return newRow; // ?�� commit
    } catch (error) {
      console.error(error);
      return oldRow; // ?�� rollback
    }
  };

  const handleEditBook = async (id: string) => {
    try {
      const book = await getBookById(id);

      if (!book)
        return;

      setPickedBook(book);   
      setOpenForm(true);     
    } catch (err) {
      throw err;
    }
  };
  
  const handleDeleteBook = async (id: string) => {
    try {
      setOpenAlert(true);
      setAlertTitle("Delete Book");
      setAlertContent("Do you want to delete this book?");

      setConfirmAlert(() => async(ok: boolean) => {
        if(!ok)
          return;

        await deleteBook(id);
        setRows((prev) => prev.filter((row) => row.id !== id));
      })

    } catch (err) {
      throw err;
    }
  };

  const handleSubmitBook = async (book: BookDto) => {
    try {
      if(pickedBook !== null) {
        await editBook(book);
      }
      else {
        await addBook(book);
      }
      const res = await getBooks();
      setRows(res.data);
    } catch (err) {
      throw err;
    }
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
      editable: true,
    },
    {
      field: 'author',
      headerName: 'Author',
      flex: 1,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      editable: false,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
      editable: false,
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
          <IconButton aria-label="edit" onClick={() => handleEditBook(params.row.id)}><ModeEditIcon/></IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteBook(params.row.id)}><DeleteIcon /></IconButton>
        </>),
    }

  ];

  return (
    <Box sx={{ height: '55%', width: '100%' }}>

        <DataGrid
          rows={rows}
          columns={bookColumns}
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
            Add book
          </Button>
        </Box>

        {openForm && (
          <BookPopupForm
            open={openForm}
            book={pickedBook}
            onClose={() => {
              setOpenForm(false);
              setPickedBook(null);
            }}
            onSubmit={handleSubmitBook}
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
