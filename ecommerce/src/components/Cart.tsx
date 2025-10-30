// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import TopNavBar from "./TopNavBar";

// // interface CartItem {
// //   cart_id: number;
// //   customer_id: number;
// //   p_name: string;
// //   p_price: number;
// //   p_code: string;
// //   fileToUpload: string;
// //   size: string;
// //   quantity: number;
// // }

// // const Cart: React.FC = () => {
// //   const [cart, setCart] = useState<CartItem[]>([]);

// //   const fetchCart = () => {
// //     axios
// //       .get<CartItem[]>("http://localhost:5000/cart")
// //       .then((res) => setCart(res.data))
// //       .catch((err) => console.error("Error fetching cart:", err));
// //   };

// //   const removeItem = (id: number) => {
// //     axios
// //       .delete(`http://localhost:5000/cart/${id}`)
// //       .then(() => fetchCart())
// //       .catch((err) => console.error("Error deleting item:", err));
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, []);

// //   // Calculate subtotal
// //   const subtotal = cart.reduce((acc, item) => acc + item.p_price * item.quantity, 0);
// //   // Assuming GST is 18%
// //   const gst = subtotal * 0.18;
// //   const total = subtotal + gst;

// //   return (
// //     <div>
// //       <TopNavBar />
// //       <div className="container py-4">
// //         <div className="row w-100">
// //           <div className="col-lg-8 col-md-12 col-12 mb-4">
// //             <table id="shoppingCart" className="table table-condensed table-responsive">
// //               <thead>
// //                 <tr>
// //                   <th style={{ width: "40%" }}>Product</th>
// //                   <th style={{ width: "22%" }}>Price</th>
// //                   <th style={{ width: "20%" }}>Stock status</th>
// //                   <th style={{ width: "20%" }}>Quantity</th>
// //                   <th style={{ width: "20%" }}>Remove</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {cart.map((item) => (
// //                   <tr key={item.cart_id}>
// //                     <td>
// //                       <div className="d-flex align-items-center">
// //                         <img
// //                           src={`http://localhost:5000/uploads/necklace/${item.fileToUpload}`}
// //                           alt={item.p_name}
// //                           width="60"
// //                           className="me-3"
// //                         />
// //                         <div>
// //                           <p className="mb-0">{item.p_name}</p>
// //                           <small>Code: {item.p_code}</small>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td>₹{item.p_price}</td>
// //                     <td>In Stock</td>
// //                     <td>{item.quantity}</td>
// //                     <td>
// //                       <span
// //                         style={{ cursor: "pointer", color: "#dc3545", fontSize: "1.2rem" }}
// //                         title="Remove"
// //                         onClick={() => removeItem(item.cart_id)}
// //                       >
// //                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
// //                           <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
// //                           <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
// //                         </svg>
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {cart.length === 0 && (
// //                   <tr>
// //                     <td colSpan={5} className="text-center">
// //                       No items in cart
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //           <div className="col-lg-4 col-md-12 col-12">
// //             <div className="card p-3">
// //               <div className="card-body">
// //                 <h5 className="card-title">Summary</h5>
// //                 <ul className="list-group list-group-flush mb-3">
// //                   <li className="list-group-item d-flex justify-content-between align-items-center">
// //                     Subtotal
// //                     <span>₹{subtotal.toFixed(2)}</span>
// //                   </li>
// //                   <li className="list-group-item d-flex justify-content-between align-items-center">
// //                     GST (18%)
// //                     <span>₹{gst.toFixed(2)}</span>
// //                   </li>
// //                   <li className="list-group-item d-flex justify-content-between align-items-center font-weight-bold">
// //                     Total
// //                     <span>₹{total.toFixed(2)}</span>
// //                   </li>
// //                 </ul>
// //                 <button className="btn btn-primary w-100">Pay Now</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Cart;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TopNavBar from "./TopNavBar";
// import Footer from "./Footer";
// import NavBar from "./NavBar";

// interface CartItem {
//   cart_id: number;
//   customer_id: number;
//   p_name: string;
//   p_price: number;
//   p_code: string;
//   fileToUpload: string;
//   size: string;
//   quantity: number;
// }

// const Cart: React.FC = () => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   const fetchCart = () => {
//     axios
//       .get<CartItem[]>("http://localhost:5000/cart")
//       .then((res) => setCart(res.data))
//       .catch((err) => console.error("Error fetching cart:", err));
//   };

//   const removeItem = (id: number) => {
//     axios
//       .delete(`http://localhost:5000/cart/${id}`)
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error deleting item:", err));
//   };

//   const increaseQuantity = (id: number, currentQty: number) => {
//     const newQty = currentQty + 1;
//     axios
//       .put(`http://localhost:5000/cart/${id}`, { quantity: newQty })
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error updating quantity:", err));
//   };

//   const decreaseQuantity = (id: number, currentQty: number) => {
//     if (currentQty <= 1) return; // Prevent quantity less than 1
//     const newQty = currentQty - 1;
//     axios
//       .put(`http://localhost:5000/cart/${id}`, { quantity: newQty })
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error updating quantity:", err));
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Calculate subtotal
//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.p_price * item.quantity,
//     0
//   );
//   const gst = subtotal * 0.18;
//   const total = subtotal + gst;

//   return (
//     <div>
//       <TopNavBar />
//       <NavBar/>
//       <div className="container py-4">
//         <div className="row w-100">
//           <div className="col-lg-8 col-md-12 col-12 mb-4">
//             <table
//               id="shoppingCart"
//               className="table table-condensed table-responsive"
//             >
//               <thead>
//                 <tr>
//                   <th style={{ width: "40%" }}>Product</th>
//                   <th style={{ width: "22%" }}>Price</th>
//                   <th style={{ width: "20%" }}>Stock status</th>
//                   <th style={{ width: "20%" }}>Quantity</th>
//                   <th style={{ width: "20%" }}>Remove</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((item) => (
//                   <tr key={item.cart_id}>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <img
//                           src={`http://localhost:5000/uploads/${item.fileToUpload}`}
//                           alt={item.p_name}
//                           width="60"
//                           className="me-3"
//                         />
//                         <div>
//                           <p className="mb-0">{item.p_name}</p>
//                           <small>Code: {item.p_code}</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td>₹{item.p_price}</td>
//                     <td>In Stock</td>
//                     <td>
//                       <span
//                         title="Decrease quantity"
//                         style={{
//                           cursor: "pointer",
//                           marginRight: "8px",
//                           color: "red",
//                           fontSize: "1.2rem",
//                           fontWeight: "bold",
//                         }}
//                         onClick={() =>
//                           decreaseQuantity(item.cart_id, item.quantity)
//                         }
//                       >
//                         -
//                       </span>
//                       {item.quantity}
//                       <span
//                         title="Increase quantity"
//                         style={{
//                           cursor: "pointer",
//                           marginLeft: "8px",
//                           color: "green",
//                           fontSize: "1.2rem",
//                           fontWeight: "bold",
//                         }}
//                         onClick={() =>
//                           increaseQuantity(item.cart_id, item.quantity)
//                         }
//                       >
//                         +
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         style={{
//                           cursor: "pointer",
//                           color: "#dc3545",
//                           fontSize: "1.2rem",
//                         }}
//                         title="Remove"
//                         onClick={() => removeItem(item.cart_id)}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="20"
//                           height="20"
//                           fill="currentColor"
//                           className="bi bi-x-circle"
//                           viewBox="0 0 16 16"
//                         >
//                           <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
//                           <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
//                         </svg>
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {cart.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="text-center">
//                       No items in cart
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="col-lg-4 col-md-12 col-12">
//             <div className="card p-3">
//               <div className="card-body">
//                 <h5 className="card-title">Summary</h5>
//                 <ul className="list-group list-group-flush mb-3">
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     Subtotal
//                     <span>₹{subtotal.toFixed(2)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     GST (18%)
//                     <span>₹{gst.toFixed(2)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center font-weight-bold">
//                     Total
//                     <span>₹{total.toFixed(2)}</span>
//                   </li>
//                 </ul>
//                 <button className="btn btn-primary w-100">Place Order</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;
// src/components/Cart.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import TopNavBar from "./TopNavBar";
// import NavBar from "./NavBar";
// import Footer from "./Footer";

// interface CartItem {
//   cart_id: number;
//   customer_id: number;
//   p_name: string;
//   p_price: number;
//   p_code: string;
//   fileToUpload: string;
//   size: string;
//   quantity: number;
// }

// const Cart: React.FC = () => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const navigate = useNavigate();

//   const fetchCart = () => {
//     axios
//       .get<CartItem[]>("http://localhost:5000/cart")
//       .then((res) => setCart(res.data))
//       .catch((err) => console.error("Error fetching cart:", err));
//   };

//   const removeItem = (id: number) => {
//     axios
//       .delete(`http://localhost:5000/cart/${id}`)
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error deleting item:", err));
//   };

//   const increaseQuantity = (id: number, currentQty: number) => {
//     const newQty = currentQty + 1;
//     axios
//       .put(`http://localhost:5000/cart/${id}`, { quantity: newQty })
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error updating quantity:", err));
//   };

//   const decreaseQuantity = (id: number, currentQty: number) => {
//     if (currentQty <= 1) return;
//     const newQty = currentQty - 1;
//     axios
//       .put(`http://localhost:5000/cart/${id}`, { quantity: newQty })
//       .then(() => fetchCart())
//       .catch((err) => console.error("Error updating quantity:", err));
//   };

//   const handlePlaceOrder = () => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn");
//     if (isLoggedIn !== "true") {
//       alert("Please log in to place your order.");
//       return;
//     }

//     // Clear cart if needed: setCart([]);
//     navigate("/ordersummary");
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.p_price * item.quantity,
//     0
//   );
//   const gst = subtotal * 0.18;
//   const total = subtotal + gst;

//   return (
//     <div>
//       <TopNavBar />
//       <NavBar />
//       <div className="container py-4">
//         <div className="row w-100">
//           <div className="col-lg-8 col-md-12 col-12 mb-4">
//             <table className="table table-condensed table-responsive">
//               <thead>
//                 <tr>
//                   <th style={{ width: "40%" }}>Product</th>
//                   <th style={{ width: "22%" }}>Price</th>
//                   <th style={{ width: "20%" }}>Stock status</th>
//                   <th style={{ width: "20%" }}>Quantity</th>
//                   <th style={{ width: "20%" }}>Remove</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((item) => (
//                   <tr key={item.cart_id}>
//                     <td>
//                       <div className="d-flex align-items-center">
//                         <img
//                           src={`http://localhost:5000/uploads/${item.fileToUpload}`}
//                           alt={item.p_name}
//                           width="60"
//                           className="me-3"
//                         />
//                         <div>
//                           <p className="mb-0">{item.p_name}</p>
//                           <small>Code: {item.p_code}</small>
//                         </div>
//                       </div>
//                     </td>
//                     <td>₹{item.p_price}</td>
//                     <td>In Stock</td>
//                     <td>
//                       <span
//                         style={{ cursor: "pointer", color: "red" }}
//                         onClick={() =>
//                           decreaseQuantity(item.cart_id, item.quantity)
//                         }
//                       >
//                         -
//                       </span>
//                       <span className="mx-2">{item.quantity}</span>
//                       <span
//                         style={{ cursor: "pointer", color: "green" }}
//                         onClick={() =>
//                           increaseQuantity(item.cart_id, item.quantity)
//                         }
//                       >
//                         +
//                       </span>
//                     </td>
//                     <td>
//                       <span
//                         style={{ cursor: "pointer", color: "crimson" }}
//                         onClick={() => removeItem(item.cart_id)}
//                       >
//                         🗑
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//                 {cart.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="text-center">
//                       No items in cart
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="col-lg-4 col-md-12 col-12">
//             <div className="card p-3">
//               <div className="card-body">
//                 <h5 className="card-title">Summary</h5>
//                 <ul className="list-group list-group-flush mb-3">
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     Subtotal <span>₹{subtotal.toFixed(2)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center">
//                     GST (18%) <span>₹{gst.toFixed(2)}</span>
//                   </li>
//                   <li className="list-group-item d-flex justify-content-between align-items-center font-weight-bold">
//                     Total <span>₹{total.toFixed(2)}</span>
//                   </li>
//                 </ul>
//                 <button
//                   className="btn btn-primary w-100"
//                   onClick={handlePlaceOrder}
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;
// ✅ Updated Cart.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import "./CartWishListResponsive.css";
import { useNavigate } from "react-router-dom";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import { useCartWishlist } from "../contexts/CartWishlistContext"; // ✅ add this

interface CartItem {
  cart_id: number;
  customer_id: number;
  p_name: string;
  p_price: number;
  p_code: string;
  fileToUpload: string;
  size: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const { refreshCounts } = useCartWishlist(); // ✅
  const [cart, setCart] = useState<CartItem[]>([]);
  const API_KEY = "your_super_secret_api_key_123";
  const navigate = useNavigate();

  const fetchCart = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const userRes = await axios.get(`http://localhost:5000/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (userRes.data.success) {
        const customer_id = userRes.data.user.customer_id;
        const cartRes = await axios.get(
          `http://localhost:5000/cart?customer_id=${customer_id}`
        );
        setCart(cartRes.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
    refreshCounts();
  };

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${id}`);
      fetchCart();
      refreshCounts();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handlePlaceOrder = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
      alert("Please log in to place your order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Navigate to order summary page
    navigate("/ordersummary");
  };

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await axios.put(`http://localhost:5000/cart/${id}`, { quantity: newQty });
      fetchCart();
      refreshCounts();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
    
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.p_price * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div className="container py-4">
        <div className="row w-100">
          <div className="col-lg-8 col-md-12 col-12 mb-4">
            <table className="table table-condensed table-responsive">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.cart_id}>
                    <td data-label="Product">
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://localhost:5000/uploads/${item.fileToUpload}`}
                          alt={item.p_name}
                          width="60"
                          className="me-3"
                        />
                        <div>
                          <p className="mb-0">{item.p_name}</p>
                          <small>Code: {item.p_code}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">₹{item.p_price}</td>
                    <td data-label="Stock">In Stock</td>
                    <td data-label="Quantity">
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                          textDecoration: "none",
                        }}
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                          textDecoration: "none",
                        }}
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td data-label="Remove">
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#dc3545",
                          fontSize: "1.2rem",
                        }}
                        title="Remove"
                        onClick={() => removeItem(item.cart_id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No items in cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4 col-md-12 col-12">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Summary</h5>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    Subtotal <span>₹{subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    GST (18%) <span>₹{gst.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    Total <span>₹{total.toFixed(2)}</span>
                  </li>
                </ul>
                {/* <button className="btn btn-primary w-100">Place Order</button> */}
                <button
                  className="btn btn-primary w-100"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
