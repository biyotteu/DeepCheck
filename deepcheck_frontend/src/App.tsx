import React from "react";
import "./App.scss";
import Header from "./components/header/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Deepfake from "./pages/Deepfake/Deepfake";
import FakeAudio from "./pages/FakeAudio/FakeAudio";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Watermark from "./pages/Watermark/Watermark";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div className="main">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deepfake" element={<Deepfake />} />
          <Route path="/watermark" element={<Watermark />} />
          <Route path="/fakeaudio" element={<FakeAudio />} />
        </Routes>
        <ToastContainer enableMultiContainer position="bottom-center" />
      </div>
    </RecoilRoot>
  );
}

export default App;
