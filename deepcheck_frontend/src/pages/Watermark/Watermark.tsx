import React from "react";
import "./Watermark.scss";
import UploadFolder from "../../components/folder/uploadFolder";
import http from "../../utils/http";
import SideConsoleTag from "../../components/SideConsole/tag";
import SideConsoleScore from "../../components/SideConsole/score";
import FaceGrid from "../../components/FaceGrid/FaceGrid";
import Button from "../../components/button/button";
import { toast } from "react-toastify";

type WatermarkResponse = {
  origin: string;
  faces: string[];
  isFake: boolean;
  score: number;
};
function Watermark() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [result, setResult] = React.useState<WatermarkResponse>({
    origin: "",
    faces: [],
    isFake: true,
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
          .post("/watermark/", formData, {
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
            title="Deepfake를 방지하기 위한 이미지를 생성하였습니다."
            type="info"
            isFake={false}
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

export default Watermark;
