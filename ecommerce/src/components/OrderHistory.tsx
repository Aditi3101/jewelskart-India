import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import "./OrderHistory.css";

type OrderSummary = {
  order_id: number;
  customer_id: number;
  subtotal: number;
  gst: number;
  total: number;
  invoice_file: string;
  created_at: string;
  invoiceUrl: string;
};

type OrderItem = {
  order_item_id?: number; // optional in case DB doesn't have this column
  p_id: number;
  quantity: number;
  price_at_time: number;
  total_price: number;
  p_name: string;
  fileToUpload: string;
};

type OrderDetail = {
  order_id: number;
  customer_id: number;
  subtotal: number;
  gst: number;
  total: number;
  invoice_file: string;
  created_at: string;
  invoiceUrl: string;
  items: OrderItem[];
};

const API_KEY = "your_super_secret_api_key_123";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  // Inline expansion state per order
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<number>>(new Set());
  const [orderDetailsById, setOrderDetailsById] = useState<Record<number, OrderDetail>>({});
  const [orderDetailsLoading, setOrderDetailsLoading] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const email = localStorage.getItem("userEmail");

  const formatINR = (value: unknown): string => {
    const n = Number(value);
    return Number.isFinite(n) ? `₹${n.toFixed(2)}` : "₹0.00";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!email) throw new Error("Not logged in");
        // fetch user to get id
        const userRes = await axios.get(`http://localhost:5000/user/${email}`, {
          headers: { "x-api-key": API_KEY },
        });

        if (!userRes.data?.success) throw new Error("Failed to load user");
        const customerId = userRes.data.user.customer_id;

        const res = await axios.get(
          `http://localhost:5000/orders?customer_id=${customerId}`,
          { headers: { "x-api-key": API_KEY } }
        );

        if (res.data?.success) {
          setOrders(res.data.orders);
          
          // Auto-fetch product details for all orders to show images and names
          const orderPromises = res.data.orders.map(async (order: OrderSummary) => {
            try {
              const detailRes = await axios.get(`http://localhost:5000/orders/${order.order_id}`, {
                headers: { "x-api-key": API_KEY },
              });
              if (detailRes.data?.success) {
                return { orderId: order.order_id, details: detailRes.data.order };
              }
            } catch (err) {
              console.error(`Failed to fetch details for order ${order.order_id}:`, err);
              // Fallback to minimal details
              return {
                orderId: order.order_id,
                details: {
                  order_id: order.order_id,
                  customer_id: order.customer_id,
                  subtotal: order.subtotal,
                  gst: order.gst,
                  total: order.total,
                  invoice_file: order.invoice_file,
                  created_at: order.created_at,
                  invoiceUrl: order.invoiceUrl,
                  items: [],
                },
              };
            }
          });

          const orderDetails = await Promise.all(orderPromises);
          const detailsMap: Record<number, OrderDetail> = {};
          orderDetails.forEach(({ orderId, details }) => {
            if (details) {
              detailsMap[orderId] = details;
            }
          });
          setOrderDetailsById(detailsMap);
        } else {
          setError("Failed to load orders");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  const toggleOrderDetails = async (orderId: number) => {
    // Collapse if already expanded
    if (expandedOrderIds.has(orderId)) {
      setExpandedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
      return;
    }

    // If details are cached, just expand
    if (orderDetailsById[orderId]) {
      setExpandedOrderIds((prev) => new Set(prev).add(orderId));
      return;
    }

    // Otherwise, fetch and cache
    setOrderDetailsLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await axios.get(`http://localhost:5000/orders/${orderId}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res.data?.success) {
        setOrderDetailsById((prev) => ({ ...prev, [orderId]: res.data.order }));
        setExpandedOrderIds((prev) => new Set(prev).add(orderId));
        return;
      }
    } catch (err) {
      console.error("Order details fetch failed, falling back to summary:", err);
    } finally {
      setOrderDetailsLoading((prev) => ({ ...prev, [orderId]: false }));
    }

    // Fallback to minimal details from the summary list
    const summary = orders.find((o) => o.order_id === orderId);
    if (summary) {
      const minimal: OrderDetail = {
        order_id: summary.order_id,
        customer_id: summary.customer_id,
        subtotal: summary.subtotal,
        gst: summary.gst,
        total: summary.total,
        invoice_file: summary.invoice_file,
        created_at: summary.created_at,
        invoiceUrl: summary.invoiceUrl,
        items: [],
      };
      setOrderDetailsById((prev) => ({ ...prev, [orderId]: minimal }));
      setExpandedOrderIds((prev) => new Set(prev).add(orderId));
    } else {
      alert("Failed to load order details");
    }
  };

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }} className="order-history-container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            color: 'var(--primary-teal)',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '16px'
          }}>Order History</h2>
          <div style={{
            width: '80px',
            height: '3px',
            background: 'var(--primary-sage)',
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </div>
        {loading && <div>Loading...</div>}
        {error && !loading && <div style={{ color: "red" }}>{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div>No orders yet.</div>
        )}

        {!loading && orders.length > 0 && (
          <div style={{ display: "grid", gap: 12 }} className="orders-grid">
            {orders.map((o) => {
              const isExpanded = expandedOrderIds.has(o.order_id);
              const details = orderDetailsById[o.order_id];
              const isLoadingDetails = !!orderDetailsLoading[o.order_id];

              return (
                <div
                  key={o.order_id}
                  className="order-card"
                  style={{
                    border: "1px solid var(--border-light)",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    background: "var(--neutral-white)",
                    boxShadow: "0 4px 16px var(--shadow-light)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    className="order-header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div className="order-info" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {orderDetailsById[o.order_id]?.items?.[0] ? (
                        <>
                          <img
                            className="product-image"
                            src={`http://localhost:5000/uploads/${orderDetailsById[o.order_id].items[0].fileToUpload}`}
                            alt={orderDetailsById[o.order_id].items[0].p_name}
                            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                          />
                          <div className="product-details">
                            <div className="product-name" style={{ fontWeight: 600, fontSize: 14 }}>
                              {orderDetailsById[o.order_id].items[0].p_name}
                            </div>
                            <div className="order-meta" style={{ fontSize: 12, color: "#666" }}>
                              Order #{o.order_id} • {orderDetailsById[o.order_id].items.length} item{orderDetailsById[o.order_id].items.length !== 1 ? 's' : ''}
                            </div>
                            <div style={{ fontSize: 13, color: "#555" }}>
                              {new Date(o.created_at).toLocaleString()}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 600 }}>Order #{o.order_id}</div>
                          <div style={{ fontSize: 13, color: "#555" }}>
                            {new Date(o.created_at).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="order-actions" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ fontWeight: 600 }}>{formatINR(o.total)}</div>
                      <div className="action-buttons">
                        <a
                          href={`http://localhost:5000${o.invoiceUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{
                            background: 'var(--neutral-white)',
                            border: '2px solid var(--primary-teal)',
                            color: 'var(--primary-teal)',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-teal)';
                            e.currentTarget.style.color = 'var(--text-light)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--neutral-white)';
                            e.currentTarget.style.color = 'var(--primary-teal)';
                          }}
                        >
                          Download Invoice
                        </a>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: 'var(--gradient-primary)',
                            color: 'var(--text-light)',
                            border: 'none',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-medium)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => toggleOrderDetails(o.order_id)}
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="expanded-details" style={{
                      borderTop: "1px solid var(--border-light)",
                      paddingTop: 16,
                      background: "var(--bg-secondary)",
                      borderRadius: 8,
                      padding: '16px',
                    }}>
                      {isLoadingDetails && (!details || details.items.length === 0) ? (
                        <div>Loading details...</div>
                      ) : details ? (
                        <div>
                          {/* Removed inner header (Order # and date) for a cleaner details view */}
                          <div style={{ overflowX: "auto" }}>
                            {details.items.length > 0 ? (
                              <table className="table details-table" style={{ minWidth: 600, background: 'var(--neutral-white)', borderRadius: '8px', overflow: 'hidden' }}>
                                <thead style={{ background: 'var(--primary-teal)' }}>
                                  <tr>
                                    <th style={{ color: 'var(--text-light)', fontWeight: '600', padding: '12px' }}>Product</th>
                                    <th style={{ width: 120, color: 'var(--text-light)', fontWeight: '600', padding: '12px' }}>Price</th>
                                    <th style={{ width: 80, color: 'var(--text-light)', fontWeight: '600', padding: '12px' }}>Qty</th>
                                    <th style={{ width: 140, color: 'var(--text-light)', fontWeight: '600', padding: '12px' }}>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {details.items.map((it, i) => (
                                    <tr key={it.order_item_id ?? `${it.p_id}-${i}`} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                      <td style={{ padding: '12px' }}>
                                        <div className="product-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                          <img
                                            src={`http://localhost:5000/uploads/${it.fileToUpload}`}
                                            alt={it.p_name}
                                            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: '1px solid var(--border-light)' }}
                                          />
                                          <div className="product-name" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{it.p_name}</div>
                                        </div>
                                      </td>
                                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatINR(it.price_at_time)}</td>
                                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{it.quantity}</td>
                                      <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>{formatINR(it.total_price)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot style={{ background: 'var(--bg-secondary)' }}>
                                  <tr>
                                    <td colSpan={2} style={{ padding: '8px 12px' }}></td>
                                    <td style={{ fontWeight: 600, padding: '8px 12px', color: 'var(--text-primary)' }}>Subtotal</td>
                                    <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>{formatINR(details.subtotal)}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2} style={{ padding: '8px 12px' }}></td>
                                    <td style={{ fontWeight: 600, padding: '8px 12px', color: 'var(--text-primary)' }}>GST</td>
                                    <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>{formatINR(details.gst)}</td>
                                  </tr>
                                  <tr style={{ borderTop: '2px solid var(--primary-sage)' }}>
                                    <td colSpan={2} style={{ padding: '12px' }}></td>
                                    <td style={{ fontWeight: 700, padding: '12px', color: 'var(--primary-teal)', fontSize: '1.1rem' }}>Total</td>
                                    <td style={{ fontWeight: 700, padding: '12px', color: 'var(--primary-teal)', fontSize: '1.1rem' }}>{formatINR(details.total)}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            ) : (
                              <div style={{ padding: 12, color: "#666" }}>
                                Items are not available for this order.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: 12 }}>No details available.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;


