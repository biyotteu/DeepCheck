import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthorizedSelector } from "../../states/token";
import { toast } from "react-toastify";
function ProtectRoute({ children }: { children: JSX.Element }) {
  const isAuth = useRecoilValue(isAuthorizedSelector);
  if (!isAuth) {
    toast.error("로그인을 해주세요!");
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectRoute;
