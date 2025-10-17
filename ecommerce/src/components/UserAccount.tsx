// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./UserAccount.css";
// import Footer from "./Footer";
// import TopNavBar from "./TopNavBar";
// import NavBar from "./NavBar";
// import axios from "axios";

// const API_KEY = "your_super_secret_api_key_123";

// const UserAccount: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const email = localStorage.getItem("userEmail");

//   // 🚀 Load user data on mount
//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

//     if (!isLoggedIn || !email) {
//       alert("Please login first.");
//       navigate("/");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/user/${email}`,
//           {
//             headers: { "x-api-key": API_KEY },
//           }
//         );

//         const user = res.data.user;
//         setFormData({
//           firstName: user.fname || "",
//           lastName: user.lname || "",
//           email: user.Email || "",
//           phone: user.phone || "",
//           address: user.street_address || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//         alert("Failed to load user data.");
//         navigate("/");
//       }
//     };

//     fetchData();
//   }, [email, navigate]);

//   // 📝 Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 💾 Handle save
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/user/${email}`,
//         {
//           street_address: formData.address,
//           phone: formData.phone,
//         },
//         {
//           headers: {
//             "x-api-key": API_KEY,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Info updated successfully!");
//       } else {
//         alert("Update failed.");
//       }
//     } catch (err) {
//       console.error("Update Error:", err);
//       alert("Error updating info.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <TopNavBar />
//       <NavBar />
//       <div className="form-wrapper">
//         <form className="personal-info-form" onSubmit={handleSubmit}>
//           <div className="form-header">
//             <h3>Personal Information</h3>
//           </div>

//           <div className="input-row">
//             <input
//               name="firstName"
//               type="text"
//               placeholder="First Name"
//               value={formData.firstName}
//               readOnly
//             />
//             <input
//               name="lastName"
//               type="text"
//               placeholder="Last Name"
//               value={formData.lastName}
//               readOnly
//             />
//           </div>

//           <div className="info-section">
//             <div className="info-label">Email</div>
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               readOnly
//             />
//           </div>

//           <div className="info-section">
//             <div className="info-label">Mobile Number</div>
//             <div className="phone-wrapper">
//               <span className="phone-prefix">+91</span>
//               <input
//                 name="phone"
//                 type="text"
//                 placeholder="Enter 10-digit number"
//                 maxLength={10}
//                 pattern="[0-9]{10}"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     phone: e.target.value.replace(/\D/g, ""),
//                   })
//                 }
//                 required
//               />
//             </div>
//           </div>

//           <div className="info-section">
//             <div className="info-label">Address</div>
//             <input
//               name="address"
//               type="text"
//               placeholder="Enter your address"
//               value={formData.address}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-actions">
//             <button type="submit" className="save-btn">
//               SAVE
//             </button>
//           </div>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default UserAccount;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";
import Footer from "./Footer";
import TopNavBar from "./TopNavBar";

import axios from "axios";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";

const API_KEY = "your_super_secret_api_key_123";

const UserAccount: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token"); // ✅ Fetch token

  // 🚀 Load user data on mount
  useEffect(() => {
    if (!token || !email) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${email}`, {
          headers: { "x-api-key": API_KEY },
        });

        const user = res.data.user;
        setFormData({
          firstName: user.fname || "",
          lastName: user.lname || "",
          email: user.Email || "",
          phone: user.phone || "",
          address: user.street_address || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Failed to load user data.");
        navigate("/");
      }
    };

    fetchData();
  }, [email, token, navigate]);

  // 📝 Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 💾 Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${email}`,
        {
          street_address: formData.address,
          phone: formData.phone,
        },
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      if (response.data.success) {
        alert("Info updated successfully!");
        // Redirect to home page after successful save
        navigate("/");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating info.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div className="form-wrapper">
        <form className="personal-info-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Personal Information</h3>
          </div>

          <div className="input-row">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              readOnly
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              readOnly
            />
          </div>

          <div className="info-section">
            <div className="info-label">Email</div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              readOnly
            />
          </div>

          <div className="info-section">
            <div className="info-label">Mobile Number</div>
            <div className="phone-wrapper">
              <span className="phone-prefix">+91</span>
              <input
                name="phone"
                type="text"
                placeholder="Enter 10-digit number"
                maxLength={10}
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="info-section">
            <div className="info-label">Address</div>
            <input
              name="address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              SAVE
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccount;
