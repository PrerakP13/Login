import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user } = useUser();

    // Show a loading indicator if the role hasn't been determined yet.
    if (!user || user.role === "visitor") {
        // This assumes a visitor means "not loaded or not allowed".
        // Alternatively, you could return a loading spinner.
        return <div>Loading...</div>;
    }

    if (!requiredRoles.includes(user.role)) {
        // If the user does not have the required role, redirect them.
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
