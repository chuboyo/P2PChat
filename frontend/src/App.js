import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import Room from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
