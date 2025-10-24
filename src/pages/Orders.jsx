import React, { useState, useEffect } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chats/admin/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-section">
      <h2>Recent Chats</h2>

      {orders.length === 0 ? (
        <p>No chat orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Last Message</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((chat) => {
              const lastMsg =
                chat.messages?.[chat.messages.length - 1]?.text || "No messages";
              return (
                <tr key={chat._id}>
                  <td>{chat.buyerId?.name || "Unknown"}</td>
                  <td>{chat.sellerId?.name || "Unknown"}</td>
                  <td>{lastMsg}</td>
                  <td>{new Date(chat.updatedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
