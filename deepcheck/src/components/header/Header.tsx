import React from "react";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";
import Wrap from "../wrap/Wrap";
import { slide as Menu } from "react-burger-menu";

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const closeAllMenusOnEsc = (e: any) => {
    setMenuOpen(false);
  };
  const isMenuOpen = function (state: any) {
    setMenuOpen(state.isOpen);
  };
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
        <div className="mobile-menu">
          <Menu
            isOpen={menuOpen}
            onStateChange={isMenuOpen}
            right
            customBurgerIcon={
              <img src="/assets/icons/burger.svg" alt="burger" />
            }
            customCrossIcon={
              <img src="/assets/icons/fi-rs-cross.svg" alt="cross" />
            }
          >
            <div className="login">
              {true ? (
                <div className="login-button">로그인</div>
              ) : (
                <div>
                  <p>test</p>
                </div>
              )}
            </div>
            <NavLink
              to="/deepfake"
              className="menu"
              onClick={closeAllMenusOnEsc}
            >
              Deepfake 탐지
            </NavLink>
            <NavLink
              to="/preventdeepfake"
              className="menu"
              onClick={closeAllMenusOnEsc}
            >
              Deepfake 방지
            </NavLink>
            <NavLink
              to="/fakeaudio"
              className="menu"
              onClick={closeAllMenusOnEsc}
            >
              Fake Audio 탐지
            </NavLink>
          </Menu>
        </div>
      </Wrap>
    </header>
  );
}

export default Header;
