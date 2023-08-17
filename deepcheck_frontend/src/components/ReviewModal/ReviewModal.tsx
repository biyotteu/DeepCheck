import React, { ReactNode, useState } from "react";
import "./ReviewModal.scss";
import { useRecoilState } from "recoil";
import { reviewSelector } from "../../states/review";
import { Link } from "react-router-dom";

// type ReviewModalProps = {
//   visible: boolean;
//   setVisible: React.Dispatch<React.SetStateAction<boolean>>;
// };

function ReviewModal() {
  const [visible, setVisible] = useRecoilState(reviewSelector);
  return (
    <div
      className="review-modal"
      style={visible ? { display: "flex" } : { display: "none" }}
    >
      <div className="review-card">
        <div className="review-card-top" />
        <div className="image-wrap">
          <img src="/assets/icons/document.svg" />
        </div>
        <div className="review-title">
          DeepCheck
          <br />
          서비스 어떠셨나요?
        </div>
        <div className="review-content">
          더 나은 서비스가 될 수 있도록
          <br />
          끊임없이 노력하겠습니다
        </div>
        <Link
          to="/review"
          className="review-button"
          onClick={() => {
            setVisible(false);
          }}
        >
          사용 평가 참여하기
        </Link>
        <div
          className="review-close"
          onClick={() => {
            setVisible(false);
          }}
        >
          닫기
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
