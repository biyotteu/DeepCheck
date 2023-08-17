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
  const colors = [
    "rgba(70, 42, 241, 1)",
    "rgba(83, 98, 246, 1)",
    "rgba(118, 129, 248, 1)",
    "rgba(160, 165, 250, 1)",
    "rgba(160, 165, 250, 1)",
  ];
  const [index, setIndex] = useState(0);
  const [datas, setDatas] = useState([
    [30, 40, 60],
    [50, 20, 34, 20, 54, 20],
    [40, 20, 53, 43, 11, 20],
    [80, 20, 20, 20],
    [90, 20, 43, 23, 13],
    [50, 20, 32, 43, 55],
  ]);
  useEffect(() => {
    const getSurvey = async () => {
      try {
        // const { data }: { data: Survey } = await http.get(
        //   "/user/getAllSurveyRes/"
        // );
        // setDatas([
        //   data.gender,
        //   data.age,
        //   data.rate,
        //   data.satisfied,
        //   data.unsatisfied,
        //   data.unsatisfiedReson,
        // ]);
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
              {questions.questions[index].title}
              <div className="response-count">{datas[index][0]}개</div>
            </div>
            <div className="chart-wrap">
              <Chart
                options={{
                  chart: {
                    width: 1000,
                    height: 1000,
                  },
                  legend: {
                    show: false,
                  },
                  plotOptions: {},
                  stroke: {
                    //   lineCap: "round",
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
                width={500}
              />
              <div className="region">
                {questions.questions[index].options.map((item, idx) => {
                  return (
                    <div className="item">
                      <div
                        className="rec"
                        style={{ backgroundColor: colors[idx] }}
                      />
                      {item.title + " (" + datas[index][idx] + "%)"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="pagenation-wrap">
            <ReactPaginate
              // pageRangeDisplayed={5}
              pageCount={6}
              breakLabel="..."
              nextLabel=">"
              onPageChange={(event) => {
                console.log(event.selected);
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
