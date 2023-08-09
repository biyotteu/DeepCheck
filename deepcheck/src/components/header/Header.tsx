import React from "react";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";
import Wrap from "../wrap/Wrap";

function Header() {
  const getClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? "menu active" : "menu";
  };
  return (
    <header>
      <Wrap>
        <div className="content">
          <Link className="logo" to="/">
            <img src="/assets/logo.png" alt="logo" width={49} height={49} />
            <h1>DeepCheck</h1>
          </Link>
          <div className="menus">
            <NavLink to="/deepfake" className={getClass}>
              Deepfake 탐지
            </NavLink>
            <NavLink to="/preventdeepfake" className={getClass}>
              Deepfake 방지
            </NavLink>
            <NavLink to="/fakeaudio" className={getClass}>
              Fake Audio 탐지
            </NavLink>
          </div>
          <div className="user">
            <Link to="/" className="login">
              로그인
            </Link>
            <Link to="/" className="register">
              회원가입
            </Link>
          </div>
        </div>
      </Wrap>
    </header>
  );
}

export default Header;
