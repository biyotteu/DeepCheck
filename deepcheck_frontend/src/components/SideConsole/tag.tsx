import React from "react";
import "./tag.scss";
import { ReactComponent as AIIcon } from "../../assets/icons/head.svg";
import { ReactComponent as PictureIcon } from "../../assets/icons/picture.svg";
import { ReactComponent as Microphone } from "../../assets/icons/fi-ss-microphone.svg";

type SideConsoleTagProps = {
  title: string;
  type: string;
  isFake: boolean;
};

function SideConsoleTag({ title, type, isFake }: SideConsoleTagProps) {
  return (
    <div className={"tag " + (isFake ? "fake" : "")}>
      <div className="icon-wrap">
        {type === "picture" && <AIIcon className="icon" />}
        {type === "info" && <PictureIcon className="icon" />}
        {type === "audio" && <Microphone className="icon" />}
      </div>
      <div className="title">{title}</div>
    </div>
  );
}

export default SideConsoleTag;
