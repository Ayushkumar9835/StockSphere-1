
// import React, { createContext, useState, useContext } from "react";
// import axios from "axios";

// const AuthContext = createContext(null);

// axios.defaults.withCredentials = true;

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user_session");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const login = async (usernameOrEmail, password) => {
//     try {
//       const response = await axios.post("http://localhost:8000/login", { usernameOrEmail, password });
//       if (response.data && response.data.success) {
//         const userData = response.data.data.user;
        
//         setUser(userData);
//         localStorage.setItem("user_session", JSON.stringify(userData));
//         return { success: true };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Login authentication failed."
//       };
//     }
//   };

//   const signup = async (fullName, username, email, password) => {
//     try {
//       const response = await axios.post("http://localhost:8000/register", { fullName, username, email, password });
//       if (response.data && response.data.success) {
//         return { success: true };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Registration failed."
//       };
//     }
//   };

//   const logout = async () => {
//   try {
//     await axios.post(
//       "http://localhost:8000/logout",
//       {},
//       {
//         withCredentials: true,
//       }
//     );
//   } catch (err) {
//     console.error("Logout error:", err);
//   } finally {
//     setUser(null);
//     localStorage.removeItem("user_session");
//   }
//   };



// const checkout = async ({
//   name,
//   qty,
//   price,
//   model,
//   navigate,
// }) => {
//   try {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     // Step 1: Checkout API
//     const { data } = await axios.post(
//       "http://localhost:3002/checkout",
//       {
//         name,
//         qty,
//         price,
//         amount: qty * price,
//         model,
//       },
//       {
//         withCredentials: true,
//       }
//     );

//     // Step 2: Razorpay Options
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,

//       amount: data.order.amount,

//       currency: data.order.currency,

//       name: "Your App Name",

//       description: "Payment",

//       order_id: data.order.id,

//       // Step 3: Payment Verification
//       handler: async function (response) {
//         try {
//           const verifyResponse = await axios.post(
//             "http://localhost:3002/paymentverification",
//             {
//               ...response,
//               dbOrderId: data.dbOrderId,
//             },
//             {
//               withCredentials: true,
//             }
//           );

//           if (verifyResponse.data.success) {
//             navigate(
//               `/paymentsuccess?reference=${response.razorpay_payment_id}`
//             );
//           }
//         } catch (error) {
//           console.log(error);

//           navigate("/paymentfailed");
//         }
//       },
//     };

//     // Step 4: Open Razorpay
//     const razor = new window.Razorpay(options);

//     razor.open();
//   } catch (error) {
//     console.log(error);

//     if (error.response?.status === 401) {
//       navigate("/login");
//     }
//   }
// };





// };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_session");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        { usernameOrEmail, password }
      );

      if (response.data && response.data.success) {
        const userData = response.data.data.user;

        setUser(userData);
        localStorage.setItem("user_session", JSON.stringify(userData));

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login authentication failed.",
      };
    }
  };

  const signup = async (fullName, username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        { fullName, username, email, password }
      );

      if (response.data && response.data.success) {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed.",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user_session");
    }
  };

const checkout = async ({
  name,
  qty,
  price,
  model,
  navigate,
}) => {
  try {
    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Get Razorpay public key
    const {
      data: { key },
    } = await axios.get(
      "http://localhost:8000/get-razorpay-key",
      {
        withCredentials: true,
      }
    );

    // Create Razorpay order from backend
    const { data } = await axios.post(
      "http://localhost:8000/checkout",
      {
        name,
        qty,
        price,
        amount: qty * price,
        model,
      },
      {
        withCredentials: true,
      }
    );

    // Razorpay checkout options
    const options = {
      key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Your App Name",
      description: `Payment for ${name}`,
      order_id: data.order.id,

      // This runs AFTER payment succeeds
      handler: async function (response) {
        try {
          const verifyResponse = await axios.post(
            "http://localhost:8000/payment-verification",
            {
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
              dbOrderId: data.dbOrderId,
            },
            {
              withCredentials: true,
            }
          );

          if (verifyResponse.data.success) {
            navigate(
              `/paymentsuccess?reference=${response.razorpay_payment_id}`
            );
          } else {
            navigate("/paymentfailed");
          }
        } catch (error) {
          console.error(
            "Verification Error:",
            error
          );

          navigate("/paymentfailed");
        }
      },

     
    };

    // Create Razorpay instance
    const razor = new window.Razorpay(options);

    // Handle payment failure
    razor.on("payment.failed", function () {
      navigate("/paymentfailed");
    });

    // Open Razorpay popup
    razor.open();
  } catch (error) {
    console.error("Checkout Error:", error);

    // if (error.response?.status === 401) {
    //   navigate("/login");
    // }
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        checkout, // <-- Added this
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);