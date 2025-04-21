import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext"; // Import the UserContext to fetch user role
import { Table, Button, Typography, Card, Alert, Spin } from "antd"; // Import UI components from Ant Design

const { Title } = Typography; // Destructuring Ant Design Typography for styling titles

const UnassignedUsersList = () => {
    // Fetch function to obtain user role from UserContext
    const { fetchUserRole } = useUser();

    // State variables to manage unassigned users list, loading status, and errors
    const [unassignedUsers, setUnassignedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hooks for navigation and monitoring location changes
    const navigate = useNavigate();
    const location = useLocation();

    // Fetching the list of unassigned users from backend API
    const fetchUnassignedUsers = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/unassigned_user", // Endpoint to fetch unassigned users
                {}, // Sending an empty object as payload
                { withCredentials: true } // Including credentials for authenticated requests
            );
            // Setting the fetched data into the state
            setUnassignedUsers(response.data.unassigned_user || response.data.unassigned_users || []);
        } catch (error) {
            // Handling errors during API call
            setError(error.message);
        } finally {
            // Updating loading state
            setLoading(false);
        }
    };

    // Using useEffect to trigger fetching user role and unassigned users whenever location changes
    useEffect(() => {
        fetchUserRole(); // Fetch user role information
        fetchUnassignedUsers(); // Fetch the unassigned users data
    }, [location]);

    // Function to navigate to the Assign Role page for a specific user
    const handleAssignRole = (userItem) => {
        navigate(`/create_user/${userItem._id}`, { state: { user: userItem } }); // Navigating with user data as state
    };

    // Columns definition for the Ant Design Table
    const columns = [
        {
            title: "Email", // Column title
            dataIndex: "email", // Field from the data source
            key: "email", // Unique key for the column
            align: "center", // Alignment of the column content
            render: (text) => text || "N/A", // Display "N/A" if email is missing
        },
        {
            title: "User Type", // Column title for user type
            dataIndex: "usertype", // Field from the data source
            key: "usertype", // Unique key for the column
            align: "center", // Alignment of the column content
            render: (text) => text || "N/A", // Display "N/A" if user type is missing
        },
        {
            title: "Actions", // Column title for action buttons
            key: "actions", // Unique key for the column
            align: "center", // Alignment of the column content
            render: (_, userItem) => (
                <Button type="primary" onClick={() => handleAssignRole(userItem)}>
                    Assign Role 
                </Button>
            ),
        },
    ];

    // Conditional rendering for loading state
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin tip="Loading unassigned users..." size="large" /> // Spinner while loading data
            </div>
        );
    }

    // Conditional rendering for error state
    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <Alert message="Error" description={error} type="error" showIcon /> // Error alert with message
            </div>
        );
    }

    return (
        // Main container for the component
        <div style={{ padding: "30px", background: "#f0f2f5", minHeight: "100vh" }}>
            <Card
                style={{
                    margin: "0 auto",
                    maxWidth: "800px", // Restricting max width of the card
                    borderRadius: "10px", // Adding border radius for rounded corners
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Adding shadow for a smooth look
                }}
            >
                <Title level={2} style={{ textAlign: "center", color: "#001529" }}>
                    Assign Roles to Unassigned Users
                </Title>
                <Table
                    dataSource={unassignedUsers} // Passing unassigned users data to the table
                    columns={columns} // Defining table columns
                    rowKey={(record) => record._id} // Setting a unique key for each row
                    pagination={{ pageSize: 5 }} // Limiting 5 records per page
                    bordered // Adding border to the table
                    style={{ marginTop: "20px" }}
                />
            </Card>
        </div>
    );
};

export default UnassignedUsersList; // Exporting the component for usage in other parts of the application