import type { BookDto } from "../../dtos/books/book.dto";
import api from "../axios";

export async function getBooks() {
    return api.get('/books');
}

export async function getBookById(id: string) : Promise<BookDto> {
    const reponse = await api.get(`/books/${id}`);
    return reponse.data;
}
// export async function getBookById(id: string) {
//     const reponse = await api.get(`/books/${id}`);
//     return reponse.data;
// }
export async function addBook(book: BookDto) {
    return api.post('/books', book);
}

export async function editBook(book: BookDto) {
    const {id, ...payload} = book;

    return api.put(`/books/${id}`, payload);
}

export async function deleteBook(id: string) {
    return api.delete(`/books/${id}`);
}