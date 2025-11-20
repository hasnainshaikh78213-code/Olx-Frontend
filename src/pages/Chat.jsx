import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { io } from "socket.io-client";
import "./Chat.css";


const socket = io("https://olx-backend-blue.vercel.app", {
  path: "/api/socket",
  transports: ["websocket"]
});

function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  // Load chat + old messages
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChat(res.data);
        setMessages(res.data.messages || []);

        // JOIN SOCKET ROOM
        socket.emit("join_chat", id);

      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };

    fetchChat();
  }, [id, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Receive real-time messages
  useEffect(() => {
  socket.on("receive_message", (data) => {
    setMessages(prev => [...prev, data]);
  });

  return () => socket.off("receive_message");
}, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const outgoingMsg = {
      chatId: id,
      sender: loggedInUserId,
      text: newMessage,
    };

    // Send to server (save in DB)
    try {
      await api.post(
        "/chats/send",
        { chatId: id, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Emit real-time socket message
    socket.emit("send_message", outgoingMsg);

    // Show message instantly on sender side
    setMessages((prev) => [...prev, outgoingMsg]);

    setNewMessage("");
  };

  if (!chat) return <p>Loading chat...</p>;

  return (
    <div className="chat-container">
      <h2>CHAT</h2>

      <div className="chat-box">
        {messages.map((msg, i) => {
          const senderName =
            msg.sender === chat.buyerId?._id
              ? chat.buyerId.name
              : msg.sender === chat.sellerId?._id
              ? chat.sellerId.name
              : "User";

          const messageClass = msg.sender === loggedInUserId ? "you" : "other";

          return (
            <div key={i} className={`chat-message ${messageClass}`}>
              <strong>{senderName}: </strong> {msg.text}
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
