import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { Table, Typography, Card, Alert, Spin } from 'antd';

const { Title, Text } = Typography;

const EmployeePage = () => {
    const { user, fetchUserRole } = useUser();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
        try {
            const response = await axios.post('http://localhost:8000/show_user', {}, { withCredentials: true });
            setEmployees(response.data.users);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRole();
        fetchEmployees();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin tip="Loading Employee Data..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    const columns = [
        {
            title: 'Username',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'User Type',
            dataIndex: 'usertype',
            key: 'usertype',
            align: 'center',
        },
    ];

    return (
        <div style={{ padding: "30px", background: "#f0f2f5", minHeight: "100vh" }}>
            <Card style={{ margin: "0 auto", maxWidth: "800px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Title level={2} style={{ textAlign: "center", color: "#001529" }}>
                    Employee List
                </Title>
                <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>
                    User Role: <b>{user.role}</b>
                </Text>
                <Table
                    dataSource={employees}
                    columns={columns}
                    rowKey={(record) => record.name}
                    bordered
                    pagination={{ pageSize: 5 }}
                    style={{ marginTop: "20px" }}
                />
            </Card>
        </div>
    );
};

export default EmployeePage;