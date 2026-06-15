import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const styles = {
    container: {
      width: "400px",
      margin: "80px auto",
      padding: "35px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      marginBottom: "25px",
      color: "#333",
      fontSize: "30px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#387ed1",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "17px",
      cursor: "pointer",
    },
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await login(
    formData.usernameOrEmail,
    formData.password
  );

  if (result.success) {
    alert("Login Successful");

    setFormData({
      usernameOrEmail: "",
      password: "",
    });

    navigate("/");
  } else {
    alert(result.message);
  }
};
  
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome Back</h2>

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          name="usernameOrEmail"
          placeholder="Username or Email"
          value={formData.usernameOrEmail}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button style={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;