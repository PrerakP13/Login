import React from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';

function LogOut() {

    const nav = useNavigate();
    
    const handlelogout = async () => {
        const response = await axios.post("http://localhost:8000/logout", { method: "Post" })
        if (response.status ===200) {
            nav("/login")
        }
    }
  return (
      <>
          <button onClick={handlelogout}>Log Out</button>

      </>
  );
}

export default LogOut;