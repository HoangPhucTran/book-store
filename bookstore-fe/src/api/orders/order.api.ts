import type { OrderDto, OrderEditRequestDto, OrderRequestDto } from "../../dtos/orders/order.dto";
import api from "../axios";

export async function getOrders() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await api.get("/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      window.location.href = "/unauthorized";
    }
    throw error;
  }
}
export async function getOrderById(id: string) {
    const reponse = await api.get(`/orders/${id}`);
    return reponse.data;
}

export async function addOrder(order: OrderRequestDto) {
    return api.post('/orders', order);
}

export async function editOrder(order: OrderEditRequestDto) {
    const {id, ...payload} = order;

    return api.patch(`/orders/${id}`, payload);
}

export async function deleteOrder(id: string) {
    return api.delete(`/orders/${id}`);
}