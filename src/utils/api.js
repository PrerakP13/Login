// src/utils/api.js
import axios from 'axios';

const API_BASE = "http://localhost:8000/orders";



export const createOrder = async (order) => {
    return axios.post(`${API_BASE}/create_order`, order, { withCredentials: true });
};

export const updateOrder = async (id, updatedData) => {
    return axios.put(`${API_BASE}/orders/${id}`, updatedData, { withCredentials: true });
};

export const deleteOrder = async (id) => {
    return axios.delete(`${API_BASE}/orders/${id}`, { withCredentials: true });
};

export const getOrders = async () => {
    return axios.get(`${API_BASE}/list_orders`, { withCredentials: true })
}

export const updateItemInventory = async (itemName, inventoryQuantity) => {
    return axios.patch(
        `${API_BASE}/update_item_inventory`,
        { item_name: itemName, inventory_quantity: inventoryQuantity },
        { withCredentials: true }
    );
};
