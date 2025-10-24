import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./SellerChats.css";

function SellerChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data);
      } catch (err) {
        console.error("Error loading seller chats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchChats();
  }, [token]); 

  if (loading) return <p className="loading">Loading chats...</p>;

  return (
    <div className="seller-chats-container">
      <h2 className="seller-chats-title">My Chats</h2>

      {chats.length === 0 ? (
        <p className="no-chats">No chats yet.</p>
      ) : (
        <ul className="chats-list">
          {chats.map((chat) => {
            const lastMessage =
              chat.messages?.[chat.messages.length - 1]?.text || "No message yet";
            const buyerName = chat.buyerId?.name || "Unknown Buyer";

            return (
              <li
                key={chat._id}
                className="chat-item"
                onClick={() => navigate(`/chat/${chat._id}`)}
              >
                <div className="chat-info">
                  <h3>{buyerName}</h3>
                  <p className="last-message">{lastMessage}</p>
                </div>
                <span className="chat-arrow">›</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SellerChats;
