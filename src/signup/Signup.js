import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../signup/co.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";




function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await signup(
      formData.fullName,
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      alert("Signup Successful");

      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
      });

       navigate("/");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Signup Error:", error);

    alert(
      error.response?.data?.message ||
      "Signup Failed. Please try again."
    );
  }
};

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Enter your full name"
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Choose a username"
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter your password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;