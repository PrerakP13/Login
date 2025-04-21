import React, { useState } from "react";
import axios from "axios"; // For making API requests
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "./UserContext"; // Import UserContext to manage user roles
import { Form, Input, Button, Typography, Card, Alert } from "antd"; // Ant Design components for UI

const { Title, Text } = Typography; // Ant Design Typography for titles and text styling

function LoginPage() {
    // State variables for handling form data, response messages, and loading state
    const [email, setEmail] = useState(""); // To store the user's email input
    const [password, setPassword] = useState(""); // To store the user's password input
    const [responseMessage, setResponseMessage] = useState(null); // To display feedback messages from the login process
    const [loading, setLoading] = useState(false); // To manage loading spinner state

    const navigate = useNavigate(); // Hook for navigation
    const { fetchUserRole } = useUser(); // Hook to fetch the user's role

    // Validation function to ensure form inputs meet the required criteria
    const validateForm = () => {
        return email.length >= 7 && password.length >= 6; // Email must be at least 7 characters and password at least 6 characters
    };

    // Function to navigate to the signup page
    const gotosignup = () => {
        navigate("/signup"); // Redirect to "/signup"
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        // Check if the form inputs are valid
        if (!validateForm()) {
            setResponseMessage("Invalid Username or Password"); // Show error if validation fails
            return;
        }

        setLoading(true); // Set loading state to true while the request is being processed
        try {
            // Send login data to the API
            const response = await axios.post(
                "http://localhost:8000/login", // Login API endpoint
                { company_email: email, password: password }, // Payload containing login details
                { withCredentials: true } // Include credentials for authentication
            );

            // Handle success response
            if (response.status === 200) {
                setResponseMessage("Login successful"); // Show success message
                await fetchUserRole(); // Fetch the user's role to update context
                navigate("/home"); // Redirect to the home page
            } else {
                setResponseMessage(response.data.detail || "Login failed"); // Handle other responses
            }
        } catch (error) {
            // Handle errors such as network or server issues
            setResponseMessage(error.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        // Centering the login form on the screen
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
            <Card
                style={{
                    width: 400, // Fixed width for the login card
                    padding: "20px", // Padding inside the card
                    borderRadius: "10px", // Rounded corners for a modern look
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for better visibility
                }}
            >
                <Title level={3} style={{ textAlign: "center", color: "#001529" }}>
                    Log In
                </Title>
                <Form onFinish={handleSubmit} layout="vertical">
                    {/* Form field for email input */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please enter your email!" }]} // Validation rule
                    >
                        <Input
                            type="email"
                            placeholder="john.doe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state on change
                        />
                    </Form.Item>

                    {/* Form field for password input */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password!" }]} // Validation rule
                    >
                        <Input.Password
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update password state on change
                        />
                    </Form.Item>

                    {/* Show response message if available */}
                    {responseMessage && (
                        <Alert
                            message={responseMessage} // Message to display
                            type={responseMessage === "Login successful" ? "success" : "error"} // Alert type based on success or error
                            showIcon
                            style={{ marginBottom: "10px" }}
                        />
                    )}

                    {/* Submit button with loading state */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Log In
                        </Button>
                    </Form.Item>
                </Form>

                {/* Link to the signup page */}
                <div style={{ textAlign: "center" }}>
                    <Text type="secondary">Don't have an account?</Text>
                    <Button type="link" onClick={gotosignup}>
                        Sign Up
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage; // Exporting the LoginPage component for use in the app