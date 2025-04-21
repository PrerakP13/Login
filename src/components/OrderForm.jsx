import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Alert, Spin, Typography } from "antd";
import { createOrder } from "../utils/api";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const OrderForm = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        item_name: "", // To hold the selected item from the dropdown
        qty: "",
    });

    const [items, setItems] = useState([]); // To store items fetched from the backend
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch items from the backend
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:8000/orders/get_items");
                setItems(response.data.orders || []); // Store the items from the backend
            } catch (err) {
                setError("Failed to fetch items. Please try again later.");
            }
        };

        fetchItems();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await createOrder(formData); // Create new order
            onSave(); // Trigger refresh or close the form
        } catch (err) {
            if (err.response) {
                const errorMessage = err.response.data?.detail || "An error occurred";
                setError(errorMessage);
            } else {
                console.error("Unexpected error occurred:", err); // Log unexpected errors
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto" }}>
            <Title level={3}>Place Order</Title>
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: "20px" }}
                />
            )}
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    customer_name: "",
                    customer_email: "",
                    item_name: "",
                    qty: "",
                }}
            >
                <Form.Item
                    label="Customer Name"
                    name="customer_name"
                    rules={[{ required: true, message: "Please enter the customer name" }]}
                >
                    <Input
                        placeholder="Customer Name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                </Form.Item>

                <Form.Item
                    label="Customer Email"
                    name="customer_email"
                    rules={[
                        { required: true, message: "Please enter a valid email" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input
                        placeholder="Customer Email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    />
                </Form.Item>

                <Form.Item
                    label="Item Name"
                    name="item_name"
                    rules={[{ required: true, message: "Please select an item" }]}
                >
                    <Select
                        placeholder="Select an Item"
                        value={formData.item_name}
                        onChange={(value) => setFormData({ ...formData, item_name: value })}
                    >
                        {items.map((item) => (
                            <Option key={item.item_id} value={item.item_name}>
                                {item.item_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="qty"
                    rules={[{ required: true, message: "Please enter the quantity" }]}
                >
                    <Input
                        type="number"
                        placeholder="Quantity"
                        value={formData.qty}
                        onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {isLoading ? "Placing Order..." : "Place Order"}
                    </Button>
                    <Button onClick={onClose} danger>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default OrderForm;