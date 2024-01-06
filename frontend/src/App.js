import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
