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
import { useRecoilValue } from "recoil";
import { isAuthorizedSelector } from "./states/token";
import ProtectRoute from "./components/ProtectRoute/ProtectRoute";
import ReviewModal from "./components/ReviewModal/ReviewModal";
import Review from "./pages/Review/Review";
import UserManagement from "./pages/UserManagement/UserManagement";
import ProtectAdminRoute from "./components/ProtectRoute/ProtectAminRoute";

function App() {
  const isAuth = useRecoilValue(isAuthorizedSelector);

  return (
    <div className="main">
      <ReviewModal />
      <Header />
      {/* <Review /> */}
      {/* <UserManagement /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/deepfake"
          element={
            <ProtectRoute>
              <Deepfake />
            </ProtectRoute>
          }
        />
        <Route
          path="/watermark"
          element={
            <ProtectRoute>
              <Watermark />
            </ProtectRoute>
          }
        />
        <Route
          path="/fakeaudio"
          element={
            <ProtectRoute>
              <FakeAudio />
            </ProtectRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectRoute>
              <Review />
            </ProtectRoute>
          }
        />
        <Route
          path="/usermanage"
          element={
            <ProtectAdminRoute>
              <UserManagement />
            </ProtectAdminRoute>
          }
        />
        <Route
          path="/surveyresult"
          element={
            <ProtectAdminRoute>
              {/*여기에 설문 결과 컴포넌트*/}
              <UserManagement />
            </ProtectAdminRoute>
          }
        />
      </Routes>
      {/* 리뷰 했는지 안했는지 검증 필요 */}
      {/* admin page 권한 확인*/}
      <ToastContainer
        enableMultiContainer
        position="bottom-center"
        autoClose={1000}
      />
    </div>
  );
}

export default App;
