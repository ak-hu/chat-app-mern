import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatProvider from './context/ChatProvider';

export default function App() {
  return (
    <BrowserRouter>
    <ChatProvider>
    
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
      </Routes>
      </ChatProvider>
    </BrowserRouter>

    
  );
}