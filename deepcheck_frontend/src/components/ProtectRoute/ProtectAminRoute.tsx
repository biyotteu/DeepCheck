import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthorizedSelector, userSelector } from "../../states/token";
import { toast } from "react-toastify";
import http from "../../utils/http";
function ProtectAdminRoute({ children }: { children: JSX.Element }) {
  const userInfo = useRecoilValue(userSelector);

  if (!userInfo?.permission) {
    toast.error("권한이 없습니다!");
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectAdminRoute;
