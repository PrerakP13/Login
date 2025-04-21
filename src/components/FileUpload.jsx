import React, { useState } from "react";
import { Upload, Button, Typography, message, List, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const FileUpload = () => {
  const [errors, setErrors] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = async (info) => {
    const { file } = info;

    if (file.status === "done") {
      // Successful file upload
      setUploadMessage("File uploaded successfully!");
      setErrors(file.response.invalid_orders || []);
    } else if (file.status === "error") {
      // Handle file upload failure
      message.error("File upload failed. Please try again.");
      console.error(file.error);
    }
  };

  const props = {
    name: "file",
    accept: ".csv",
    action: "http://localhost:8000/upload_csv", // Your API endpoint
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onChange: handleFileChange,
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>Upload CSV File</Title>
      <Text>Upload a CSV file containing the necessary data:</Text>
      <Divider />

      <Upload {...props} showUploadList={false}>
        <Button icon={<UploadOutlined />} type="primary">
          Select and Upload File
        </Button>
      </Upload>

      {uploadMessage && (
        <Text type="success" style={{ display: "block", marginTop: "10px" }}>
          {uploadMessage}
        </Text>
      )}

      {errors.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Title level={4}>Invalid Rows</Title>
          <List
            bordered
            dataSource={errors}
            renderItem={(error) => (
              <List.Item>
                Row: {JSON.stringify(error.row)} - Error: {error.error}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;