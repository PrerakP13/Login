import React, { useState, useEffect } from "react";
import { Table, Input, Select, Pagination, Layout, Button, message, Modal } from "antd";
import axios from "axios";
import Navbar from './Navbar';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const OrdersList = ({ isAdmin }) => {
    const [orders, setOrders] = useState([]); // Store all orders
    const [paginatedOrders, setPaginatedOrders] = useState([]); // Current page slice
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [managedByFilter, setManagedByFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [loading, setLoading] = useState(false);

    const [showModifyModal, setShowModifyModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order for modification

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/orders/list_orders");
            setOrders(response.data.orders || []);
            setPaginatedOrders(response.data.orders.slice(0, itemsPerPage)); // Set initial page slice
        } catch (err) {
            message.error("Failed to fetch orders: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSearch = () => {
        let filteredOrders = orders;

        if (search.trim()) {
            filteredOrders = filteredOrders.filter((order) =>
                order.customer_name.toLowerCase().includes(search.trim().toLowerCase())
            );
        }
        if (statusFilter) {
            filteredOrders = filteredOrders.filter((order) => order.status === statusFilter);
        }
        if (managedByFilter) {
            filteredOrders = filteredOrders.filter((order) => order.managed_by === managedByFilter);
        }

        return filteredOrders;
    };

    const updatePagination = () => {
        const filteredOrders = applyFiltersAndSearch();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        updatePagination();
    }, [search, statusFilter, managedByFilter, currentPage, orders]);

    const handleModifyOrder = (order) => {
        setSelectedOrder(order);
        setShowModifyModal(true); // Open modal for update/delete
    };

    const handleUpdateOrder = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/orders/${selectedOrder.order_id}`, selectedOrder);
            message.success(response.data.message || "Order updated successfully!");
            fetchAllOrders(); // Refresh orders list after update
        } catch (err) {
            message.error("Failed to update order: " + err.message);
        } finally {
            setShowModifyModal(false); // Close modal after action
        }
    };

    const handleDeleteOrder = async () => {
        try {
            console.log("Delete request for:", selectedOrder.order_id); // Debug log
            const userConfirmed = window.confirm(`Are you sure you want to delete order ${selectedOrder?.order_id}?`);

            if (userConfirmed) {
                const response = await axios.delete(`http://localhost:8000/orders/${selectedOrder.order_id}`);
            }
            message.success(response.data.message || "Order deleted successfully!");
           
            
        } catch (err) {
            message.error("Failed to delete order: " + err.message);
        } finally {
            setShowModifyModal(false); // Close modal after action
            fetchAllOrders(); // Refresh orders list after deletion
        }
    };

    const columns = [
        { title: "Order ID", dataIndex: "order_id", key: "order_id" },
        { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Managed By", dataIndex: "managed_by", key: "managed_by" },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                isAdmin ? (
                    <Button type="primary" onClick={() => handleModifyOrder(record)}>Modify</Button>
                ) : null
            ),
        },
    ];

    return (
        <Layout>
            <Navbar />
            <Header style={{ background: "#1890ff", color: "#fff", textAlign: "center", padding: "20px" }}>
                <h2 style={{ color: "#fff" }}>Order List</h2>
            </Header>
            <Content style={{ padding: "20px" }}>
                <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <Input
                        placeholder="Search by Customer Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "200px" }}
                    />
                    <Button type="primary" onClick={() => setCurrentPage(1)}>Search</Button>
                    <Select
                        placeholder="Filter by Status"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: "150px" }}
                    >
                        <Option value="">All Statuses</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Shipped">Shipped</Option>
                        <Option value="Delivered">Delivered</Option>
                        <Option value="Canceled">Canceled</Option>
                    </Select>
                    <Select
                        placeholder="Filter by Manager"
                        value={managedByFilter}
                        onChange={(value) => setManagedByFilter(value)}
                        style={{ width: "150px" }}
                    >
                        <Option value="">All Managers</Option>
                        <Option value="Manager A">Manager A</Option>
                        <Option value="Manager B">Manager B</Option>
                    </Select>
                </div>
                <Table
                    columns={columns}
                    dataSource={paginatedOrders}
                    rowKey={(record) => record.order_id}
                    pagination={false}
                    bordered
                    loading={loading}
                />
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={applyFiltersAndSearch().length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ marginTop: "20px", textAlign: "center" }}
                />
            </Content>
            <Footer style={{ textAlign: "center" }}>Prerak Design Orders List ©2025</Footer>

            {/* Modify Modal */}
            <Modal
                title={`Modify Order: ${selectedOrder?.order_id}`}
                visible={showModifyModal}
                onCancel={() => setShowModifyModal(false)}
                footer={[
                    <Button key="delete" type="danger" onClick={handleDeleteOrder}>Delete</Button>,
                    <Button key="update" type="primary" onClick={handleUpdateOrder}>Update</Button>,
                ]}
            >
                <Input
                    placeholder="Customer Name"
                    value={selectedOrder?.customer_name}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, customer_name: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Select
                    placeholder="Status"
                    value={selectedOrder?.status}
                    onChange={(value) => setSelectedOrder({ ...selectedOrder, status: value })}
                    style={{ width: "100%", marginBottom: "10px" }}
                >
                    <Option value="Pending">Pending</Option>
                    <Option value="Shipped">Shipped</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Canceled">Canceled</Option>
                </Select>
                <Input
                    placeholder="Managed By"
                    value={selectedOrder?.managed_by}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, managed_by: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
            </Modal>
        </Layout>
    );
};

export default OrdersList;