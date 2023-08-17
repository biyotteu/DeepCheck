import React, { ReactNode, useEffect, useState } from "react";
import "./Survey.scss";
import Wrap from "../../components/wrap/Wrap";
import ReactPaginate from "react-paginate";
import Chart from "react-apexcharts";
import http from "../../utils/http";
import questions from "../Review/review.json";

type Survey = {
  gender: [];
  age: [];
  rate: [];
  satisfied: [];
  unsatisfied: [];
  unsatisfiedReson: [];
};
function Survey() {
  const [index, setIndex] = useState(1);
  const [datas, setDatas] = useState([[], [], [], [], [], []]);
  useEffect(() => {
    const getSurvey = async () => {
      try {
        const { data }: { data: Survey } = await http.get(
          "/user/getAllSurveyRes/"
        );
        setDatas([
          data.gender,
          data.age,
          data.rate,
          data.satisfied,
          data.unsatisfied,
          data.unsatisfiedReson,
        ]);
      } catch (err) {}
    };
    getSurvey();
  }, []);
  return (
    <div className="survey">
      <Wrap>
        <div className="survey-title">사용성 평가 결과</div>
        <div className="survey-content">
          사용자 대상 사용성 평가 결과 그래프 페이지
        </div>
        <div className="survey-card">
          <div className="content">
            <div className="question-title">
              <img src="/assets/icons/message.svg" />
              questions.questions[idx].title
              <div className="response-count"></div>
            </div>
            <Chart
              options={{
                chart: {
                  width: 500,
                  height: 500,
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "65%",
                    },
                    track: {
                      background: "#E9EBEE",
                    },
                    dataLabels: {
                      name: {
                        show: false,
                      },
                      value: {
                        show: false,
                      },
                    },
                  },
                },
                stroke: {
                  lineCap: "round",
                },
                fill: {
                  colors: [
                    "rgba(70, 42, 241, 1)",
                    "rgba(83, 98, 246, 1)",
                    "rgba(118, 129, 248, 1)",
                    "rgba(160, 165, 250, 1)",
                    "rgba(160, 165, 250, 1)",
                  ],
                },
              }}
              series={datas[index].slice(1, datas[index].length)}
              type="pie"
            />
          </div>
          <div className="pagenation-wrap">
            <ReactPaginate
              // pageRangeDisplayed={5}
              pageCount={6}
              breakLabel="..."
              nextLabel=">"
              onPageChange={(event) => {
                setIndex(event.selected);
              }}
              marginPagesDisplayed={1}
              pageRangeDisplayed={6}
              previousLabel="<"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </Wrap>
    </div>
  );
}

export default Survey;
