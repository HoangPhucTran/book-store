import api from "../axios";

export async function getUsers() {
    return api.get('/users');
}