import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [number, setNumber] = useState("");
    const [responseMessage, setResponseMessage] = useState(null);
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        return email && email.length >= 7 && password && password.length >= 6;
    };

    const gotologin = () => {
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setResponseMessage("Invalid Email or Password");
            return;
        }

        if (!recaptchaToken) {
            setResponseMessage("Please complete the reCAPTCHA challenge.");
            return;
        }

        try {
            // First, verify reCAPTCHA
            const recaptchaResponse = await axios.post('http://localhost:8000/recaptcha', {
                recaptcha: recaptchaToken,
            });

            if (recaptchaResponse.status == 200) {
                // Then, proceed with the signup.
                // Notice we are not sending usertype—the backend determines it.
                const signupResponse = await axios.post('http://localhost:8000/signup', {
                    firstname: firstname,
                    lastname: lastname,
                    personal_email: email,
                    phone_number,
                    password: password
                    
                    
                });

                if (signupResponse.status === 200) {
                    setResponseMessage(`Signup successful. Your role is ${signupResponse.data.role}`);
                    console.log("Signup Response:", signupResponse);
                    navigate("/login");
                } else {
                    setResponseMessage(signupResponse.data.detail || "Signup failed");
                }
            }
        } catch (error) {
            setResponseMessage(error.response?.data?.detail || "Signup failed");
        }
    };

    return (
        <div>
            <h1>Sign Up Page</h1>
            <form onSubmit={handleSubmit} method="post">
                <label>First Name</label>
                <input
                    type="text"
                    placeholder="john"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                /><br />
                <label>Last Name</label>
                <input
                    type="text"
                    placeholder="doe"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                /><br />
                <label>Enter Your Personal Email</label>
                <input
                    type="email"
                    placeholder="john.doe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <label>Enter Your Phone Number</label>
                <input
                    type="text"
                    placeholder="(XXX) XXX XXXX"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                /><br />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <ReCAPTCHA
                    sitekey="6LcDF-QqAAAAAL8IgurnY6lnyeC81yCAd8JM3PE8"
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken("")}
                /><br />
                <button type="submit">Sign Up</button>
                <p>{responseMessage}</p>
            </form>
            <button onClick={gotologin}>Login</button>
        </div>
    );
}

export default SignUpPage;
