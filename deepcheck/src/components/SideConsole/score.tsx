import React, { ReactNode, useEffect, useState } from "react";
import "./score.scss";
import Chart from "react-apexcharts";

type SideConsoleScoreProps = {
  title: string;
  content: string;
  score: number;
  isFake: boolean;
  isComplete: boolean;
};
function SideConsoleScore({
  title,
  content,
  score,
  isFake,
  isComplete,
}: SideConsoleScoreProps) {
  const [animated, setAnimated] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  console.log(score);
  useEffect(() => {
    if (isComplete) {
      const animation = setTimeout(() => {
        setStartAnimation(true);
      }, 2000);
    } else {
      setStartAnimation(false);
      setAnimated(0);
    }
  }, [isComplete]);

  useEffect(() => {
    if (startAnimation) {
      const animation = setInterval(() => {
        setAnimated((prev) => {
          console.log(prev, "!@#!@#@#");
          if (prev >= score * 100) {
            clearInterval(animation);
            return prev;
            // return score * 100;
          } else {
            return prev + 1;
          }
        });
      }, 1000 / (score * 100));
      return () => {
        clearInterval(animation);
      };
    }
  }, [startAnimation]);
  return (
    <div className="score-area">
      <div className="text-info">
        <div className="title">Deepfake 확률</div>
        <div className="content">
          숫자가 높을수록 딥페이크일 확률이 높습니다.
        </div>
      </div>
      <div className="chart-wrap">
        {startAnimation && (
          <Chart
            options={{
              chart: {
                width: 300,
                height: 300,
                animations: {
                  enabled: isComplete,
                  speed: 1100,
                  easing: "easeout",
                },
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
                colors: [isFake ? "#FF334B" : "rgba(6, 199, 85, 1)"],
              },
            }}
            series={[score * 100]}
            type="radialBar"
            width="300"
          />
        )}
        <div className={"number-wrap" + (isFake ? " fake" : "")}>
          {animated}%
        </div>
      </div>
    </div>
  );
}

export default SideConsoleScore;
