import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthorizedSelector } from "../../states/token";
import { toast } from "react-toastify";
import http from "../../utils/http";
function ProtectReviewRoute({ children }: { children: JSX.Element }) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    http
      .get("/user/ㅑㄴ녁ㅍ됴/")
      .then((response) => {
        setIsAdmin(true);
      })
      .catch((err) => {});
  }, []);

  if (!isAdmin) {
    toast.error("이미 설문에 참여하였습니다!");
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectReviewRoute;
