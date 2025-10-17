// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import type { ReactNode } from "react";
// import axios from "axios";

// interface CartWishlistContextType {
//   cartCount: number;
//   wishlistCount: number;
//   setCartCount: React.Dispatch<React.SetStateAction<number>>;
//   setWishlistCount: React.Dispatch<React.SetStateAction<number>>;
//   fetchCounts: () => void;
//   refreshCounts: () => Promise<void>;
//   isLoading: boolean;
// }

// const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

// const API_KEY = "your_super_secret_api_key_123";

// export const CartWishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCounts = useCallback(async () => {
//     const email = localStorage.getItem("userEmail");
//     if (!email) {
//       setCartCount(0);
//       setWishlistCount(0);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const userRes = await axios.get(`http://localhost:5000/user/${email}`, {
//         headers: { "x-api-key": API_KEY },
//       });
//       if (userRes.data.success) {
//         const customerId = userRes.data.user.customer_id;

//         const [cartRes, wishlistRes] = await Promise.all([
//           axios.get(`http://localhost:5000/cart?customer_id=${customerId}`),
//           axios.get(`http://localhost:5000/wishlist?customer_id=${customerId}`)
//         ]);
        
//         setCartCount(cartRes.data.length);
//         setWishlistCount(wishlistRes.data.length);
//       }
//     } catch (error) {
//       console.error("Error fetching cart/wishlist counts:", error);
//       setCartCount(0);
//       setWishlistCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const refreshCounts = useCallback(async () => {
//     await fetchCounts();
//   }, [fetchCounts]);

//   useEffect(() => {
//     fetchCounts();
//   }, [fetchCounts]);

//   return (
//     <CartWishlistContext.Provider
//       value={{ 
//         cartCount, 
//         wishlistCount, 
//         setCartCount, 
//         setWishlistCount, 
//         fetchCounts,
//         refreshCounts,
//         isLoading
//       }}
//     >
//       {children}
//     </CartWishlistContext.Provider>
//   );
// };

// export const useCartWishlist = (): CartWishlistContextType => {
//   const context = useContext(CartWishlistContext);
//   if (!context) {
//     throw new Error("useCartWishlist must be used within a CartWishlistProvider");
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import axios from "axios";

interface CartWishlistContextType {
  cartCount: number;
  wishlistCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  setWishlistCount: React.Dispatch<React.SetStateAction<number>>;
  fetchCounts: () => void;
  refreshCounts: () => Promise<void>;
  resetCounts: () => void; // added
  isLoading: boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

const API_KEY = "your_super_secret_api_key_123";

export const CartWishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    setIsLoading(true);
    try {
      const userRes = await axios.get(`http://localhost:5000/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (userRes.data.success) {
        const customerId = userRes.data.user.customer_id;

        const [cartRes, wishlistRes] = await Promise.all([
          axios.get(`http://localhost:5000/cart?customer_id=${customerId}`),
          axios.get(`http://localhost:5000/wishlist?customer_id=${customerId}`)
        ]);
        
        setCartCount(cartRes.data.length);
        setWishlistCount(wishlistRes.data.length);
      }
    } catch (error) {
      console.error("Error fetching cart/wishlist counts:", error);
      setCartCount(0);
      setWishlistCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCounts = useCallback(async () => {
    await fetchCounts();
  }, [fetchCounts]);

  // new: reset counts instantly
  const resetCounts = () => {
    setCartCount(0);
    setWishlistCount(0);
  };

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <CartWishlistContext.Provider
      value={{ 
        cartCount, 
        wishlistCount, 
        setCartCount, 
        setWishlistCount, 
        fetchCounts,
        refreshCounts,
        resetCounts, // provided
        isLoading
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = (): CartWishlistContextType => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
};
