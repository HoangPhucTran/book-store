import type { UserDto } from "../../dtos/users/user.dto";
import api from "../axios";

export async function getUsers() {
    return api.get('/users');
}

export async function getUserById(id: string) {
    const reponse = await api.get(`/users/${id}`);
    return reponse.data;
}

export async function addUser(user: UserDto) {
    return api.post('/users', user);
}

export async function editUser(user: UserDto) {
    const {id, ...payload} = user;

    return api.put(`/users/${id}`, payload);
}

export async function deleteUser(id: string) {
    return api.delete(`/users/${id}`);
}