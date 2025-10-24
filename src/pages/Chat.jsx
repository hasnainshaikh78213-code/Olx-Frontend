import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./Chat.css";

function Chat() {
  const { id } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChat(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    fetchChat();
  }, [id, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await api.post(
        "/chats/send",
        { chatId: id, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.chat.messages);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!chat) return <p>Loading chat...</p>;

  return (
    <div className="chat-container">
      <h2>CHAT</h2>
      <div className="chat-box">
        {messages.map((msg, i) => {
          const senderName =
            msg.sender === chat.buyerId._id ? chat.buyerId.name : chat.sellerId.name;
          const messageClass = msg.sender === loggedInUserId ? "you" : "other";

          return (
            <div key={i} className={`chat-message ${messageClass}`}>
              <strong>{senderName}: </strong>
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
