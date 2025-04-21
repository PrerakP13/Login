import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Create_User = () => {
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPassword, setCompanyPassword] = useState('');
    const [newRole, setNewRole] = useState('');
    const [unassignedUser, setUnassignedUser] = useState(null);
    const { user, fetchUserRole } = useUser();
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // On component mount, try to get user from location state
    useEffect(() => {
        fetchUserRole();
        if (location.state && location.state.user) {
            setUnassignedUser(location.state.user);
        } else {
            // Fallback: fetch the unassigned user from backend using the userId parameter
            // This endpoint should return the details for one unassigned user
            axios.get("http://localhost:8000/unassigned_user/${userId}", { withCredentials: true })
                .then(response => {
                    setUnassignedUser(response.data.user);
                })
                .catch(error => {
                    console.error("Error fetching unassigned user:", error);
                });
        }
    }, [location.state, userId, fetchUserRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!unassignedUser) {
            console.error("Unassigned user data not found.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/assign_role', {
                personal_email: unassignedUser.email,  // Use the user's personal email from the unassigned record
                company_email: companyEmail,
                password: companyPassword,
                usertype: newRole
            }, { withCredentials: true });
            console.log(response.data);
            navigate('/unassigned_user'); // Redirect back to the unassigned users page
        } catch (error) {
            console.error("Error assigning role:", error);
        }
    };

    return (
        <form method='post' onSubmit={handleSubmit}>
            <h3>Assign Role</h3>
            <label>Company Email</label>
            <input
                type="email"
                placeholder="company.email@domain.com"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
            /><br />
            <label>Company Password</label>
            <input
                type="password"
                placeholder="Enter Password"
                value={companyPassword}
                onChange={(e) => setCompanyPassword(e.target.value)}
            /><br />
            <label>Role</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                {user.role === 'admin' && (
                    <option value="manager">Manager</option>
                )}
            </select><br />
            <button type="submit">Assign Role</button>
        </form>
    );
};

export default Create_User;
