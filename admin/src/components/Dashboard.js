import React from 'react'
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
    const navigate = useNavigate();
    const AdminUser = sessionStorage.getItem("AdminUser");

    useEffect(() => {
     
        if(!AdminUser){
            navigate("/login");
        }
    }, [AdminUser, navigate])
    
  return (
    <div>
        <h1>Admin Dashboard</h1>
    </div>
  )
}

export default Dashboard