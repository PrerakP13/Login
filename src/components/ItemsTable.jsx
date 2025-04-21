import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Typography, Spin, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ItemsTable = ({ isManager, isAdmin }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // Manage modal visibility
    const [newItem, setNewItem] = useState({ item_name: "", price: "", item_inventory: 0, sku: "" }); // Default item_inventory to 0
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:8000/orders/get_items");
                const processedItems = (response.data.orders || []).map(item => ({
                    ...item,
                    item_inventory: item.item_inventory ?? 0, // Default to 0 if undefined
                }));
                setItems(processedItems);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch items. Please try again later.");
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const navigateToOrderForm = (item) => {
        navigate("/orderform", { state: { item } });
    };

    const handleInventoryChange = async (itemName, newQuantity) => {
        try {
            const response = await axios.post("http://localhost:8000/orders/create_item", {
                item_name: itemName,
                inventory_quantity: newQuantity,
            });
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.item_name === itemName
                        ? { ...item, inventory_quantity: newQuantity }
                        : item
                )
            );
            message.success(response.data.message || "Inventory updated successfully!");
        } catch (err) {
            message.error("Failed to update inventory. Please try again later.");
        }
    };

    const handleNewItemSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/orders/create_item", newItem);
            console.log("New item response:", response.data);
            setItems((prevItems) => [...prevItems, { ...newItem, item_inventory: newItem.item_inventory || 0 }]); // Append new item
            console.log("Updated items state:", items); // Debugging the updated state
            setShowModal(false);
            message.success("Item added successfully!");
        } catch (err) {
            message.error("Failed to add item. Please try again later.");
        }
    };

    const columns = [
        {
            title: "Item Name",
            dataIndex: "item_name",
            key: "item_name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Inventory Quantity",
            key: "item_inventory",
            render: (text, record) =>
                (isManager || isAdmin) ? (
                    <Input
                        type="number"
                        value={record.item_inventory || 0} // Default to 0 if undefined
                        onChange={(e) => handleInventoryChange(record.item_name, e.target.value)}
                        style={{ width: "100px" }}
                    />
                ) : (
                    record.item_inventory ?? "N/A" // Fallback if undefined
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" onClick={() => navigateToOrderForm(record)}>
                    Place Order
                </Button>
            ),
        },
    ];

    if (loading) return <Spin tip="Loading items..." />;
    if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3}>Items Table</Title>
            {(isManager || isAdmin) && (
                <Button
                    type="primary"
                    style={{ marginBottom: "20px" }}
                    onClick={() => setShowModal(true)}
                >
                    Add New Item
                </Button>
            )}

            {/* Fallback rendering to prevent the table from disappearing */}
            {items && items.length > 0 ? (
                <Table
                    dataSource={items}
                    columns={columns}
                    rowKey="item_name" // Ensure rowKey matches a unique property
                    bordered
                />
            ) : (
                <Typography.Text type="danger">No items available.</Typography.Text>
            )}

            <Modal
                title="Create New Item"
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={handleNewItemSubmit}
            >
                <Input
                    placeholder="Item Name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Inventory Quantity"
                    type="number"
                    value={newItem.item_inventory}
                    onChange={(e) =>
                        setNewItem({ ...newItem, item_inventory: e.target.value })
                    }
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Item SKU"
                    type="number"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
            </Modal>
        </div>
    );
};

export default ItemsTable;