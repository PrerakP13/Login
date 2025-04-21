import React from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Importing the custom UserContext to access user information

function Navbar() {
    // Extracting 'user' object from UserContext to access user role
    const { user } = useUser();

    // Using 'useNavigate' hook to programmatically navigate between pages
    const navigate = useNavigate();

    // Defining the items to display in the navigation menu
    const menuItems = [
        // Basic navigation links visible to all users
        { label: <Link to="/home">Home</Link>, key: 'home' },
        { label: <Link to="/services">Services</Link>, key: 'services' },
        { label: <Link to="/orders/get_items">Items</Link>, key: 'Items' },
        { label: <Link to="/about">About Us</Link>, key: 'about' },

        // Conditional menu items, hidden for 'visitor' and 'employee' roles
        ...(user.role !== 'visitor' && user.role !== 'employee' ? [
            { label: <Link to="/contacts">Contact Us</Link>, key: 'contacts' },
            { label: <Link to="/unassigned_user">Unassigned Users</Link>, key: 'unassigned_user' },
            { label: <Link to="/employeeinfo">Employee Information</Link>, key: 'employeeinfo' }
        ] : []),

        // Additional menu item visible only to 'admin' and 'manager' roles
        ...(user.role === 'admin' || user.role === 'manager' ? [
            { label: <span onClick={() => navigate('/create_user')}>Create User</span>, key: 'create_user' }
        ] : []),

        // Navigation link visible to all users
        { label: <Link to="/orderlist">Orders</Link>, key: 'orders' }
    ];

    return (
        // Rendering the menu with horizontal layout using Ant Design
        <Menu mode="horizontal" items={menuItems} />
    );
}

export default Navbar; // Exporting Navbar component for use in other parts of the application