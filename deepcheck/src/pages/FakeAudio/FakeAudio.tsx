import React from "react";
import "./FakeAudio.scss";
import UploadFolder from "../../components/folder/uploadFolder";
import http from "../../utils/http";
import SideConsoleTag from "../../components/SideConsole/tag";
import SideConsoleScore from "../../components/SideConsole/score";
import Button from "../../components/button/button";

type FakeAudioResponse = {
  score: number;
  isFake: boolean;
  spectrogram: string;
};
function FakeAudio() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [result, setResult] = React.useState<FakeAudioResponse>({
    score: 0,
    isFake: false,
    spectrogram: "",
  });

  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("handle");
    if (files) {
      const reg = /(.*?)\.(mp3|wav|flac|ogg|mat|raw|aifc)$/;
      const file = files[0];
      if (file.name.match(reg)) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        http
          .post("/audio/", formData, {
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
            setIsLoading(false);
            console.log(error);
          });
      }
    }
  };
  return (
    <div className="fake-audio">
      <div className={"upload" + (isComplete ? " completeLoading" : "")}>
        <input
          type="file"
          ref={fileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <UploadFolder
          title="Fake audio 탐지"
          content="딥러닝과 인공지능 기술을 활용하여<br/>
          높은 정확도로 Fake audio를 탐지합니다."
          onClick={handleButtonClick}
          isLoading={isLoading}
          isComplete={isComplete}
          isAudio={true}
        />
      </div>
      <div className={"result" + (isComplete ? " show-result" : "")}>
        <div className="origin">
          <div className="image-wrap">
            <img
              src={result.spectrogram}
              alt="origin"
              className="origin-image"
            />
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
              result.isFake ? "Fake audio입니다." : "Fake audio가 아닙니다."
            }
            type="audio"
            isFake={result.isFake}
          />
          <SideConsoleScore
            title="Fake audio 확률"
            content="숫자가 높을수록 Fake audio일 확률이 높습니다."
            score={result?.score || 0}
            isFake={result.isFake}
            isComplete={isComplete}
          />
          <div style={{ flex: 1 }} />
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

export default FakeAudio;
