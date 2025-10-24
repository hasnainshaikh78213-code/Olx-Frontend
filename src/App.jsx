import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductAdd from "./pages/ProductAdd";
import AdminPanel from "./components/AdminPanel";
import AddToCart from "./pages/AddToCart";
import HomeProductDetail from "./pages/HomeProductDetail";
import SellerChats from "./pages/SellerChats";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";


function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/ProductListing/:category" element={<ProductListing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product2/:id" element={<HomeProductDetail />} />
          <Route path="/seller/chats" element={<SellerChats />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/add-product" element={<ProductAdd />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
