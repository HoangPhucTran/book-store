import type { OrderDto, OrderRequestDto } from "../../dtos/orders/order.dto";
import api from "../axios";

export async function getOrders() {
    return api.get('/orders');
}

export async function getOrderById(id: string) {
    const reponse = await api.get(`/orders/${id}`);
    return reponse.data;
}

export async function addOrder(order: OrderRequestDto) {
    return api.post('/orders', order);
}

export async function editOrder(order: OrderRequestDto) {
    const {id, ...payload} = order;

    return api.put(`/orders/${id}`, payload);
}

export async function deleteOrder(id: string) {
    return api.delete(`/orders/${id}`);
}