import React from "react";
import { Layout, Typography, Card, Button } from "antd";
import { useUser } from "./UserContext";
import Navbar from "./Navbar";
import ExportOrdersButton from "./ExportOrdersButton";
import {useNavigate } from 'react-router-dom'

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function Home() {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ background: "#001529", display: "flex", alignItems: "center" }}>
                <Navbar />
            </Header>
            <Content style={{ padding: "30px", background: "#f0f2f5" }}>
                <Title level={2} style={{ textAlign: "center", color: "#001529" }}>
                    Welcome to the Home Page
                </Title>

                <div style={{ margin: "30px 0", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {user.role === "admin" && (
                        <Card
                            title="Admin Dashboard"
                            style={{
                                margin: "10px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                borderRadius: "8px",
                            }}
                            extra={<ExportOrdersButton />}
                        >
                            <p style={{ color: "#595959" }}>Admin-specific functionalities are available here.</p>
                        </Card>
                    )}
                </div>

                {/* Buttons Section */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                        gap: "20px",
                        padding: "20px",
                        background: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* FileUpload as Button */}
                    <Button type="primary" style={{ borderRadius: "8px" }} onClick={() => console.log("File Upload clicked!")}>
                        Upload Files
                    </Button>

                    {/* LogOut as Button */}
                    <Button type="default" style={{ borderRadius: "8px" }} onClick={() => console.log("Log Out clicked!")}>
                        Log Out
                    </Button>

                    {/* OrderForm as Button */}
                    <Button type="dashed" style={{ borderRadius: "8px" }} onClick={() => navigate("/orderform")}>
                        Place an Order
                    </Button>
                </div>
            </Content>
            <Footer style={{ textAlign: "center", background: "#001529", color: "#ffffff", padding: "20px" }}>
                Ant Design Home Page ©2025
            </Footer>
        </Layout>
    );
}

export default Home;