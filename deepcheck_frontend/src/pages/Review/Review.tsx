import Wrap from "../../components/wrap/Wrap";
import React, { useState } from "react";
import "./Review.scss";
import questions from "./review.json";
import { toast } from "react-toastify";
import http from "../../utils/http";
import { useNavigate } from "react-router-dom";

function Review() {
  const navigate = useNavigate();
  const [survey, setSurvey] = useState([
    "",
    "",
    "",
    [false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]);
  return (
    <div style={{ backgroundColor: "#F7F8F9" }}>
      <Wrap>
        <div className="review-page">
          <div className="review-title">사용성 평가</div>
          <div className="review-content">
            더 나은 서비스가 될 수 있도록 끊임없이 노력하겠습니다
          </div>
          <div className="question-wrap">
            {questions.questions.map((item, idx) => {
              return (
                <div className="question-card" key={idx}>
                  <div className="question-title">{item.title}</div>
                  {item.multichoise && (
                    <div className="multichoise">*복수선택 가능</div>
                  )}
                  <div className="option-wrap">
                    {item.options.map((option, optIdx) => {
                      return (
                        <div
                          className={
                            item.multichoise
                              ? survey[idx][optIdx]
                                ? "option active"
                                : "option"
                              : survey[idx] === option.value.toString()
                              ? "option active"
                              : "option"
                          }
                          onClick={() => {
                            if (item.multichoise) {
                              setSurvey(
                                survey.map((sur, surIdx) => {
                                  if (surIdx == idx) {
                                    let newData = sur as boolean[];
                                    newData[optIdx] = !newData[optIdx];
                                    return newData;
                                  } else {
                                    return sur;
                                  }
                                })
                              );
                            } else {
                              setSurvey(
                                survey.map((sur, surIdx) => {
                                  if (surIdx == idx) {
                                    return option.value.toString();
                                  } else {
                                    return sur;
                                  }
                                })
                              );
                            }
                          }}
                        >
                          <img
                            src={
                              item.multichoise
                                ? survey[idx][optIdx]
                                  ? "/assets/icons/check_on.svg"
                                  : "/assets/icons/check_off.svg"
                                : survey[idx] === option.value.toString()
                                ? "/assets/icons/check_on.svg"
                                : "/assets/icons/check_off.svg"
                            }
                          />
                          {option.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="submit-review"
            onClick={() => {
              if (survey[0] == "" || survey[1] == "" || survey[2] == "") {
                toast.error("필수 답변을 모두 입력해주세요!");
                return;
              }
              if (
                !(survey[3] as boolean[]).find((now) => now) ||
                !(survey[4] as boolean[]).find((now) => now) ||
                !(survey[5] as boolean[]).find((now) => now)
              ) {
                toast.error("필수 답변을 모두 입력해주세요!");
                return;
              }
              let satisfied = "";
              for (let i = 0; i < survey[3].length; i++) {
                if (survey[3][i]) satisfied = satisfied + (i + 1).toString();
              }
              let unsatisfied = "";
              for (let i = 0; i < survey[4].length; i++) {
                if (survey[3][i])
                  unsatisfied = unsatisfied + (i + 1).toString();
              }
              let unsatisfiedReason = "";
              for (let i = 0; i < survey[5].length; i++) {
                if (survey[3][i])
                  unsatisfiedReason = unsatisfiedReason + (i + 1).toString();
              }
              http
                .post("/user/survey/", {
                  gender: survey[0] == "1" ? "M" : "F",
                  age: Number(survey[1]),
                  rage: Number(survey[2]),
                  satisfied,
                  unsatisfied,
                  unsatisfiedReason,
                })
                .then((response) => {
                  navigate("/");
                  toast("설문에 참여해주셔서 감사합니다!");
                })
                .catch((err) => {
                  toast.error("오류가 발생했습니다!");
                });
            }}
          >
            제출
          </button>
        </div>
      </Wrap>
    </div>
  );
}

export default Review;
