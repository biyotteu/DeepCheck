import React, { ReactNode } from "react";
import "./tag.scss";
import { ReactComponent as AIIcon } from "../../assets/icons/head.svg";
import { ReactComponent as PictureIcon } from "../../assets/icons/picture.svg";

type SideConsoleTagProps = {
  title: string;
  type: string;
};

function SideConsoleTag({ title, type }: SideConsoleTagProps) {
  return (
    <div className={"tag " + type}>
      <div className="icon-wrap">
        {type != "info" ? <AIIcon className="icon" /> : <PictureIcon />}
      </div>
      <div className="title">{title}</div>
    </div>
  );
}

export default SideConsoleTag;
