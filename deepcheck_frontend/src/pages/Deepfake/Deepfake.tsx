import React from "react";
import "./Deepfake.scss";
import UploadFolder from "../../components/folder/uploadFolder";
import http from "../../utils/http";
import SideConsoleTag from "../../components/SideConsole/tag";
import SideConsoleScore from "../../components/SideConsole/score";
import FaceGrid from "../../components/FaceGrid/FaceGrid";
import Button from "../../components/button/button";

type DeepfakeResponse = {
  origin: string;
  faces: string[];
  isFake: boolean;
  score: number;
};
function Deepfake() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [result, setResult] = React.useState<DeepfakeResponse>({
    origin: "",
    faces: [],
    isFake: false,
    score: 0,
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
          .post("/ai/image/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            setResult(response.data);
            setIsLoading(false);
            setIsComplete(true);
          })
          .catch((error) => {
            const res = error.response;
            if (res.status === 413) {
              console.log("too large file");
            }
            setIsLoading(false);
            console.log(error);
          });
      }
    }
  };
  return (
    <div className="deepfake">
      <div className={"upload" + (isComplete ? " completeLoading" : "")}>
        <input
          type="file"
          ref={fileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <UploadFolder
          title="Deepfake 탐지"
          content="딥러닝과 인공지능 기술을 활용하여 오진을 방지하고<br/>
높은 정확도로 이미지, 음성, 비디오 등 다양한 유형의 딥페이크를 탐지합니다."
          onClick={handleButtonClick}
          isLoading={isLoading}
          isComplete={isComplete}
        />
      </div>
      <div className={"result" + (isComplete ? " show-result" : "")}>
        <div className="origin">
          <div className="image-wrap">
            <img src={result.origin} alt="origin" className="origin-image" />
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
            title={
              result.isFake
                ? "Deepfake가 적용된 파일입니다."
                : "Deepfake가 적용되지 않은 파일입니다."
            }
            type="picture"
            isFake={result.isFake}
          />
          <SideConsoleScore
            title="Deepfake 확률"
            content="숫자가 높을수록 딥페이크일 확률이 높습니다."
            score={result?.score || 0}
            isFake={result.isFake}
            isComplete={isComplete}
          />
          <div className="facegrid-wrap">
            <FaceGrid faces={result.faces} />
          </div>
          <div className="button-wrap">
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

export default Deepfake;
