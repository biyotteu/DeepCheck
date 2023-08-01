import React, { ReactNode } from "react";
import "./button.scss";

function Button({
  title = "파일추가",
  type = "image",
  onClick,
}: {
  title: string;
  type: string;
  onClick?: () => void;
}) {
  return (
    <div className="button" onClick={onClick}>
      <img
        src="/assets/icons/image_alt.svg"
        alt="image_alt"
        width={28}
        height={28}
      />
      <strong>{title}</strong>
    </div>
  );
}

export default Button;
