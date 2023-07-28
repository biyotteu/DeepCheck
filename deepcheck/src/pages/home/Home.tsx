import React from "react";
import "./Home.scss";
import { Link, Route, Routes } from "react-router-dom";
import { ReactComponent as Allow } from "../../assets/icons/long_right.svg";
import Wrap from "../../components/wrap/Wrap";
function Home() {
  return (
    <div className="home">
      <div
        className="intro"
        style={{ backgroundImage: 'url("/assets/images/background.svg")' }}
      >
        <div className="section1">
          <div className="info">
            <h2>
              Deepfake에
              <br />
              안전한 디지털 세상
            </h2>
            <p>
              DeepCheck는 공공의 안전을 위해
              <br />
              딥러닝과 인공지능 기술을 통해 해결하였습니다.
            </p>
            <Link to="/" className="service">
              서비스 이용하기
            </Link>
          </div>
          <div className="images">
            <div className="row">
              <img src="/assets/images/face1.png" alt="face1" />
              <img src="/assets/images/home-logo.svg" alt="home-logo" />
            </div>
            <div className="row">
              <img src="/assets/images/face2.png" alt="face1" />
              <img src="/assets/images/face3.png" alt="face1" />
            </div>
          </div>
        </div>
      </div>
      <div className="details">
        <Wrap>
          <div className="section2">
            <img
              src="/assets/images/background-dot.svg"
              alt="dot"
              className="background-dot1"
            />
            <img
              src="/assets/images/background-dot.svg"
              alt="dot"
              className="background-dot2"
            />
            <Link to="/" className="card">
              <img
                src="/assets/icons/file_find.svg"
                alt="deepfake 탐지"
                width={60}
                height={60}
              />
              <h3>Deepfake 탐지</h3>
              <p>
                딥러닝과 인공지능 기술을 활용하여 오진을 방지하고 높은 정확도로
                이미지, 음성, 비디오 등 다양한 유형의 딥페이크를 탐지합니다.
              </p>
              <div className="arrow-wrap">
                <Allow className="arrow" />
              </div>
            </Link>
            <Link to="/" className="card">
              <img
                src="/assets/icons/image_alt.svg"
                alt="deepfake 방지"
                width={60}
                height={60}
              />
              <h3>Deepfake 탐지</h3>
              <p>
                Deepfake를 방지하기 위한 모듈을 적용하여 이미지에 워터마크 혹은
                노이즈를 적용합니다.
              </p>
              <div className="arrow-wrap">
                <Allow className="arrow" />
              </div>
            </Link>
            <Link to="/" className="card">
              <img
                src="/assets/icons/microphone.svg"
                alt="fake audio 탐지"
                width={60}
                height={60}
              />
              <h3>Audio Fake 탐지</h3>
              <p>
                딥러닝과 인공지능 기술을 활용하여
                <br />
                높은 정확도로 Fake audio를 탐지합니다.
              </p>
              <div className="arrow-wrap">
                <Allow className="arrow" />
              </div>
            </Link>
          </div>
        </Wrap>
      </div>
    </div>
  );
}

export default Home;
