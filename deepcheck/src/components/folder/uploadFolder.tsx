import React from "react";
import "./uploadFolder.scss";

import { ReactComponent as Png } from "../../assets/icons/file_png.svg";
import { ReactComponent as Jpg } from "../../assets/icons/file_jpg.svg";
import { ReactComponent as Alt } from "../../assets/icons/file_image.svg";

import { ReactComponent as Mp3 } from "../../assets/icons/file_mp3.svg";
import { ReactComponent as Wav } from "../../assets/icons/file_wav.svg";
import { ReactComponent as Music } from "../../assets/icons/file_music.svg";

import { ReactComponent as Complete } from "../../assets/icons/complete.svg";

type UploadFolderProps = {
  title: string;
  content: string;
  onClick: () => void;
  isLoading: boolean;
  isComplete: boolean;
  isAudio?: boolean;
};
function UploadFolder({
  title,
  content,
  onClick,
  isLoading,
  isComplete,
  isAudio = false,
}: UploadFolderProps) {
  return (
    <div>
      {!isLoading && !isComplete && (
        <div className="file">
          <div className="click" onClick={onClick}>
            <div className="folder">
              <img src="/assets/images/folder.svg" alt="folder" />
              {isAudio ? <Mp3 className="file1" /> : <Png className="file1" />}
              {isAudio ? (
                <Music className="file2" />
              ) : (
                <Alt className="file2" />
              )}
              {isAudio ? <Wav className="file3" /> : <Jpg className="file3" />}
            </div>
            <div className="button">
              <img
                src={
                  isAudio
                    ? "/assets/icons/fi-rs-file-music.svg"
                    : "/assets/icons/image_alt.svg"
                }
                alt="image_alt"
                width={28}
                height={28}
              />
              <strong>파일 추가</strong>
            </div>
          </div>
          <div className="info">
            <div className="title">{title}</div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className={"loading-section "}>
          <div className="loading">
            <div className="loading-wrap">
              <div className="loading-dot dot1" />
            </div>
            <div className="loading-wrap">
              <div className="loading-dot dot2" />
            </div>
            <div className="loading-wrap">
              <div className="loading-dot dot3" />
            </div>
          </div>
          <div className="loading-message" />
        </div>
      )}
      {isComplete && (
        <div className="complete-section">
          <Complete />
          <div className="complete-message">파일 분석 완료</div>
        </div>
      )}
    </div>
  );
}

export default UploadFolder;
