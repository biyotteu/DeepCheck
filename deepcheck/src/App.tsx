import React from "react";
import "./App.scss";
import Header from "./components/header/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Deepfake from "./pages/Deepfake/Deepfake";

function App() {
  return (
    <div className="main">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deepfake" element={<Deepfake />} />
      </Routes>
    </div>
  );
}

export default App;
