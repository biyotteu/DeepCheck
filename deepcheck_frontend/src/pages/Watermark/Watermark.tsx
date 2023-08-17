import React from "react";
import "./Watermark.scss";
import UploadFolder from "../../components/folder/uploadFolder";
import http from "../../utils/http";
import SideConsoleTag from "../../components/SideConsole/tag";
import SideConsoleScore from "../../components/SideConsole/score";
import FaceGrid from "../../components/FaceGrid/FaceGrid";
import Button from "../../components/button/button";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { useSetRecoilState } from "recoil";
import { reviewSelector } from "../../states/review";

type Gan = {
  origin: string;
  AttGAN: {
    gen: string;
    advgen: string;
  };
  StarGAN: {
    gen: string;
    advgen: string;
  };
  AttentionGAN: {
    gen: string;
    advgen: string;
  };
  HiSD: {
    gen: string;
    advgen: string;
  };
};
type WatermarkResponse = {
  origin: string;
  watermark: string;
  faces: Gan[];
};
type GanType = "AttGAN" | "StarGAN" | "AttentionGAN" | "HiSD";
function Watermark() {
  const setReviewModal = useSetRecoilState(reviewSelector);

  const ganKey: GanType[] = ["AttGAN", "StarGAN", "AttentionGAN", "HiSD"];
  const [faceIdx, setFaceIdx] = React.useState(0);
  const [ganIdx, setGanIdx] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [result, setResult] = React.useState<WatermarkResponse>({
    origin: "",
    watermark: "",
    faces: [],
  });

  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("handle");
    if (files) {
      const reg = /(.*?)\.(jpg|jpeg|png|gif|bmp|tif|ppm)$/;
      const file = files[0];
      if (file.name.match(reg)) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        http
          .post("/ai/watermark/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response.data);
            setResult(response.data);
            setIsLoading(false);
            setIsComplete(true);
          })
          .catch((error) => {
            const res = error.response;
            if (res.status === 413) {
              console.log("too large file");
              toast.error("파일이 너무 큽니다!", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            } else {
              toast.error("오류가 발생했습니다.", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
            setIsLoading(false);
            console.log(error);
          });
      }
    }
  };
  const download = () => {
    if (!result.watermark) {
      return;
    }
    saveAs(result.watermark, "watermark.jpg");
    setReviewModal(true);
  };
  return (
    <div className="watermark">
      <div className={"upload" + (isComplete ? " completeLoading" : "")}>
        <input
          type="file"
          ref={fileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <UploadFolder
          title="Deepfake 방지"
          content="AI모델을 통해 딥페이크를 방지할 수 있는<br/>
          다양한 노이즈를 적용합니다."
          onClick={handleButtonClick}
          isLoading={isLoading}
          isComplete={isComplete}
        />
      </div>
      <div className={"result" + (isComplete ? " show-result" : "")}>
        <div className="origin">
          <div className="image-wrap">
            <div className="image-view">
              {isComplete && result.faces.length > 0 && (
                <div className="origin-image">
                  <div className="gen-image">
                    <img
                      src={result.faces[faceIdx][ganKey[ganIdx]].gen}
                      alt="gen"
                    />
                    <div className="notice">
                      Deepfake 방지 노이즈를 입히지 않은 경우
                    </div>
                  </div>
                  <div className="gen-image">
                    <img
                      src={result.faces[faceIdx][ganKey[ganIdx]].advgen}
                      alt="advgen"
                    />
                    <div className="notice">
                      Deepfake 방지 노이즈를 입힌 경우
                    </div>
                  </div>
                </div>
              )}
              <div className="gen-menu">
                <div
                  className={"gen-item " + (ganIdx === 0 ? "active" : "")}
                  onClick={() => {
                    setGanIdx(0);
                  }}
                >
                  모델 A
                </div>
                <div
                  className={"gen-item " + (ganIdx === 1 ? "active" : "")}
                  onClick={() => {
                    setGanIdx(1);
                  }}
                >
                  모델 B
                </div>
                <div
                  className={"gen-item " + (ganIdx === 2 ? "active" : "")}
                  onClick={() => {
                    setGanIdx(2);
                  }}
                >
                  모델 C
                </div>
                <div
                  className={"gen-item " + (ganIdx === 3 ? "active" : "")}
                  onClick={() => {
                    setGanIdx(3);
                  }}
                >
                  모델 D
                </div>
              </div>
            </div>
            <img
              src="/assets/images/dotleft.svg"
              alt="dot"
              className="background-dot1"
            />
            <img
              src="/assets/images/dotright.svg"
              alt="dot"
              className="background-dot2"
            />
          </div>
        </div>
        <div className="console">
          <SideConsoleTag
            title="Deepfake를 방지하기 위한 이미지를 생성하였습니다."
            type="info"
            isFake={false}
          />
          <div className="face-section">
            <img src={result.watermark} className="watermark-image" />
            <div className="facegrid-wrap">
              {result.faces.map((face, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setFaceIdx(idx);
                    }}
                    className={
                      faceIdx === idx ? "grid-item active" : "grid-item"
                    }
                  >
                    <img src={face.origin} alt="face_origin" />
                    {faceIdx === idx && <div className="face-overlay" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="button-wrap">
            <button className="download" onClick={download}>
              <img src="/assets/icons/fi-rr-download.svg" />
              다운로드
            </button>
            <Button
              title="파일 변경"
              type="image"
              onClick={() => {
                setIsComplete(false);
                setIsLoading(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watermark;
