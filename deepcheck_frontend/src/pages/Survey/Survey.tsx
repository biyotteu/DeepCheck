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
  const [index, setIndex] = useState(1);
  const [datas, setDatas] = useState([
    [30, 40, 60],
    [20, 20, 20, 20, 20, 20],
    [],
    [],
    [],
    [],
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
              {questions.questions[index - 1].title}
              <div className="response-count">{datas[index - 1][0]}개</div>
            </div>
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
              series={datas[index - 1].slice(1, datas[index - 1].length)}
              type="pie"
              width={500}
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
