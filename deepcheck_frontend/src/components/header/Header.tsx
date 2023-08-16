import React from "react";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";
import Wrap from "../wrap/Wrap";
import { slide as Menu } from "react-burger-menu";
import http from "../../utils/http";
import { ToastContainer, toast } from "react-toastify";

function Header() {
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  const emailCheck = (email: string) => {
    if (emailRegEx.test(email)) {
      return true;
    } else {
      toast.error("이메일 형식을 확인해주세요", { containerId: "login" });
      return false;
    }
  };
  const passwordCheck = (password: string) => {
    if (password.match(passwordRegEx) === null) {
      toast.error("비밀번호 형식을 확인해주세요", { containerId: "login" });
      return false;
    } else {
      return true;
    }
  };
  const passwordDoubleCheck = (password: string, passwordChk: string) => {
    if (password !== passwordChk) {
      toast.error("비밀번호가 다릅니다.", { containerId: "login" });
      return false;
    } else {
      return true;
    }
  };

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
  const [overlay, setOverlay] = React.useState(false);
  const [login, setLogin] = React.useState(true);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    passwordCheck: "",
  });
  return (
    <header>
      {overlay && (
        <div
          className="overlay"
          // onClick={() => {
          //   setOverlay(false);
          // }}
        >
          <div className="card">
            <div className="card-header">
              <div className="close-wrap">
                <img
                  src="/assets/icons/close.svg"
                  alt="cross"
                  onClick={() => {
                    setOverlay(false);
                  }}
                />
              </div>
              <a
                className={login ? "active" : ""}
                onClick={() => {
                  setLogin(true);
                }}
              >
                로그인
              </a>
              <a
                className={!login ? "active" : ""}
                onClick={() => {
                  setLogin(false);
                }}
              >
                회원가입
              </a>
            </div>

            <div className="card-content">
              <div className="title">*이메일</div>
              <input
                placeholder="example@gmail.com"
                value={user.email}
                onChange={(e) => {
                  setUser({
                    ...user,
                    email: e.target.value,
                  });
                }}
              />
              <div className="title">*비밀번호</div>
              <input
                type="password"
                placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
                value={user.password}
                onChange={(e) => {
                  setUser({
                    ...user,
                    password: e.target.value,
                  });
                }}
              />
              {!login && (
                <>
                  <div className="title">*비밀번호 확인</div>
                  <input
                    type="password"
                    placeholder="영문, 숫자, 특수문자 조합 8자리 이상"
                    value={user.passwordCheck}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        passwordCheck: e.target.value,
                      });
                    }}
                  />
                </>
              )}
              <div className="button-wrap">
                <button
                  onClick={
                    async () => {
                      if (!emailCheck(user.email)) return;
                      if (login) {
                        try {
                          const { data } = await http.post("/user/login", {
                            email: user.email,
                            password: user.password,
                          });
                          toast("로그인 성공!");
                          console.log(data);
                          setOverlay(false);
                        } catch (err) {
                          console.log(err);
                        }
                      } else {
                        if (
                          !passwordCheck(user.password) &&
                          !passwordDoubleCheck(
                            user.password,
                            user.passwordCheck
                          )
                        )
                          return;
                        try {
                          const { data } = await http.post("/user/create", {
                            email: user.email,
                            password1: user.password,
                            password2: user.passwordCheck,
                          });

                          setOverlay(false);
                          toast("회원가입 성공!\n로그인 해주세요!");
                          console.log(data);
                        } catch (err) {}
                      }
                    }

                    // setOverlay(false);
                  }
                >
                  {login ? "로그인" : "회원가입"}
                </button>
              </div>
            </div>
            <ToastContainer
              enableMultiContainer
              containerId={"login"}
              position={toast.POSITION.BOTTOM_RIGHT}
            />
          </div>
        </div>
      )}
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
            <a
              className="login"
              onClick={() => {
                setOverlay(true);
              }}
            >
              로그인
            </a>
            <a className="register">회원가입</a>
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
                <div
                  className="login-button"
                  onClick={() => {
                    setOverlay(true);
                    setMenuOpen(false);
                  }}
                >
                  로그인
                </div>
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
