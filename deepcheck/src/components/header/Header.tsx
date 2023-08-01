import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import Wrap from "../wrap/Wrap";

function Header() {
  return (
    <header>
      <Wrap>
        <div className="content">
          <Link className="logo" to="/">
            <img src="/assets/logo.png" alt="logo" width={49} height={49} />
            <h1>DeepCheck</h1>
          </Link>
          <div className="menus">
            <Link to="/deepfake" className="menu">
              Deepfake 탐지
            </Link>
            <Link to="/" className="menu">
              Deepfake 방지
            </Link>
            <Link to="/" className="menu">
              Fake Audio 탐지
            </Link>
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
