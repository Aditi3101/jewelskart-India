import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";

const ProductsByType = () => {
  const { typeId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [typeName, setTypeName] = useState<string>("");

  useEffect(() => {
    if (typeId) {
      axios
        .get<any[]>(`https://jewelskart-backend.onrender.com/api/products/type/${typeId}`)
        .then((res) => {
          setProducts(res.data);
          if (res.data.length > 0) {
            setTypeName(res.data[0].type_name || `Type ${typeId}`);
          }
        })
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, [typeId]);

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div style={{ width: "100%", padding: "20px 0" }}>
        <h3 className="text-center">{typeName}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          {products.length > 0 ? (
            products.map((p) => (
              <Link
                to={`/product/${p.p_id}`}
                key={p.p_id}
                className="zoom-card"
              >
                <div
                  style={{
                    position: "relative",
                    height: "300px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "inset 0 6px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={`https://jewelskart-backend.onrender.com/uploads/${p.fileToUpload}`}
                    alt={p.p_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.4), rgba(255,255,255,0.02) 80%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      color: "#fff",
                      zIndex: 2,
                    }}
                  >
                    <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                      {p.p_name}
                    </div>
                    <div style={{ fontSize: "0.9rem" }}>
                      ₹ {p.p_price} — {p.p_code}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted text-center">No Records Found</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsByType;