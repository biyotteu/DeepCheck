import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthorizedSelector, userSelector } from "../../states/token";
import { toast } from "react-toastify";
import http from "../../utils/http";
function ProtectReviewRoute({ children }: { children: JSX.Element }) {
  const [isDone, setIsDone] = useState(false);
  const userInfo = useRecoilValue(userSelector);
  useEffect(() => {
    http
      .get("/user/surveyStatus/" + userInfo?.email)
      .then((response) => {
        const { data } = response;
        setIsDone(data.msg);
      })
      .catch((err) => {});
  }, []);

  if (isDone) {
    toast.error("이미 설문에 참여하였습니다!");
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectReviewRoute;
